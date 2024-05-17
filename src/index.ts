import { Scenes, session, Telegraf } from "telegraf";

import { startScene } from "./Scenes/startScene";
import { areaScene } from "./Scenes/areaScene";
import { bathRoomsScene } from "./Scenes/bathRoomsScene";
import { bedRoomsScene } from "./Scenes/bedRoomsScene";
import { imageScene } from "./Scenes/imageScene";
import { locationScene } from "./Scenes/locationScene";
import { priceScene } from "./Scenes/priceScene";
import { statusScene } from "./Scenes/statusScene";

import {
  BOT_TOKEN,
  CREDITS_PER_DOLLAR,
  currencyMap,
  ScenesEnum,
} from "./const";
import { ImageCreatorContext } from "./Interfaces";
import { generateImageScene } from "./Scenes/generateImageScene";
import { getCreditsAvailable, getUsageCount, usersCollection } from "./db";
import { paymentScene } from "./Scenes/paymentScene";
import { message } from "telegraf/filters";

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
  paymentScene,
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

bot.on("pre_checkout_query", (ctx) => {
  ctx.answerPreCheckoutQuery(true);
});
bot.on(message("successful_payment"), async (ctx) => {
  const userId = ctx?.from?.id;
  const baughtCredits =
    (ctx.message.successful_payment.total_amount / currencyMap.USD.decimals) *
    CREDITS_PER_DOLLAR;

  // Increment usage count
  await usersCollection.updateOne(
    { userId },
    { $inc: { creditsAvailable: baughtCredits } }
  );
  ctx.reply("Thank you. Continue your image generations");
  ctx.scene.enter(ScenesEnum.IMAGE_SCENE);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
