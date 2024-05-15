import { Scenes, Markup } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

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
statusScene.enter((ctx) => {
  // Define the menu options
  const menuOptions = Markup.keyboard([
    ["For Sale", "For Rent", "Sold"],
  ]).resize();
  ctx.reply("Choose status", menuOptions);
});
statusScene.on(message("text"), (ctx) => {
  ctx.scene.enter(ScenesEnum.PRICE_SCENE);
});
