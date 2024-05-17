import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

// Bedrooms scene
export const bedRoomsScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.BED_ROOMS_SCENE
);
bedRoomsScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.LOCATION_SCENE);
});
bedRoomsScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
bedRoomsScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
bedRoomsScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () =>
    ctx.reply("Please enter the number of bedrooms in your house.");

  const failCallback = () => ctx.reply(ResponseEnum.PAY_TO_USE);

  await checkUsageCount(userId as number, passCallback, failCallback);
});
bedRoomsScene.on(message("text"), (ctx) => {
  ctx.session.noOfBedRooms = ctx.message.text;
  ctx.scene.session.noOfBedRooms = ctx.message.text;
  ctx.scene.enter(ScenesEnum.BATHROOMS_SCENE);
});
