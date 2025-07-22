require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');

const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

app.use(bodyParser.json());

client.once('ready', () => {
  console.log(`✅ Bot is online als ${client.user.tag}`);
});

app.post('/webhook', async (req, res) => {
  const email = req.body.email || "onbekend";
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    const invite = await channel.createInvite({
      maxUses: 1,
      maxAge: 0,
      unique: true,
      reason: `Invite voor ${email}`
    });

    console.log(`🎟️ Invite gegenereerd: ${invite.url}`);
    res.status(200).json({ invite_url: invite.url });
  } catch (err) {
    console.error("❌ Fout bij aanmaken invite:", err);
    res.status(500).json({ error: "Invite aanmaken mislukt" });
  }
});

client.login(process.env.DISCORD_TOKEN);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🌐 Webhook server draait op poort ${process.env.PORT || 3000}`);
});