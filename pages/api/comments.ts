import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set JSON content type header
  res.setHeader('Content-Type', 'application/json');

  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected successfully to MongoDB');
    const db = client.db("Cluster0");
    const collection = db.collection("comments");
    console.log('Using database:', db.databaseName);
    console.log('Using collection:', collection.collectionName);
    const collection = db.collection("comments");

    if (req.method === 'POST') {
      console.log('POST request received:', req.body);
      const { text, parentId } = req.body;
      
      if (!text || typeof text !== 'string') {
        console.log('Invalid comment text');
        return res.status(400).json({ error: 'Comment text is required' });
      }

      // If parentId is provided, add as a reply
      if (parentId) {
        const parentComment = await collection.findOne({ id: parentId });
        if (!parentComment) {
          return res.status(404).json({ error: 'Parent comment not found' });
        }

        const reply = {
          id: Date.now(),
          text,
          createdAt: new Date().toISOString(),
          likes: 0
        };

        await collection.updateOne(
          { id: parentId },
          { $push: { replies: reply } }
        );

        return res.status(201).json(reply);
      }

      // Otherwise create a new top-level comment
      const newComment = {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
        potentialRating: Math.floor(Math.random() * 100) + 1,
        userEmail: req.body.userEmail || null
      };

      await collection.insertOne(newComment);
      return res.status(201).json(newComment);
    }

    if (req.method === 'GET') {
      const comments = await collection.find({}).toArray();
      return res.status(200).json(comments);
    }

    if (req.method === 'PUT' && req.query.action === 'like') {
      const { id, unlike } = req.body;
      const result = await collection.findOneAndUpdate(
        { id: id },
        { $inc: { likes: unlike ? -1 : 1 } },
        { returnDocument: 'after' }
      );
      
      if (result) {
        return res.status(200).json(result);
      }
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (req.method === 'DELETE') {
      try {
        // Handle reply deletion
        if (req.query.action === 'deleteReply') {
          const parentId = Number(req.query.parentId);
          const replyId = Number(req.query.replyId);
   
          if (isNaN(parentId) || isNaN(replyId)) {
            return res.status(400).json({ error: 'Invalid parentId or replyId' });
          }

          const result = await collection.updateOne(
            { id: parentId },
            { $pull: { replies: { id: replyId } } }
          );

          if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Comment or reply not found' });
          }

          return res.status(200).json({ success: true });
        }

        // Handle main comment deletion
        const { id } = req.query;
        const result = await collection.deleteOne({ id: Number(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Comment not found' });
        }

        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}