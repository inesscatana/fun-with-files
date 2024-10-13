import { NextApiRequest, NextApiResponse } from 'next'
import { uploadToPinata } from '../../services/pinataService' // Pinata service logic
import clientPromise from '../../lib/mongodb'
import formidable, { Fields, Files } from 'formidable' // Formidable and its types
import fs from 'fs'

// Disable body parser (to handle FormData)
export const config = {
  api: {
    bodyParser: false,
  },
}

// Function to parse FormData
const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable()
  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        reject(err)
      } else {
        resolve({ fields, files })
      }
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { files, fields } = await parseForm(req)
      const fileOrFiles = files.file

      const filesArray = Array.isArray(fileOrFiles)
        ? fileOrFiles
        : [fileOrFiles]

      for (const file of filesArray) {
        if (!file) {
          console.error('File is missing or invalid')
          return res.status(400).json({ message: 'File is missing or invalid' })
        }

        // Handle metadata fields safely
        const title = Array.isArray(fields.title)
          ? fields.title[0]
          : fields.title || ''
        const description = Array.isArray(fields.description)
          ? fields.description[0]
          : fields.description || ''
        const capsuleDesc = Array.isArray(fields.capsuleDesc)
          ? fields.capsuleDesc[0]
          : fields.capsuleDesc || ''

        // Read the file as binary data
        let fileContent: Buffer
        try {
          fileContent = fs.readFileSync(file.filepath)
        } catch (readError) {
          if (readError instanceof Error) {
            console.error('Error reading file from disk:', readError.message)
            return res.status(500).json({
              message: 'Error reading file from disk',
              error: readError.message,
            })
          } else {
            return res.status(500).json({
              message: 'Unknown error reading file from disk',
            })
          }
        }

        // Upload the binary file to Pinata
        let pinataResponse
        try {
          pinataResponse = await uploadToPinata(
            fileContent,
            file.originalFilename || 'file'
          )
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error uploading file to Pinata:', error.message)
            return res.status(500).json({
              message: 'Error uploading file to Pinata',
              error: error.message,
            })
          } else {
            return res
              .status(500)
              .json({ message: 'Unknown error uploading to Pinata' })
          }
        }

        // Store file metadata in MongoDB
        try {
          const client = await clientPromise
          const db = client.db('StellarDataHub')
          const filesCollection = db.collection('files')

          const fileMetadata = {
            fileName: file.originalFilename || 'file',
            mimeType: file.mimetype || 'application/octet-stream',
            title, // Store the title
            description, // Store the description
            capsuleDesc, // Store the time capsule description
            cid: pinataResponse.IpfsHash,
            uploadDate: new Date(),
          }

          await filesCollection.insertOne(fileMetadata)
        } catch (mongoError) {
          if (mongoError instanceof Error) {
            console.error(
              'Error saving file metadata to MongoDB:',
              mongoError.message
            )
            return res.status(500).json({
              message: 'Error saving file metadata to MongoDB',
              error: mongoError.message,
            })
          } else {
            return res
              .status(500)
              .json({ message: 'Unknown error saving to MongoDB' })
          }
        }
      }

      res.status(200).json({
        message: 'File uploaded successfully!',
        cids: filesArray.map((file) => file?.originalFilename),
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error('General error:', error.message)
        res.status(500).json({
          message: 'General error uploading file',
          error: error.message,
        })
      } else {
        res.status(500).json({
          message: 'Unknown error during upload process',
        })
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
