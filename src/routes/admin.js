import express from 'express';
import bcrypt from 'bcryptjs';
import { readDb, writeDb, readChat, readCalendar, readPoi } from '../utils/db.js';

const router = express.Router();

// Middleware to check admin status
const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const db = readDb();
  const user = db.users.find(u => u.id === token);
  
  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

router.use(checkAdmin);

router.get('/users', (req, res) => {
  try {
    const db = readDb();
    const safeUsers = db.users.map(({ password, twoFactorSecret, ...user }) => user);
    res.json({ 
      users: safeUsers,
      controls: db.controls
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/notes', (req, res) => {
  try {
    const chat = readChat();
    res.json({ notes: chat.notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.get('/deadlines', (req, res) => {
  try {
    const calendar = readCalendar();
    res.json({ deadlines: calendar.deadlines });
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    res.status(500).json({ error: 'Failed to fetch deadlines' });
  }
});

router.get('/pois', (req, res) => {
  try {
    const poi = readPoi();
    res.json({ pois: poi.pois });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Failed to fetch POIs' });
  }
});

router.post('/password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    db.users[userIndex] = {
      ...db.users[userIndex],
      password: hashedPassword
    };

    writeDb(db);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

export default router;