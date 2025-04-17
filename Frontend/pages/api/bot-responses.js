import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Path to the bot_responses.txt file
    const filePath = path.join(process.cwd(), '..', 'backend', 'bot_responses.txt');
    
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Return the content as JSON
    return res.status(200).json({ message: fileContent.trim() });
  } catch (error) {
    console.error('Error reading bot responses:', error);
    return res.status(500).json({ error: 'Failed to read bot responses' });
  }
} 