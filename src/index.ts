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
import { getCreditsAvailable, getUsageCount } from "./db";

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
  await getCreditsAvailable(userId as number);
  await next();
});

bot.start(async (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
