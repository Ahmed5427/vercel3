export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://128.140.37.194:5000/archive-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Archive API Error:', error);
      res.status(500).json({ error: 'Failed to archive letter' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}