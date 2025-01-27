import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const MONGO_DB_URI = process.env.MONGO_DB_URI as string;
export const STRIPE_TOKEN = process.env.STRIPE_TOKEN as string;

export const FREE_USAGE_LIMIT = 2;
export const CREDITS_PER_GENERATION = 2;
export const CREDITS_PER_DOLLAR = 100;

export enum ScenesEnum {
  START_SCENE = "START_SCENE",
  IMAGE_SCENE = "IMAGE_SCENE",
  STATUS_SCENE = "STATUS_SCENE",
  PRICE_SCENE = "PRICE_SCENE",
  LOCATION_SCENE = "LOCATION_SCENE",
  BED_ROOMS_SCENE = "BED_ROOMS_SCENE",
  BATHROOMS_SCENE = "BATHROOMS_SCENE",
  AREA_SCENE = "AREA_SCENE",
  GENERATE_IMAGE_SCENE = "GENERATE_IMAGE_SCENE",
  PAYMENT_SCENE = "PAYMENT_SCENE",
}

export enum CommandEnum {
  CREATE = "create",
  BACK = "back",
  EXIT = "exit",
  TRY_AGAIN = "tryAgain",
}

export enum StatusEnum {
  FOR_SALE = "For Sale",
  FOR_RENT = "For Rent",
  SOLD = "Sold",
}

export enum CreditsEnum {
  _100 = "100",
  _200 = "200",
  _300 = "300",
  _500 = "500",
  _1000 = "1000",
  _1500 = "1500",
}

export enum ResponseEnum {
  PAY_TO_USE = "You have exceeded the free usage limit. Unfortunately, this functionality is not available at the moment. If you'd like to use it, please consider purchasing credits.",
}

export const currencyMap = {
  USD: {
    name: "USD",
    decimals: 100,
  },
};
