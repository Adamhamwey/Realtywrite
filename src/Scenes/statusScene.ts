import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum, StatusEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Status scene
export const statusScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.STATUS_SCENE
);

statusScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.IMAGE_SCENE);
});
statusScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
statusScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
statusScene.enter(async (ctx) => {
  // Define the menu options
  const menuOptions = Markup.inlineKeyboard([
    Markup.button.callback(StatusEnum.FOR_SALE, StatusEnum.FOR_SALE),
    Markup.button.callback(StatusEnum.FOR_RENT, StatusEnum.FOR_RENT),
    Markup.button.callback(StatusEnum.SOLD, StatusEnum.SOLD),
  ]);

  const userId = ctx?.from?.id;

  const passCallback = () => ctx.reply("Choose status", menuOptions);

  const failCallback = () => ctx.reply(ResponseEnum.PAY_TO_USE);

  await checkUsageCount(userId as number, passCallback, failCallback);
});
statusScene.action(StatusEnum.FOR_SALE, async (ctx) => {
  ctx.session.status = StatusEnum.FOR_SALE;
  ctx.scene.session.status = StatusEnum.FOR_SALE;
  await ctx.reply(`You chose ${StatusEnum.FOR_SALE}`);
  ctx.scene.enter(ScenesEnum.PRICE_SCENE);
});
statusScene.action(StatusEnum.FOR_RENT, async (ctx) => {
  ctx.session.status = StatusEnum.FOR_RENT;
  ctx.scene.session.status = StatusEnum.FOR_RENT;
  await ctx.reply(`You chose ${StatusEnum.FOR_RENT}`);
  ctx.scene.enter(ScenesEnum.PRICE_SCENE);
});
statusScene.action(StatusEnum.SOLD, async (ctx) => {
  ctx.session.status = StatusEnum.SOLD;
  ctx.scene.session.status = StatusEnum.SOLD;
  await ctx.reply(`You chose ${StatusEnum.SOLD}`);
  ctx.scene.enter(ScenesEnum.PRICE_SCENE);
});

statusScene.on(message("text"), (ctx) => {
  ctx.reply("Please choose one of the options.");
});
