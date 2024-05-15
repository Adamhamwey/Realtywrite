import { Scenes } from "telegraf";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";
import axios from "axios";
import { createReadStream, unlinkSync } from "fs";
import Jimp from "jimp";

// Status scene
export const generateImageScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.GENERATE_IMAGE_SCENE
);

generateImageScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.AREA_SCENE);
});
generateImageScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
generateImageScene.command(CommandEnum.CREATE, (ctx) => {
  ctx.scene.enter(ScenesEnum.IMAGE_SCENE);
});
generateImageScene.command(CommandEnum.TRY_AGAIN, (ctx) => {
  ctx.scene.enter(ScenesEnum.GENERATE_IMAGE_SCENE);
});
generateImageScene.enter(async (ctx) => {
  try {
    // Get the file link
    const fileLink = ctx.session.fileLink;

    // Download the image
    const response = await axios({
      url: fileLink,
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

    await ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
  } catch (error) {
    console.error("Error processing image:", error);
    ctx.reply(
      `Sorry, there was an error processing your image. Use /${CommandEnum.TRY_AGAIN}.`
    );
  }
});
generateImageScene.on("message", (ctx) => {
  ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
});
