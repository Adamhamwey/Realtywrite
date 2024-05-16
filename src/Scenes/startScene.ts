import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

// Start scene
export const startScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.START_SCENE
);
startScene.enter((ctx) => {
  ctx.reply(
    `Hello ${ctx?.message?.from.first_name}. To create real estate listing images, please use the ${CommandEnum.CREATE} command and follow the instructions.`
  );
});
startScene.command(CommandEnum.CREATE, (ctx) => {
  ctx.scene.enter(ScenesEnum.IMAGE_SCENE);
});
startScene.on(message("text"), (ctx) =>
  ctx.reply(
    `Please use /${CommandEnum.CREATE} command and follow the instructions to create real estate listing images.`
  )
);
