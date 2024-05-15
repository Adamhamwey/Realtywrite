import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

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
locationScene.enter((ctx) => {
  ctx.reply("Please enter your location.");
});
locationScene.on(message("text"), (ctx) =>
  ctx.scene.enter(ScenesEnum.BED_ROOMS_SCENE)
);
