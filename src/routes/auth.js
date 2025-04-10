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

router.post('/update-level', async (req, res) => {
  try {
    const { email, cyfunLevel } = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.users[userIndex] = {
      ...db.users[userIndex],
      cyfunLevel
    };

    writeDb(db);

    const { password, twoFactorSecret, ...userWithoutPassword } = db.users[userIndex];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating security level:', error);
    res.status(500).json({ error: 'Failed to update security level' });
  }
});

router.post('/verify-2fa', async (req, res) => {
  try {
    const { email, token, secret } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: secret || user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (secret) {
      const userIndex = db.users.findIndex(u => u.email === email);
      db.users[userIndex] = {
        ...user,
        twoFactorSecret: secret,
        twoFactorEnabled: true
      };
      writeDb(db);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA code' });
  }
});

router.post('/setup-2fa', async (req, res) => {
  try {
    const { email } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = speakeasy.generateSecret({
      name: `AuditGov (${email})`
    });

    res.json({
      secret: secret.base32,
      otpAuthUrl: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const userIndex = db.users.findIndex(u => u.email === email);
    db.users[userIndex] = {
      ...user,
      password: hashedPassword
    };
    
    writeDb(db);
    res.json({ success: true });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;