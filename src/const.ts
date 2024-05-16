import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const MONGO_DB_URI = process.env.MONGO_DB_URI as string;

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
