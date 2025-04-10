import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../src/db.json');
const CHAT_PATH = path.join(__dirname, '../../src/chat.json');
const CALENDAR_PATH = path.join(__dirname, '../../src/calendar.json');
const POI_PATH = path.join(__dirname, '../../src/poi.json');
const MATURITY_PATH = path.join(__dirname, '../../src/maturity.json');
const TEMP_TOKENS_PATH = path.join(__dirname, '../../src/temp_tokens.json');

export const readDb = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = { users: [], controls: {} };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], controls: {} };
  }
};

export const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
    throw new Error('Failed to save data');
  }
};

// Similar functions for other data files
export const readChat = () => JSON.parse(fs.readFileSync(CHAT_PATH, 'utf-8'));
export const writeChat = (data) => fs.writeFileSync(CHAT_PATH, JSON.stringify(data, null, 2), 'utf-8');
export const readCalendar = () => JSON.parse(fs.readFileSync(CALENDAR_PATH, 'utf-8'));
export const writeCalendar = (data) => fs.writeFileSync(CALENDAR_PATH, JSON.stringify(data, null, 2), 'utf-8');
export const readPoi = () => JSON.parse(fs.readFileSync(POI_PATH, 'utf-8'));
export const writePoi = (data) => fs.writeFileSync(POI_PATH, JSON.stringify(data, null, 2), 'utf-8');
export const readMaturity = () => JSON.parse(fs.readFileSync(MATURITY_PATH, 'utf-8'));
export const writeMaturity = (data) => fs.writeFileSync(MATURITY_PATH, JSON.stringify(data, null, 2), 'utf-8');
export const readTempTokens = () => {
  try {
    if (!fs.existsSync(TEMP_TOKENS_PATH)) {
      fs.writeFileSync(TEMP_TOKENS_PATH, JSON.stringify({}), 'utf-8');
      return {};
    }
    return JSON.parse(fs.readFileSync(TEMP_TOKENS_PATH, 'utf-8'));
  } catch (error) {
    console.error('Error reading temp tokens:', error);
    return {};
  }
};
export const writeTempTokens = (data) => fs.writeFileSync(TEMP_TOKENS_PATH, JSON.stringify(data, null, 2), 'utf-8');