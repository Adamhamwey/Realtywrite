import { Scenes, session, Telegraf } from "telegraf";

import dotenv from "dotenv";

import { startScene } from "./Scenes/startScene";
import { areaScene } from "./Scenes/areaScene";
import { bathRoomsScene } from "./Scenes/bathRoomsScene";
import { bedRoomsScene } from "./Scenes/bedRoomsScene";
import { imageScene } from "./Scenes/ImageScene";
import { locationScene } from "./Scenes/locationScene";
import { priceScene } from "./Scenes/priceScene";
import { statusScene } from "./Scenes/statusScene";

import { BOT_TOKEN, ScenesEnum } from "./const";
import { ImageCreatorContext } from "./Interfaces";
import { generateImageScene } from "./Scenes/generateImageScene";

dotenv.config();

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

bot.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
