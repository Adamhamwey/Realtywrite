import { Scenes } from "telegraf";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";
import axios from "axios";
import { createReadStream, unlinkSync, writeFileSync } from "fs";
import Jimp from "jimp";
import { createCanvas, loadImage } from "canvas";

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
    const {
      fileLink,
      status,
      price,
      location,
      noOfBedRooms,
      noOfBathRooms,
      area,
    } = ctx.session;

    // Download the image
    const response = await axios({
      url: fileLink,
      responseType: "arraybuffer",
    });

    // Load the image with Jimp
    const image = await Jimp.read(response.data);

    // Create a canvas to draw the text
    const canvas = createCanvas(image.bitmap.width, image.bitmap.height);
    const ctxCanvas = canvas.getContext("2d");

    // Draw the image onto the canvas
    const background = await loadImage(response.data);
    ctxCanvas.drawImage(
      background,
      0,
      0,
      image.bitmap.width,
      image.bitmap.height
    );

    // Set styles for the text
    ctxCanvas.font = "bold 50px Arial";
    ctxCanvas.fillStyle = "#FFFFFF";
    ctxCanvas.textAlign = "left";

    // Draw text onto the canvas
    ctxCanvas.fillText("The Real Estate", 30, 70);
    ctxCanvas.fillText("Super App", 30, 130);

    ctxCanvas.font = "bold 60px Arial";
    ctxCanvas.fillStyle = "#00FF00";
    ctxCanvas.fillText(status.toUpperCase(), 30, 200);

    ctxCanvas.font = "bold 80px Arial";
    ctxCanvas.fillStyle = "#FFFFFF";
    ctxCanvas.fillText(price, 30, 300);

    ctxCanvas.font = "bold 60px Arial";
    ctxCanvas.fillText(location, 30, 380);

    ctxCanvas.font = "bold 30px Arial";
    ctxCanvas.fillText(
      `${noOfBedRooms} beds | ${noOfBathRooms} baths | ${area} sqft`,
      30,
      440
    );

    ctxCanvas.fillText(location, 30, 480);

    const outputPath = "./output.jpg";

    // Merge the canvas and the image
    const buffer = canvas.toBuffer("image/jpeg");
    writeFileSync(outputPath, buffer);

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
