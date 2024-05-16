import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Price scene
export const priceScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.PRICE_SCENE
);
priceScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.STATUS_SCENE);
});
priceScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
priceScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
priceScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () => ctx.reply("Please enter the price.");

  const failCallback = () =>
    ctx.reply(
      "You have exceeded the free usage limit. Please pay to continue using this functionality."
    );

  await checkUsageCount(userId as number, passCallback, failCallback);
});
priceScene.on(message("text"), (ctx) => {
  ctx.session.price = ctx.message.text;
  ctx.scene.session.price = ctx.message.text;
  ctx.scene.enter(ScenesEnum.LOCATION_SCENE);
});
