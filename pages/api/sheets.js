import { getSheetData } from '../../lib/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { worksheet, range } = req.query;
    try {
      const data = await getSheetData(worksheet, range);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}