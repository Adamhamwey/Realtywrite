import { Scenes } from "telegraf";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum } from "../const";
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

      const outputPath1 = "./output1.jpg";
      const outputPath2 = "./output2.jpg";
      await createImage(
        {
          fileLink,
          status,
          price: formattedPrice,
          location,
          noOfBedRooms,
          noOfBathRooms,
          area: formattedAera,
        },
        outputPath1,
        outputPath2
      );

      const userId = ctx?.from?.id;

      // Increment usage count
      await usersCollection.updateOne({ userId }, { $inc: { usageCount: 1 } });

      // Send the image back to the user
      await Promise.allSettled([
        ctx.replyWithPhoto({ source: createReadStream(outputPath1) }),
        ctx.replyWithPhoto({ source: createReadStream(outputPath2) }),
      ]);

      // Clean up the saved image file
      unlinkSync(outputPath1);
      unlinkSync(outputPath2);

      await ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
    } catch (error) {
      console.error("Error processing image:", error);
      ctx.reply(
        `Sorry, there was an error processing your image. Use /${CommandEnum.TRY_AGAIN}.`
      );
    }
  };

  const failCallback = () => ctx.reply(ResponseEnum.PAY_TO_USE);

  await checkUsageCount(userId as number, passCallback, failCallback);
});
generateImageScene.on("message", (ctx) => {
  ctx.reply(`Use /${CommandEnum.CREATE} to create another image.`);
});
