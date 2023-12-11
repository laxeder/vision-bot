import Client, { ChatType, MessageType, MultiFileAuthState, WhatsAppBot } from "rompot";
import { rmdirSync, existsSync } from "fs";

// SEU NÚMERO DE TELEFONE AQUI
const PHONE_NUMBER = "";

async function start(sessionPath: string) {
  const client = new Client(new WhatsAppBot({ printQRInTerminal: true }), {
    disableAutoCommand: true,
    disableAutoCommandForUnofficialMessage: true,
    disableAutoRead: true,
    disableAutoTyping: true,
    maxReconnectTimes: 500,
    reconnectTimeout: 5000,
  });

  client.on("connecting", () => {
    console.info("Conectando bot...");
  });

  client.on("qr", () => {
    console.info("Escanei-e o QR Code para conectar o bot");
  });

  client.on("code", (code) => {
    console.info("\nCódigo de pareamento: ", code, "\n");
  });

  client.on("open", () => {
    console.info("Bot conectado!");
  });

  client.on("close", () => {
    console.warn("Bot desconectado!");
  });

  client.on("stop", ({ isLogout }) => {
    console.warn("A sessão do bot foi desconectada!");

    if (isLogout) {
      if (existsSync(sessionPath)) {
        rmdirSync(sessionPath, { recursive: true });
      }
    }

    start(sessionPath);
  });

  client.on("message", async (message) => {
    try {
      if (!message.isViewOnce) return;
      if (message.isOld) return;

      const userName = message.user.savedName || message.user.name || message.user.phoneNumber || message.user.id;
      const chatName = message.chat.name || message.chat.phoneNumber || message.chat.id;

      if (message.chat.type == ChatType.Group) {
        message.text = `*Mensagem enviada por* "${userName}" *no grupo* "${chatName}\n\n${message.text}`.trim();
      } else {
        message.text = `*Mensagem enviada por* "${userName}"\n\n${message.text}`.trim();
      }

      message.isViewOnce = false;

      if (message.type == MessageType.Audio) {
        await client.sendMessage(client.bot.id, message.text);
      }

      await client.sendMessage(client.bot.id, message);
    } catch {}
  });

  await client.connect(new MultiFileAuthState(sessionPath, PHONE_NUMBER));
}

start("./session");
