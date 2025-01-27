import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Location scene
export const locationScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.LOCATION_SCENE
);
locationScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.PRICE_SCENE);
});
locationScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
locationScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
locationScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () =>
    ctx.reply('Please enter your location (e.g., "City" or "Town, State").');

  const failCallback = async () => {
    await ctx.reply(ResponseEnum.PAY_TO_USE);
    ctx.scene.enter(ScenesEnum.PAYMENT_SCENE);
  };

  await checkUsageCount(userId as number, passCallback, failCallback);
});
locationScene.on(message("text"), (ctx) => {
  ctx.session.location = ctx.message.text;
  ctx.scene.session.location = ctx.message.text;
  ctx.scene.enter(ScenesEnum.BED_ROOMS_SCENE);
});
