import { createReadStream, unlinkSync } from "fs";

import { Scenes, session, Telegraf } from "telegraf";
import axios from "axios";
import Jimp from "jimp";
import dotenv from "dotenv";

import { BOT_TOKEN } from "./const";

dotenv.config();

// Handler factories
const { enter, leave } = Scenes.Stage;

// Greeter scene
const startScene = new Scenes.BaseScene<Scenes.SceneContext>("start");
startScene.enter((ctx) => {
  ctx.reply(
    `Hello ${ctx?.message?.from.first_name}. Use /create command and follow the instructions to create real estate listing images.`
  );
});
startScene.command("create", (ctx) => {
  ctx.scene.enter("create");
});
startScene.on("message", (ctx) =>
  ctx.reply(
    "Please use /create command and follow the instructions to create real estate listing images."
  )
);

// Echo scene
const createScene = new Scenes.BaseScene<Scenes.SceneContext>("create");
createScene.enter((ctx) => ctx.reply("Please upload your iamge."));
createScene.leave((ctx) => ctx.reply("exiting echo scene"));
createScene.command("start", (ctx) => {
  ctx.scene.enter("start");
});
createScene.on("photo", async (ctx) => {
  // Respond to the user
  ctx.reply("Your image is being preocessing. Please wait... ");

  // You can access the photo file details like this
  const photoArray = ctx.message.photo;
  const fileId = photoArray[photoArray.length - 1].file_id; // Get the highest resolution photo

  try {
    // Get the file link
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // Download the image
    const response = await axios({
      url: fileLink.href,
      responseType: "arraybuffer",
    });

    // Load the image with Jimp
    const image = await Jimp.read(response.data);

    // Create a new font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    // Print "Hello" on the image
    image.print(font, 10, 10, "Hello");

    // Save the image
    const outputPath = "./output.jpg";
    await image.writeAsync(outputPath);

    // Send the image back to the user
    await ctx.replyWithPhoto({ source: createReadStream(outputPath) });

    // Clean up the saved image file
    unlinkSync(outputPath);
  } catch (error) {
    console.error("Error processing image:", error);
    ctx.reply("Sorry, there was an error processing your image.");
  }
});
createScene.on("message", (ctx) => ctx.reply("Only image please"));

const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);

bot.command("quit", async (ctx) => {
  // Using context shortcut
  await ctx.leaveChat();
});

const stage = new Scenes.Stage<Scenes.SceneContext>([startScene, createScene]);
bot.use(session());
bot.use(stage.middleware());
bot.start((ctx) => {
  ctx.scene.enter("start");
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
