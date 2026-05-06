import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileName = new Date().toDateString().replaceAll(' ', '_');
const logFile = path.join(__dirname, `../../log/${fileName}.log`);

export const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' });
