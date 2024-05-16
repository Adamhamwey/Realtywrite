import { Scenes, session, Telegraf } from "telegraf";

import { startScene } from "./Scenes/startScene";
import { areaScene } from "./Scenes/areaScene";
import { bathRoomsScene } from "./Scenes/bathRoomsScene";
import { bedRoomsScene } from "./Scenes/bedRoomsScene";
import { imageScene } from "./Scenes/imageScene";
import { locationScene } from "./Scenes/locationScene";
import { priceScene } from "./Scenes/priceScene";
import { statusScene } from "./Scenes/statusScene";

import { BOT_TOKEN, ScenesEnum } from "./const";
import { ImageCreatorContext } from "./Interfaces";
import { generateImageScene } from "./Scenes/generateImageScene";
import { getUsageCount } from "./db";
import { checkUsageCount } from "./payWall";

const bot = new Telegraf<ImageCreatorContext>(BOT_TOKEN);

const stage = new Scenes.Stage<ImageCreatorContext>([
  startScene,
  imageScene,
  statusScene,
  priceScene,
  locationScene,
  bedRoomsScene,
  bathRoomsScene,
  areaScene,
  generateImageScene,
]);

bot.use(session());
bot.use(stage.middleware());

// Middleware to track usage count
bot.use(async (ctx, next) => {
  const userId = ctx?.from?.id;

  await getUsageCount(userId as number);
  await next();
});

bot.start(async (ctx) => {
  const passCallback = () => ctx.scene.enter(ScenesEnum.START_SCENE);

  const failCallback = () =>
    ctx.reply(
      "You have exceeded the free usage limit. Please pay to continue using this functionality."
    );
  const userId = ctx?.from?.id;
  await checkUsageCount(userId, passCallback, failCallback);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
