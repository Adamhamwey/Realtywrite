import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ScenesEnum } from "../const";

// Bathrooms scene
export const bathRoomsScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.BATHROOMS_SCENE
);
bathRoomsScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.BED_ROOMS_SCENE);
});
bathRoomsScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
bathRoomsScene.enter((ctx) => {
  ctx.reply("Please enter the number of bathrooms in your house.");
});
bathRoomsScene.on(message("text"), (ctx) => {
  ctx.session.noOfBathRooms = ctx.message.text;
  ctx.scene.session.noOfBathRooms = ctx.message.text;
  ctx.scene.enter(ScenesEnum.AREA_SCENE);
});
