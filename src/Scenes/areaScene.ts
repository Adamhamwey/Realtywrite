import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import { CommandEnum, ResponseEnum, ScenesEnum } from "../const";
import { checkUsageCount } from "../payWall";

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
areaScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
areaScene.enter(async (ctx) => {
  const userId = ctx?.from?.id;

  const passCallback = () =>
    ctx.reply("Please enter the area in square feet of your house.");

  const failCallback = async () => {
    await ctx.reply(ResponseEnum.PAY_TO_USE);
    ctx.scene.enter(ScenesEnum.PAYMENT_SCENE);
  };

  await checkUsageCount(userId as number, passCallback, failCallback);
});
areaScene.on(message("text"), (ctx) => {
  ctx.session.area = ctx.message.text;
  ctx.scene.session.area = ctx.message.text;
  ctx.scene.enter(ScenesEnum.GENERATE_IMAGE_SCENE);
});
