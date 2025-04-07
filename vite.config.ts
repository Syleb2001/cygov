import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import type { User, Note, Deadline, POI } from './src/types';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'auth-api',
      configureServer(server) {
        const DB_PATH = path.join(process.cwd(), 'src/db.json');
        const CHAT_PATH = path.join(process.cwd(), 'src/chat.json');
        const CALENDAR_PATH = path.join(process.cwd(), 'src/calendar.json');
        const POI_PATH = path.join(process.cwd(), 'src/poi.json');

        const readDb = (): { 
          users: User[]; 
          controls: Record<string, { userStatuses: Record<string, string> }> 
        } => {
          try {
            if (!fs.existsSync(DB_PATH)) {
              const initialData = { users: [], controls: {} };
              fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
              return initialData;
            }
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            const parsedData = JSON.parse(data);
            
            if (!parsedData.controls) {
              parsedData.controls = {};
            }
            
            Object.entries(parsedData.controls).forEach(([controlId, control]: [string, any]) => {
              if (!control.userStatuses && control.userId && control.status) {
                parsedData.controls[controlId] = {
                  userStatuses: {
                    [control.userId]: control.status
                  }
                };
              }
            });
            
            fs.writeFileSync(DB_PATH, JSON.stringify(parsedData, null, 2), 'utf-8');
            return parsedData;
          } catch (error) {
            console.error('Error reading database:', error);
            return { users: [], controls: {} };
          }
        };

        const readChat = (): { notes: Note[] } => {
          try {
            if (!fs.existsSync(CHAT_PATH)) {
              const initialData = { notes: [] };
              fs.writeFileSync(CHAT_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
              return initialData;
            }
            const data = fs.readFileSync(CHAT_PATH, 'utf-8');
            return JSON.parse(data);
          } catch (error) {
            console.error('Error reading chat database:', error);
            return { notes: [] };
          }
        };

        const readCalendar = (): { deadlines: Deadline[] } => {
          try {
            if (!fs.existsSync(CALENDAR_PATH)) {
              const initialData = { deadlines: [] };
              fs.writeFileSync(CALENDAR_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
              return initialData;
            }
            const data = fs.readFileSync(CALENDAR_PATH, 'utf-8');
            return JSON.parse(data);
          } catch (error) {
            console.error('Error reading calendar database:', error);
            return { deadlines: [] };
          }
        };

        const readPoi = (): { pois: POI[] } => {
          try {
            if (!fs.existsSync(POI_PATH)) {
              const initialData = { pois: [] };
              fs.writeFileSync(POI_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
              return initialData;
            }
            const data = fs.readFileSync(POI_PATH, 'utf-8');
            return JSON.parse(data);
          } catch (error) {
            console.error('Error reading POI database:', error);
            return { pois: [] };
          }
        };

        const writeDb = (data: { 
          users: User[]; 
          controls: Record<string, { userStatuses: Record<string, string> }> 
        }) => {
          try {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
          } catch (error) {
            console.error('Error writing to database:', error);
            throw new Error('Failed to save data');
          }
        };

        const writeChat = (data: { notes: Note[] }) => {
          try {
            const dir = path.dirname(CHAT_PATH);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(CHAT_PATH, JSON.stringify(data, null, 2), 'utf-8');
          } catch (error) {
            console.error('Error writing to chat database:', error);
            throw new Error('Failed to save chat data');
          }
        };

        const writeCalendar = (data: { deadlines: Deadline[] }) => {
          try {
            const dir = path.dirname(CALENDAR_PATH);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(CALENDAR_PATH, JSON.stringify(data, null, 2), 'utf-8');
          } catch (error) {
            console.error('Error writing to calendar database:', error);
            throw new Error('Failed to save calendar data');
          }
        };

        const writePoi = (data: { pois: POI[] }) => {
          try {
            const dir = path.dirname(POI_PATH);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(POI_PATH, JSON.stringify(data, null, 2), 'utf-8');
          } catch (error) {
            console.error('Error writing to POI database:', error);
            throw new Error('Failed to save POI data');
          }
        };

        server.middlewares.use(async (req, res, next) => {
          if (req.method === 'OPTIONS') {
            res.writeHead(200, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            });
            res.end();
            return;
          }

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Content-Type', 'application/json');

          if (req.url?.startsWith('/api/admin/')) {
            const db = readDb();
            const chat = readChat();
            const calendar = readCalendar();
            const poi = readPoi();

            const authHeader = req.headers.authorization;
            if (!authHeader) {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Unauthorized' }));
              return;
            }

            const token = authHeader.split(' ')[1];
            const user = db.users.find(u => u.id === token);
            if (!user?.isAdmin) {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: 'Forbidden' }));
              return;
            }

            if (req.url === '/api/admin/users') {
              const safeUsers = db.users.map(({ password, twoFactorSecret, ...user }) => user);
              res.end(JSON.stringify({ 
                users: safeUsers,
                controls: db.controls
              }));
              return;
            }

            if (req.url === '/api/admin/notes') {
              res.end(JSON.stringify({ notes: chat.notes }));
              return;
            }

            if (req.url === '/api/admin/deadlines') {
              res.end(JSON.stringify({ deadlines: calendar.deadlines }));
              return;
            }

            if (req.url === '/api/admin/pois') {
              res.end(JSON.stringify({ pois: poi.pois }));
              return;
            }

            if (req.url === '/api/admin/password') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', async () => {
                try {
                  const { email, newPassword } = JSON.parse(body);
                  
                  const userIndex = db.users.findIndex(u => u.email === email);
                  if (userIndex === -1) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'User not found' }));
                    return;
                  }

                  const salt = await bcrypt.genSalt(10);
                  const hashedPassword = await bcrypt.hash(newPassword, salt);

                  db.users[userIndex].password = hashedPassword;
                  writeDb(db);

                  res.end(JSON.stringify({ success: true }));
                } catch (error) {
                  console.error('Error updating password:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update password' }));
                }
              });
              return;
            }
          }

          if (req.url?.startsWith('/api/pois')) {
            const poi = readPoi();
            const db = readDb();

            if (req.method === 'GET') {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const controlId = url.searchParams.get('controlId');
              
              let pois = poi.pois;
              if (controlId) {
                pois = pois.filter(p => p.controlId === controlId);
              }

              res.end(JSON.stringify({ pois }));
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const { controlId, userId, type, content } = JSON.parse(body);
                  
                  if (!controlId || !userId || !type || !content) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  const control = db.controls[controlId];
                  if (!control?.userStatuses[userId] || control.userStatuses[userId] !== 'completed') {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Can only add POI for completed controls' }));
                    return;
                  }

                  const newPoi: POI = {
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

                  res.end(JSON.stringify({ poi: newPoi }));
                } catch (error) {
                  console.error('Error creating POI:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to create POI' }));
                }
              });
              return;
            }

            if (req.method === 'PUT') {
              const poiId = req.url.split('/').pop();
              if (!poiId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'POI ID is required' }));
                return;
              }

              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const updates = JSON.parse(body);
                  const poiIndex = poi.pois.findIndex(p => p.id === poiId);

                  if (poiIndex === -1) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'POI not found' }));
                    return;
                  }

                  poi.pois[poiIndex] = {
                    ...poi.pois[poiIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                  };

                  writePoi(poi);
                  res.end(JSON.stringify({ poi: poi.pois[poiIndex] }));
                } catch (error) {
                  console.error('Error updating POI:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update POI' }));
                }
              });
              return;
            }

            if (req.method === 'DELETE') {
              const poiId = req.url.split('/').pop();
              if (!poiId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'POI ID is required' }));
                return;
              }

              const poiIndex = poi.pois.findIndex(p => p.id === poiId);
              if (poiIndex === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'POI not found' }));
                return;
              }

              poi.pois.splice(poiIndex, 1);
              writePoi(poi);
              res.end(JSON.stringify({ success: true }));
              return;
            }
          }

          if (req.url?.startsWith('/api/deadlines')) {
            const calendar = readCalendar();
            const db = readDb();

            if (req.method === 'GET') {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const controlId = url.searchParams.get('controlId');
              
              let deadlines = calendar.deadlines;
              if (controlId) {
                deadlines = deadlines.filter(d => d.controlId === controlId);
              }

              res.end(JSON.stringify({ deadlines }));
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const { controlId, userId, dueDate, priority, description } = JSON.parse(body);
                  
                  if (!controlId || !userId || !dueDate || !priority) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  const control = db.controls[controlId];
                  if (!control?.userStatuses[userId] || control.userStatuses[userId] !== 'in-progress') {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Can only set deadlines for controls in progress' }));
                    return;
                  }

                  const newDeadline: Deadline = {
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

                  res.end(JSON.stringify({ deadline: newDeadline }));
                } catch (error) {
                  console.error('Error creating deadline:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to create deadline' }));
                }
              });
              return;
            }

            if (req.method === 'PUT') {
              const deadlineId = req.url.split('/').pop();
              if (!deadlineId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Deadline ID is required' }));
                return;
              }

              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const updates = JSON.parse(body);
                  const deadlineIndex = calendar.deadlines.findIndex(d => d.id === deadlineId);

                  if (deadlineIndex === -1) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Deadline not found' }));
                    return;
                  }

                  calendar.deadlines[deadlineIndex] = {
                    ...calendar.deadlines[deadlineIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                  };

                  writeCalendar(calendar);
                  res.end(JSON.stringify({ deadline: calendar.deadlines[deadlineIndex] }));
                } catch (error) {
                  console.error('Error updating deadline:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update deadline' }));
                }
              });
              return;
            }

            if (req.method === 'DELETE') {
              const deadlineId = req.url.split('/').pop();
              if (!deadlineId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Deadline ID is required' }));
                return;
              }

              const deadlineIndex = calendar.deadlines.findIndex(d => d.id === deadlineId);
              if (deadlineIndex === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Deadline not found' }));
                return;
              }

              calendar.deadlines.splice(deadlineIndex, 1);
              writeCalendar(calendar);
              res.end(JSON.stringify({ success: true }));
              return;
            }
          }

          if (req.url?.startsWith('/api/notes')) {
            const chat = readChat();

            if (req.method === 'GET') {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const controlId = url.searchParams.get('controlId');
              
              if (!controlId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Control ID is required' }));
                return;
              }

              const notes = chat.notes.filter(note => note.controlId === controlId);
              res.end(JSON.stringify({ notes }));
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const { controlId, userId, content, attachments } = JSON.parse(body);
                  
                  if (!controlId || !userId || !content) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                  }

                  const newNote: Note = {
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

                  res.end(JSON.stringify({ note: newNote }));
                } catch (error) {
                  console.error('Error creating note:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to create note' }));
                }
              });
              return;
            }

            if (req.method === 'PUT') {
              const noteId = req.url.split('/').pop();
              if (!noteId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Note ID is required' }));
                return;
              }

              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', () => {
                try {
                  const { content } = JSON.parse(body);
                  const noteIndex = chat.notes.findIndex(note => note.id === noteId);

                  if (noteIndex === -1) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Note not found' }));
                    return;
                  }

                  chat.notes[noteIndex] = {
                    ...chat.notes[noteIndex],
                    content,
                    updatedAt: new Date().toISOString()
                  };

                  writeChat(chat);
                  res.end(JSON.stringify({ note: chat.notes[noteIndex] }));
                } catch (error) {
                  console.error('Error updating note:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update note' }));
                }
              });
              return;
            }

            if (req.method === 'DELETE') {
              const noteId = req.url.split('/').pop();
              if (!noteId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Note ID is required' }));
                return;
              }

              const noteIndex = chat.notes.findIndex(note => note.id === noteId);
              if (noteIndex === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Note not found' }));
                return;
              }

              chat.notes.splice(noteIndex, 1);
              writeChat(chat);
              res.end(JSON.stringify({ success: true }));
              return;
            }
          }

          if (req.url?.startsWith('/api/controls')) {
            if (req.method === 'GET') {
              try {
                const db = readDb();
                res.end(JSON.stringify({ controls: db.controls || {} }));
              } catch (error) {
                console.error('Error fetching controls:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to fetch controls' }));
              }
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', async () => {
                try {
                  const { userId, controlId, status } = JSON.parse(body);
                  
                  if (!userId || !controlId || !status) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
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
                  
                  res.end(JSON.stringify({ 
                    success: true, 
                    control: db.controls[controlId] 
                  }));
                } catch (error) {
                  console.error('Error updating control:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to update control' }));
                }
              });
              return;
            }
          }

          if (req.url?.startsWith('/api/auth/')) {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });

              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);

                  if (req.url === '/api/auth/register') {
                    const db = readDb();
                    const existingUser = db.users.find(user => user.email === data.email);

                    if (existingUser) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: 'User already exists' }));
                      return;
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(data.password, salt);

                    const newUser = {
                      ...data,
                      password: hashedPassword,
                      id: uuidv4()
                    };

                    db.users.push(newUser);
                    writeDb(db);

                    const { password, ...userWithoutPassword } = newUser;
                    res.end(JSON.stringify({ user: userWithoutPassword }));
                    return;
                  }

                  if (req.url === '/api/auth/login') {
                    const db = readDb();
                    const user = db.users.find(u => u.email === data.email);

                    if (!user) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'Invalid credentials' }));
                      return;
                    }

                    const validPassword = await bcrypt.compare(data.password, user.password);
                    if (!validPassword) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'Invalid credentials' }));
                      return;
                    }

                    if (user.twoFactorEnabled) {
                      const tempToken = uuidv4();
                      const { password, twoFactorSecret, ...tempUser } = user;
                      res.end(JSON.stringify({ 
                        requiresTwoFactor: true,
                        tempUser: { ...tempUser, tempToken }
                      }));
                      return;
                    }

                    const { password, twoFactorSecret, ...userWithoutPassword } = user;
                    res.end(JSON.stringify({ user: userWithoutPassword }));
                    return;
                  }

                  if (req.url === '/api/auth/verify-login-2fa') {
                    const db = readDb();
                    const user = db.users.find(u => u.email === data.email);

                    if (!user || !user.twoFactorSecret) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'Invalid credentials' }));
                      return;
                    }

                    const verified = speakeasy.totp.verify({
                      secret: user.twoFactorSecret,
                      encoding: 'base32',
                      token: data.token
                    });

                    if (!verified) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'Invalid verification code' }));
                      return;
                    }

                    const { password, twoFactorSecret, ...userWithoutPassword } = user;
                    res.end(JSON.stringify({ user: userWithoutPassword }));
                    return;
                  }

                  if (req.url === '/api/auth/change-password') {
                    const db = readDb();
                    const user = db.users.find(u => u.email === data.email);

                    if (!user) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'User not found' }));
                      return;
                    }

                    const validPassword = await bcrypt.compare(data.currentPassword, user.password);
                    if (!validPassword) {
                      res.statusCode = 401;
                      res.end(JSON.stringify({ error: 'Current password is incorrect' }));
                      return;
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

                    const userIndex = db.users.findIndex(u => u.email === data.email);
                    db.users[userIndex] = {
                      ...user,
                      password: hashedPassword
                    };
                    
                    writeDb(db);
                    res.end(JSON.stringify({ success: true }));
                    return;
                  }

                  if (req.url === '/api/auth/update-level') {
                    const db = readDb();
                    const userIndex = db.users.findIndex(u => u.email === data.email);

                    if (userIndex === -1) {
                      res.statusCode = 404;
                      res.end(JSON.stringify({ error: 'User not found' }));
                      return;
                    }

                    db.users[userIndex] = {
                      ...db.users[userIndex],
                      cyfunLevel: data.cyfunLevel
                    };

                    writeDb(db);

                    const { password, ...userWithoutPassword } = db.users[userIndex];
                    res.end(JSON.stringify({ user: userWithoutPassword }));
                    return;
                  }

                  if (req.url === '/api/auth/setup-2fa') {
                    const db = readDb();
                    const user = db.users.find(u => u.email === data.email);

                    if (!user) {
                      res.statusCode = 404;
                      res.end(JSON.stringify({ error: 'User not found' }));
                      return;
                    }

                    const secret = speakeasy.generateSecret({
                      name: `AuditGov (${user.email})`
                    });

                    const userIndex = db.users.findIndex(u => u.email === data.email);
                    db.users[userIndex] = {
                      ...user,
                      twoFactorSecret: secret.base32,
                      twoFactorEnabled: false
                    };

                    writeDb(db);

                    res.end(JSON.stringify({
                      secret: secret.base32,
                      otpAuthUrl: secret.otpauth_url
                    }));
                    return;
                  }

                  if (req.url === '/api/auth/verify-2fa') {
                    const db = readDb();
                    const user = db.users.find(u => u.email === data.email);

                    if (!user) {
                      res.statusCode = 404;
                      res.end(JSON.stringify({ error: 'User not found' }));
                      return;
                    }

                    const verified = speakeasy.totp.verify({
                      secret: data.secret,
                      encoding: 'base32',
                      token: data.token
                    });

                    if (!verified) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: 'Invalid verification code' }));
                      return;
                    }

                    const userIndex = db.users.findIndex(u => u.email === data.email);
                    db.users[userIndex] = {
                      ...user,
                      twoFactorEnabled: true
                    };

                    writeDb(db);
                    res.end(JSON.stringify({ success: true }));
                    return;
                  }
                } catch (error) {
                  console.error('Error processing request:', error);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Internal server error' }));
                }
              });
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Not found' }));
            }
            return;
          }

          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});