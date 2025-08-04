require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Component = require('./models/Component');
const InventoryLog = require('./models/InventoryLog');
const { authMiddleware, roleMiddleware } = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory';

// CORS configuration for production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://frontend-deployment-beige.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

let mongoConnected = false;

mongoose.connect(MONGO_URI)
  .then(() => {
    mongoConnected = true;
    console.log('MongoDB connected');
  })
  .catch(err => {
    mongoConnected = false;
    console.error('MongoDB connection error:', err.message);
  });

app.get('/api/test', (req, res) => {
  res.send('Backend Working');
});

app.post('/auth/register', async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/auth/login', async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/admin-only', authMiddleware, roleMiddleware(['Admin']), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you are an admin!` });
});

// Component CRUD routes
app.get('/components', authMiddleware, async (req, res) => {
  try {
    const { name, category, locationBin, minQty, maxQty } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Name filter (case-insensitive partial match)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Category filter (exact match)
    if (category) {
      filter.category = category;
    }
    
    // Location bin filter (case-insensitive partial match)
    if (locationBin) {
      filter.locationBin = { $regex: locationBin, $options: 'i' };
    }
    
    // Quantity range filter
    if (minQty || maxQty) {
      filter.quantity = {};
      if (minQty) {
        filter.quantity.$gte = parseInt(minQty);
      }
      if (maxQty) {
        filter.quantity.$lte = parseInt(maxQty);
      }
    }
    
    const components = await Component.find(filter).sort({ name: 1 });
    res.json(components);
  } catch (err) {
    console.error('Error fetching components:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/components', authMiddleware, roleMiddleware(['Admin', 'LabTechnician']), async (req, res) => {
  try {
    const component = new Component(req.body);
    await component.save();
    res.status(201).json(component);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data.', error: err.message });
  }
});

app.put('/components/:id', authMiddleware, roleMiddleware(['Admin', 'LabTechnician']), async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!component) return res.status(404).json({ message: 'Component not found.' });
    res.json(component);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data.', error: err.message });
  }
});

app.delete('/components/:id', authMiddleware, roleMiddleware(['Admin', 'LabTechnician']), async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found.' });
    res.json({ message: 'Component deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Inward log route
app.post('/logs/inward/:componentId', authMiddleware, roleMiddleware(['Admin', 'LabTechnician']), async (req, res) => {
  const { componentId } = req.params;
  const { quantity, reason } = req.body;
  
  // Convert quantity to number and validate
  const numericQuantity = parseInt(quantity);
  if (!numericQuantity || numericQuantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }
  
  try {
    const component = await Component.findById(componentId);
    if (!component) return res.status(404).json({ message: 'Component not found.' });
    
    // Ensure both values are numbers before addition
    const currentQuantity = parseInt(component.quantity) || 0;
    component.quantity = currentQuantity + numericQuantity;
    component.lastOutwardedAt = new Date();
    await component.save();
    
    const log = new InventoryLog({
      componentId,
      userId: req.user._id,
      actionType: 'inward',
      quantity: numericQuantity,
      reason
    });
    await log.save();
    res.status(201).json({ message: 'Inward logged.', component, log });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Outward log route
app.post('/logs/outward/:componentId', authMiddleware, roleMiddleware(['Admin', 'LabTechnician']), async (req, res) => {
  const { componentId } = req.params;
  const { quantity, reason } = req.body;
  
  // Convert quantity to number and validate
  const numericQuantity = parseInt(quantity);
  if (!numericQuantity || numericQuantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }
  
  try {
    const component = await Component.findById(componentId);
    if (!component) return res.status(404).json({ message: 'Component not found.' });
    
    // Ensure both values are numbers before comparison and subtraction
    const currentQuantity = parseInt(component.quantity) || 0;
    if (currentQuantity < numericQuantity) {
      return res.status(400).json({ message: 'Not enough quantity available.' });
    }
    
    component.quantity = currentQuantity - numericQuantity;
    component.lastOutwardedAt = new Date();
    await component.save();
    
    const log = new InventoryLog({
      componentId,
      userId: req.user._id,
      actionType: 'outward',
      quantity: numericQuantity,
      reason
    });
    await log.save();
    res.status(201).json({ message: 'Outward logged.', component, log });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Alerts route
app.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const lowStock = await Component.find({ $expr: { $lt: ["$quantity", "$criticalThreshold"] } });
    const staleStock = await Component.find({
      $or: [
        { lastOutwardedAt: { $exists: false } },
        { lastOutwardedAt: { $lt: ninetyDaysAgo } }
      ]
    });
    res.json({ lowStock, staleStock });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Stats routes
app.get('/stats/inward', authMiddleware, async (req, res) => {
  try {
    const stats = await InventoryLog.aggregate([
      { $match: { actionType: 'inward' } },
      { $group: {
        _id: { $dateToString: { format: '%m-%Y', date: '$timestamp' } },
        count: { $sum: '$quantity' }
      } },
      { $sort: { '_id': 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

app.get('/stats/outward', authMiddleware, async (req, res) => {
  try {
    const stats = await InventoryLog.aggregate([
      { $match: { actionType: 'outward' } },
      { $group: {
        _id: { $dateToString: { format: '%m-%Y', date: '$timestamp' } },
        count: { $sum: '$quantity' }
      } },
      { $sort: { '_id': 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Admin User Management Routes
// POST /admin/users → create new user with name, email, password, and role
app.post('/admin/users', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Validate role
    const validRoles = ['Admin', 'LabTechnician', 'Researcher', 'Engineer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: Admin, LabTechnician, Researcher, Engineer' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'Researcher' // Default to Researcher if no role specified
    });
    await user.save();

    // Return user data without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({ 
      message: 'User created successfully.',
      user: userResponse
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /admin/users → list all users
app.get('/admin/users', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /admin/users/:id → update user role or info
app.put('/admin/users/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    // Validate role if provided
    const validRoles = ['Admin', 'LabTechnician', 'Researcher', 'Engineer'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be one of: Admin, LabTechnician, Researcher, Engineer' });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from removing their own admin role
    if (user._id.toString() === req.user._id.toString() && role && role !== 'Admin') {
      return res.status(400).json({ message: 'Cannot remove your own admin role.' });
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      message: 'User updated successfully.',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /admin/users/:id → delete a user
app.delete('/admin/users/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  if (!mongoConnected) return res.status(503).json({ message: 'Database not connected.' });

  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ 
      message: 'User deleted successfully.',
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Inventory Management System API', 
    status: 'running',
    version: '1.0.0',
    endpoints: {
      auth: '/auth/login, /auth/register',
      components: '/components',
      logs: '/logs/inward/:id, /logs/outward/:id',
      stats: '/stats/inward, /stats/outward',
      alerts: '/alerts'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
