import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readPoi, writePoi, readDb } from '../utils/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const poi = readPoi();
    const controlId = req.query.controlId;
    
    let pois = poi.pois;
    if (controlId) {
      pois = pois.filter(p => p.controlId === controlId);
    }

    res.json({ pois });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    res.status(500).json({ error: 'Failed to fetch POIs' });
  }
});

router.post('/', (req, res) => {
  try {
    const { controlId, userId, type, content } = req.body;
    
    if (!controlId || !userId || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDb();
    const control = db.controls[controlId];
    if (!control?.userStatuses[userId] || control.userStatuses[userId] !== 'completed') {
      return res.status(400).json({ error: 'Can only add POI for completed controls' });
    }

    const poi = readPoi();
    const newPoi = {
      id: uuidv4(),
      controlId,
      userId,
      type,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    poi.pois.push(newPoi);
    writePoi(poi);

    res.json({ poi: newPoi });
  } catch (error) {
    console.error('Error creating POI:', error);
    res.status(500).json({ error: 'Failed to create POI' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const poiId = req.params.id;
    const updates = req.body;
    const poi = readPoi();
    const poiIndex = poi.pois.findIndex(p => p.id === poiId);

    if (poiIndex === -1) {
      return res.status(404).json({ error: 'POI not found' });
    }

    poi.pois[poiIndex] = {
      ...poi.pois[poiIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    writePoi(poi);
    res.json({ poi: poi.pois[poiIndex] });
  } catch (error) {
    console.error('Error updating POI:', error);
    res.status(500).json({ error: 'Failed to update POI' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const poiId = req.params.id;
    const poi = readPoi();
    const poiIndex = poi.pois.findIndex(p => p.id === poiId);

    if (poiIndex === -1) {
      return res.status(404).json({ error: 'POI not found' });
    }

    poi.pois.splice(poiIndex, 1);
    writePoi(poi);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting POI:', error);
    res.status(500).json({ error: 'Failed to delete POI' });
  }
});

export default router;