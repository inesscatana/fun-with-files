import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise
    const db = client.db('StellarDataHub')
    const filesCollection = db.collection('files')

    const images = await filesCollection.find({}).toArray()

    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error })
  }
}
