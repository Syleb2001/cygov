import express from 'express';
import { readMaturity, writeMaturity } from '../utils/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const maturityData = readMaturity();
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const userScores = maturityData.users[userId]?.scores || {};
    res.json({ scores: userScores });
  } catch (error) {
    console.error('Error fetching maturity data:', error);
    res.status(500).json({ error: 'Failed to fetch maturity data' });
  }
});

router.post('/', (req, res) => {
  try {
    const { requirementId, level, userId, scores } = req.body;
    
    if (!requirementId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const maturityData = readMaturity();
    
    if (!maturityData.users[userId]) {
      maturityData.users[userId] = { scores: {} };
    }
    
    if (scores) {
      maturityData.users[userId].scores[requirementId] = scores;
    } else if (level !== undefined) {
      maturityData.users[userId].scores[requirementId] = level;
    } else {
      return res.status(400).json({ error: 'Either scores or level must be provided' });
    }
    
    writeMaturity(maturityData);
    
    res.json({ 
      success: true, 
      requirementId,
      scores: maturityData.users[userId].scores[requirementId]
    });
  } catch (error) {
    console.error('Error updating maturity level:', error);
    res.status(500).json({ error: 'Failed to update maturity level' });
  }
});

export default router;