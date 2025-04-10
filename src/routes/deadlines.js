import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readCalendar, writeCalendar, readDb } from '../utils/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const calendar = readCalendar();
    const controlId = req.query.controlId;
    
    let deadlines = calendar.deadlines;
    if (controlId) {
      deadlines = deadlines.filter(d => d.controlId === controlId);
    }

    res.json({ deadlines });
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    res.status(500).json({ error: 'Failed to fetch deadlines' });
  }
});

router.post('/', (req, res) => {
  try {
    const { controlId, userId, dueDate, priority, description } = req.body;
    
    if (!controlId || !userId || !dueDate || !priority) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDb();
    const control = db.controls[controlId];
    if (!control?.userStatuses[userId] || control.userStatuses[userId] !== 'in-progress') {
      return res.status(400).json({ error: 'Can only set deadlines for controls in progress' });
    }

    const calendar = readCalendar();
    const newDeadline = {
      id: uuidv4(),
      controlId,
      userId,
      dueDate,
      priority,
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    calendar.deadlines.push(newDeadline);
    writeCalendar(calendar);

    res.json({ deadline: newDeadline });
  } catch (error) {
    console.error('Error creating deadline:', error);
    res.status(500).json({ error: 'Failed to create deadline' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const deadlineId = req.params.id;
    const updates = req.body;
    const calendar = readCalendar();
    const deadlineIndex = calendar.deadlines.findIndex(d => d.id === deadlineId);

    if (deadlineIndex === -1) {
      return res.status(404).json({ error: 'Deadline not found' });
    }

    calendar.deadlines[deadlineIndex] = {
      ...calendar.deadlines[deadlineIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    writeCalendar(calendar);
    res.json({ deadline: calendar.deadlines[deadlineIndex] });
  } catch (error) {
    console.error('Error updating deadline:', error);
    res.status(500).json({ error: 'Failed to update deadline' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deadlineId = req.params.id;
    const calendar = readCalendar();
    const deadlineIndex = calendar.deadlines.findIndex(d => d.id === deadlineId);

    if (deadlineIndex === -1) {
      return res.status(404).json({ error: 'Deadline not found' });
    }

    calendar.deadlines.splice(deadlineIndex, 1);
    writeCalendar(calendar);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting deadline:', error);
    res.status(500).json({ error: 'Failed to delete deadline' });
  }
});

export default router;