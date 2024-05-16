import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

// Area scene
export const areaScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.AREA_SCENE
);
areaScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.BATHROOMS_SCENE);
});
areaScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
areaScene.enter((ctx) => {
  ctx.reply("Please enter the area in square feet of your house.");
});
areaScene.on(message("text"), (ctx) => {
  ctx.session.area = ctx.message.text;
  ctx.scene.session.area = ctx.message.text;
  ctx.scene.enter(ScenesEnum.GENERATE_IMAGE_SCENE);
});
