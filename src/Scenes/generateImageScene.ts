import { Scenes } from "telegraf";
import { ImageCreatorContext } from "../Interfaces";
import {
  CommandEnum,
  CREDITS_PER_GENERATION,
  ResponseEnum,
  ScenesEnum,
} from "../const";
import { createReadStream, unlinkSync } from "fs";
import { formatCurrency, formatDecimals } from "../utils/formatingUtils";
import { createImage } from "../utils/imageUtils";
import { usersCollection } from "../db";
import { checkUsageCount } from "../payWall";

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
generateImageScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
generateImageScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = async () => {
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

      const formattedPrice = formatCurrency(Number(price));
      const formattedAera = formatDecimals(Number(area));

      const { buffer1_1, buffer16_9 } = await createImage({
        fileLink,
        status,
        price: formattedPrice,
        location,
        noOfBedRooms,
        noOfBathRooms,
        area: formattedAera,
      });

      const userId = ctx?.from?.id;

      // Increment usage count
      await usersCollection.updateOne({ userId }, { $inc: { usageCount: 1 } });

      // Decrement credits available
      await usersCollection.updateOne(
        { userId },
        { $inc: { creditsAvailable: -1 * CREDITS_PER_GENERATION } }
      );

      // Send the image back to the user
      await Promise.allSettled([
        ctx.replyWithPhoto({ source: buffer1_1 }),
        ctx.replyWithPhoto({ source: buffer16_9 }),
      ]);

      await ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
    } catch (error) {
      console.error("Error processing image:", error);
      ctx.reply(
        `Sorry, there was an error processing your image. Use /${CommandEnum.TRY_AGAIN}.`
      );
    }
  };

  const failCallback = async () => {
    await ctx.reply(ResponseEnum.PAY_TO_USE);
    ctx.scene.enter(ScenesEnum.PAYMENT_SCENE);
  };

  await checkUsageCount(userId as number, passCallback, failCallback);
});
generateImageScene.on("message", (ctx) => {
  ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
});
