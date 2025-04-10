import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb, readTempTokens, writeTempTokens } from '../utils/db.js';

const router = express.Router();

// Get company users
router.get('/company', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const db = readDb();
    const user = db.users.find(u => u.id === token);
    
    if (!user) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const companyUsers = db.users.filter(u => 
      u.companyName === user.companyName && u.id !== user.id
    );

    const safeUsers = companyUsers.map(({ password, twoFactorSecret, ...user }) => user);
    res.json({ users: safeUsers });
  } catch (error) {
    console.error('Error fetching company users:', error);
    res.status(500).json({ error: 'Failed to fetch company users' });
  }
});

// Create new user
router.post('/create', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const db = readDb();
    const adminUser = db.users.find(u => u.id === token);
    
    if (!adminUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email, firstName, lastName, companyName, cyfunLevel } = req.body;
    
    if (!email || !firstName || !lastName || !companyName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const setupToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const tokens = readTempTokens();
    tokens[setupToken] = {
      email,
      companyName,
      expiresAt: expiresAt.toISOString()
    };
    writeTempTokens(tokens);

    const newUser = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      companyName,
      cyfunLevel: cyfunLevel || 'basic',
      twoFactorEnabled: false,
      isActive: false
    };

    db.users.push(newUser);
    writeDb(db);

    const setupUrl = `/setup-password?token=${setupToken}`;
    res.json({ 
      success: true,
      setupUrl
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Setup password for new user
router.post('/setup-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tokens = readTempTokens();
    const tokenData = tokens[token];
    
    if (!tokenData || new Date(tokenData.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.email === tokenData.email);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.users[userIndex] = {
      ...db.users[userIndex],
      password: hashedPassword,
      isActive: true
    };

    delete tokens[token];
    writeTempTokens(tokens);
    writeDb(db);

    res.json({ success: true });
  } catch (error) {
    console.error('Error setting up password:', error);
    res.status(500).json({ error: 'Failed to set up password' });
  }
});

export default router;