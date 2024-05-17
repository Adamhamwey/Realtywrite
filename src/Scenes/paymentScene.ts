import { Markup, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { ImageCreatorContext } from "../Interfaces";
import {
  CommandEnum,
  CREDITS_PER_DOLLAR,
  CreditsEnum,
  currencyMap,
  ScenesEnum,
  STRIPE_TOKEN,
} from "../const";

const currency = currencyMap.USD;

// Payment scene
export const paymentScene = new Scenes.BaseScene<ImageCreatorContext>(
  ScenesEnum.PAYMENT_SCENE
);
paymentScene.command(CommandEnum.BACK, (ctx) => {
  ctx.scene.enter(ScenesEnum.BED_ROOMS_SCENE);
});
paymentScene.command(CommandEnum.EXIT, (ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
paymentScene.start((ctx) => {
  ctx.scene.enter(ScenesEnum.START_SCENE);
});
paymentScene.enter(async (ctx) => {
  // Define the menu options
  const menuOptions = Markup.inlineKeyboard([
    Markup.button.callback(CreditsEnum._100, CreditsEnum._100),
    Markup.button.callback(CreditsEnum._200, CreditsEnum._200),
    Markup.button.callback(CreditsEnum._300, CreditsEnum._300),
    Markup.button.callback(CreditsEnum._500, CreditsEnum._500),
    Markup.button.callback(CreditsEnum._1000, CreditsEnum._1000),
    Markup.button.callback(CreditsEnum._1500, CreditsEnum._1500),
  ]);

  const userId = ctx?.from?.id;

  ctx.reply(
    `How much credits you want to buy? (${CREDITS_PER_DOLLAR} Credits = $1)`,
    menuOptions
  );
});

paymentScene.action(CreditsEnum._100, async (ctx) => {
  const amount = CreditsEnum._100;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.action(CreditsEnum._200, async (ctx) => {
  const amount = CreditsEnum._200;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.action(CreditsEnum._300, async (ctx) => {
  const amount = CreditsEnum._300;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.action(CreditsEnum._500, async (ctx) => {
  const amount = CreditsEnum._500;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.action(CreditsEnum._1000, async (ctx) => {
  const amount = CreditsEnum._1000;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.action(CreditsEnum._1500, async (ctx) => {
  const amount = CreditsEnum._1500;
  const invoicePayload = `${amount} credits for ${ctx.from.first_name}`;
  ctx
    .sendInvoice({
      currency: currency.name,
      title: `${amount} credits for ${ctx.from.first_name}`,
      description: `${amount} Image generation credits for ${ctx?.from.first_name}`,
      payload: invoicePayload,
      provider_token: STRIPE_TOKEN,
      prices: [
        {
          label: "Image Generation Credits",
          amount: (Number(amount) / CREDITS_PER_DOLLAR) * currency.decimals,
        },
      ],
      max_tip_amount: 0,
    })
    .catch(console.error);
});

paymentScene.on(message("text"), (ctx) => {
  ctx.reply("Choose credit amount from a button.");
});
