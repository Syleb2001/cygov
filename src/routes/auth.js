import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import { readDb, writeDb, readTempTokens, writeTempTokens } from '../utils/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const db = readDb();
    const existingUser = db.users.find(user => user.email === req.body.email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      ...req.body,
      password: hashedPassword,
      id: uuidv4()
    };

    db.users.push(newUser);
    writeDb(db);

    const { password, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.email === req.body.email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.twoFactorEnabled) {
      const tempToken = uuidv4();
      const { password, twoFactorSecret, ...tempUser } = user;
      return res.json({ 
        requiresTwoFactor: true,
        tempUser: { ...tempUser, tempToken }
      });
    }

    const { password, twoFactorSecret, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Add other auth routes (2FA, password change, etc.)

export default router;