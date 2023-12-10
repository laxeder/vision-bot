"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rompot_1 = __importStar(require("rompot"));
const fs_1 = require("fs");
function start(sessionPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new rompot_1.default(new rompot_1.WhatsAppBot({ printQRInTerminal: true }), {
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
        client.on("open", () => {
            console.info("Bot conectado!");
        });
        client.on("close", () => {
            console.warn("Bot desconectado!");
        });
        client.on("stop", () => {
            console.warn("A sessão do bot foi desconectada!");
            if ((0, fs_1.existsSync)(sessionPath)) {
                (0, fs_1.rmdirSync)(sessionPath);
            }
            start(sessionPath);
        });
        client.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!message.isViewOnce)
                    return;
                if (message.isOld)
                    return;
                const userName = message.user.savedName || message.user.name || message.user.phoneNumber || message.user.id;
                const chatName = message.chat.name || message.chat.phoneNumber || message.chat.id;
                if (message.chat.type == rompot_1.ChatType.Group) {
                    message.text = `*Mensagem enviada por* "${userName}" *no grupo* "${chatName}\n\n${message.text}`.trim();
                }
                else {
                    message.text = `*Mensagem enviada por* "${userName}"\n\n${message.text}`.trim();
                }
                yield client.sendMessage(client.bot.id, message);
            }
            catch (_a) { }
        }));
        yield client.connect(new rompot_1.MultiFileAuthState(sessionPath));
    });
}
start("./session");
