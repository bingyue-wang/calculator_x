import {connectToDatabase} from '../../lib/db';
import {withSessionRoute} from '../../lib/withSession';
import {NextApiRequest, NextApiResponse} from 'next';
import {ObjectId} from 'mongodb';

export default withSessionRoute(historyRouteHandler);

async function historyRouteHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const {method, body} = req;

  const {db} = await connectToDatabase();
  const historyCollection = db.collection('history');

  // Access the userId from the session
  const userId = req.session.user._id;

  switch (method) {
    case 'GET':
      try {
        const history = await historyCollection.find({userId}).toArray();
        res.status(200).json({history});
      } catch (error) {
        res.status(500).json({error: error.message});
      }
      break;
    case 'POST':
      try {
        const historyEntry = {
          ...(body),
          userId, // Use the userId directly from the session
          timestamp: new Date(),
        };
        const result = await historyCollection.insertOne(historyEntry);
        res.status(201).json({ message: 'History entry saved', id: result.insertedId });
      } catch (error) {
        res.status(500).json({error: error.message});
      }
      break;
    case 'DELETE':
      try {
        const {id} = body;
        console.log(id, userId);
        const result = await historyCollection.deleteOne({
          _id: new ObjectId(id),
          userId
        });

        if (result.deletedCount === 0) {
          res.status(404).json({message: 'History item not found'});
        } else {
          res.status(200).json({message: 'History item deleted'});
        }
      } catch (error) {
        res.status(500).json({error: error.message});
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
