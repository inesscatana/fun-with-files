import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cid } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('StellarDataHub');
    const filesCollection = db.collection('files');

    // Fetch file metadata from MongoDB by CID
    const file = await filesCollection.findOne({ cid });
    if (!file) {
      console.error(`File with CID ${cid} not found in the database`);
      return res.status(404).json({ message: 'File not found' });
    }

    // Fetch the file from Pinata using the CID
    const fileData = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!fileData.ok) {
      console.error(`Error fetching file from Pinata: ${fileData.statusText}`);
      return res.status(500).json({ message: 'Error fetching file from Pinata' });
    }

    const fileBuffer = await fileData.arrayBuffer();

    // Set correct headers for file download
    const mimeType = file.mimeType || 'application/octet-stream';
    const fileName = file.fileName || `file-${cid}`; // Fallback to a default name if not available

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Send the file as a binary buffer
    res.status(200).send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({
      message: 'Error retrieving file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
