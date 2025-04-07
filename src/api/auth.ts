import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../types';

const DB_PATH = path.join(process.cwd(), 'src/db.json');

export const readDb = (): { users: User[] } => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // If file doesn't exist, create it with empty users array
      const initialData = { users: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [] };
  }
};

export const writeDb = (data: { users: User[] }) => {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Failed to save user data');
  }
};

export const register = (userData: Omit<User, 'id'>) => {
  try {
    // Read current database
    const db = readDb();
    
    // Check if user already exists
    const existingUser = db.users.find(user => user.email === userData.email);
    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Create new user with ID
    const newUser = {
      ...userData,
      id: uuidv4()
    };

    // Add to database
    db.users.push(newUser);
    
    // Save updated database
    writeDb(db);

    // Return user data without password
    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Registration failed' };
  }
};

export const login = (email: string, password: string) => {
  try {
    const db = readDb();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed' };
  }
};

export const changePassword = async (email: string, currentPassword: string, newPassword: string) => {
  try {
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { error: 'User not found' };
    }

    const user = db.users[userIndex];
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return { error: 'Current password is incorrect' };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    db.users[userIndex].password = hashedPassword;
    writeDb(db);

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { error: 'Failed to change password' };
  }
};

export const adminChangePassword = async (email: string, newPassword: string) => {
  try {
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { error: 'User not found' };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    db.users[userIndex].password = hashedPassword;
    writeDb(db);

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Admin password change error:', error);
    return { error: 'Failed to update password' };
  }
};