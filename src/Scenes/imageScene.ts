import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Image scene
export const imageScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.IMAGE_SCENE
);
imageScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () => ctx.reply("Please upload your image.");

  const failCallback = async () => {
    await ctx.reply(ResponseEnum.PAY_TO_USE);
    ctx.scene.enter(ScenesEnum.PAYMENT_SCENE);
  };

  await checkUsageCount(userId as number, passCallback, failCallback);
});
imageScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
imageScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
imageScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
imageScene.on(message("photo"), async (ctx) => {
  // You can access the photo file details like this
  const photoArray = ctx.message.photo;
  const fileId = photoArray[photoArray.length - 1].file_id; // Get the highest resolution photo

  try {
    // Get the file link
    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.fileLink = fileLink.href;
    ctx.session.fileLink = fileLink.href;
    ctx.scene.session.fileLink = fileLink.href;
    ctx.scene.enter(ScenesEnum.STATUS_SCENE);
  } catch (error) {
    console.error("Error processing image:", error);
    ctx.reply(
      "Sorry, there was an error processing your image. Please try sending it again."
    );
  }
});
imageScene.on(message("text"), (ctx) =>
  ctx.reply("Please upload an image only.")
);
