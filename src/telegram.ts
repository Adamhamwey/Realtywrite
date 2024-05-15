import { createReadStream } from "fs";
import { BOT_TOKEN, CHAT_ID, FILE_ID } from "./const";
import { Input, Telegraf } from "telegraf";

const bot = new Telegraf(BOT_TOKEN);

export async function sendTelegramTextMessage(text: string) {
  try {
    await bot.telegram.sendMessage(CHAT_ID, text, {
      parse_mode: "HTML",
    });

    console.log("Message sent successfully");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

export async function sendTelegramTextMessageWithImage(
  path: string,
  caption: string
) {
  const photo = Input.fromLocalFile(path); // Not in use until use a different image

  try {
    await bot.telegram.sendPhoto(CHAT_ID, FILE_ID, {
      parse_mode: "HTML",
      caption,
    });

    console.log("Message sent successfully");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}
