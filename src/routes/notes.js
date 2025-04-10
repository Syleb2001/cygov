import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readChat, writeChat } from '../utils/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const chat = readChat();
    const controlId = req.query.controlId;
    
    if (!controlId) {
      return res.status(400).json({ error: 'Control ID is required' });
    }

    const notes = chat.notes.filter(note => note.controlId === controlId);
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

router.post('/', (req, res) => {
  try {
    const { controlId, userId, content, attachments } = req.body;
    
    if (!controlId || !userId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const chat = readChat();
    const newNote = {
      id: uuidv4(),
      controlId,
      userId,
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    chat.notes.push(newNote);
    writeChat(chat);

    res.json({ note: newNote });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { content } = req.body;
    const noteId = req.params.id;
    const chat = readChat();
    const noteIndex = chat.notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    chat.notes[noteIndex] = {
      ...chat.notes[noteIndex],
      content,
      updatedAt: new Date().toISOString()
    };

    writeChat(chat);
    res.json({ note: chat.notes[noteIndex] });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const chat = readChat();
    const noteIndex = chat.notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    chat.notes.splice(noteIndex, 1);
    writeChat(chat);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;