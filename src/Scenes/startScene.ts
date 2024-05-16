import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Start scene
export const startScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.START_SCENE
);
startScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () =>
    ctx.reply(
      `Hello ${ctx?.message?.from.first_name}. To create real estate listing images, please use the /${CommandEnum.CREATE} command and follow the instructions.`
    );

  const failCallback = () =>
    ctx.reply(
      "You have exceeded the free usage limit. Please pay to continue using this functionality."
    );

  await checkUsageCount(userId as number, passCallback, failCallback);
});
startScene.command(CommandEnum.CREATE, (ctx) => {
  ctx.scene.enter(ScenesEnum.IMAGE_SCENE);
});
startScene.on(message("text"), (ctx) =>
  ctx.reply(
    `Please use /${CommandEnum.CREATE} command and follow the instructions to create real estate listing images.`
  )
);
