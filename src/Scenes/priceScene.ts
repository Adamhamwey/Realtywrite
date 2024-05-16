import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

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
priceScene.enter((ctx) => {
  ctx.reply("Please enter the price.");
});
priceScene.on(message("text"), (ctx) => {
  ctx.session.price = ctx.message.text;
  ctx.scene.session.price = ctx.message.text;
  ctx.scene.enter(ScenesEnum.LOCATION_SCENE);
});
