import express from 'express';
import { readDb, writeDb } from '../utils/db.js';

const router = express.Router();

// Get all controls or specific control
router.get('/', (req, res) => {
  try {
    const db = readDb();
    const controlId = req.query.controlId;

    if (controlId) {
      const control = db.controls[controlId];
      if (!control) {
        return res.status(404).json({ error: 'Control not found' });
      }
      return res.json({ control });
    }

    res.json({ controls: db.controls || {} });
  } catch (error) {
    console.error('Error fetching controls:', error);
    res.status(500).json({ error: 'Failed to fetch controls' });
  }
});

// Update control status
router.post('/', (req, res) => {
  try {
    const { userId, controlId, status } = req.body;
    
    if (!userId || !controlId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const db = readDb();
    
    if (!db.controls) {
      db.controls = {};
    }
    
    if (!db.controls[controlId]) {
      db.controls[controlId] = { userStatuses: {} };
    }
    
    if (!db.controls[controlId].userStatuses) {
      db.controls[controlId].userStatuses = {};
    }
    
    db.controls[controlId].userStatuses[userId] = status;
    writeDb(db);
    
    res.json({ 
      success: true, 
      control: db.controls[controlId] 
    });
  } catch (error) {
    console.error('Error updating control:', error);
    res.status(500).json({ error: 'Failed to update control' });
  }
});

// Bulk update controls
router.post('/bulk', (req, res) => {
  try {
    const { userId, controls } = req.body;
    
    if (!userId || !controls || !Array.isArray(controls)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const db = readDb();
    
    if (!db.controls) {
      db.controls = {};
    }

    controls.forEach(({ controlId, status }) => {
      if (!controlId || !status) return;
      
      if (!['pending', 'in-progress', 'completed'].includes(status)) return;

      if (!db.controls[controlId]) {
        db.controls[controlId] = { userStatuses: {} };
      }
      
      if (!db.controls[controlId].userStatuses) {
        db.controls[controlId].userStatuses = {};
      }
      
      db.controls[controlId].userStatuses[userId] = status;
    });

    writeDb(db);
    
    res.json({ 
      success: true,
      controls: db.controls
    });
  } catch (error) {
    console.error('Error updating controls in bulk:', error);
    res.status(500).json({ error: 'Failed to update controls' });
  }
});

// Get user's control statuses
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = readDb();

    const userStatuses = {};
    Object.entries(db.controls || {}).forEach(([controlId, control]) => {
      if (control.userStatuses && control.userStatuses[userId]) {
        userStatuses[controlId] = control.userStatuses[userId];
      }
    });

    res.json({ statuses: userStatuses });
  } catch (error) {
    console.error('Error fetching user control statuses:', error);
    res.status(500).json({ error: 'Failed to fetch user control statuses' });
  }
});

// Reset user's control status
router.delete('/user/:userId/control/:controlId', (req, res) => {
  try {
    const { userId, controlId } = req.params;
    const db = readDb();

    if (!db.controls?.[controlId]?.userStatuses?.[userId]) {
      return res.status(404).json({ error: 'Control status not found' });
    }

    delete db.controls[controlId].userStatuses[userId];
    writeDb(db);

    res.json({ 
      success: true,
      message: 'Control status reset successfully'
    });
  } catch (error) {
    console.error('Error resetting control status:', error);
    res.status(500).json({ error: 'Failed to reset control status' });
  }
});

// Get statistics for controls
router.get('/stats', (req, res) => {
  try {
    const db = readDb();
    const stats = {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      byUser: {}
    };

    Object.values(db.controls || {}).forEach(control => {
      Object.entries(control.userStatuses || {}).forEach(([userId, status]) => {
        // Initialize user stats if not exists
        if (!stats.byUser[userId]) {
          stats.byUser[userId] = {
            completed: 0,
            inProgress: 0,
            pending: 0
          };
        }

        // Update global stats
        stats.total++;
        if (status === 'completed') {
          stats.completed++;
          stats.byUser[userId].completed++;
        } else if (status === 'in-progress') {
          stats.inProgress++;
          stats.byUser[userId].inProgress++;
        } else {
          stats.pending++;
          stats.byUser[userId].pending++;
        }
      });
    });

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching control statistics:', error);
    res.status(500).json({ error: 'Failed to fetch control statistics' });
  }
});

export default router;