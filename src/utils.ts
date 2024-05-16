import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";
import Jimp from "jimp";
import { PropertyDetails } from "./Interfaces";
import path from "path";

export async function createImage(
  {
    fileLink,
    price,
    status,
    location,
    noOfBedRooms,
    noOfBathRooms,
    area,
  }: PropertyDetails,
  outputPath: string
) {
  // Download the image
  const response = await axios({
    url: fileLink,
    responseType: "arraybuffer",
  });

  // Load the image with Jimp
  const image = await Jimp.read(response.data);

  const width = image.bitmap.width;
  const height = image.bitmap.height;

  const mainStartX = Number((width * 0.06).toFixed(0));

  // Create a canvas to draw the text
  const canvas = createCanvas(width, height);
  const ctxCanvas = canvas.getContext("2d");

  // Draw the image onto the canvas
  const background = await loadImage(response.data);
  ctxCanvas.drawImage(background, 0, 0, width, height);

  // Create a gradient for the transparent overlay
  const gradient = ctxCanvas.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.7)"); // Fully opaque at the left
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Transparent at the right

  // Apply the gradient as a fill style
  ctxCanvas.fillStyle = gradient;

  // Draw a rectangle to cover the canvas
  ctxCanvas.fillRect(0, 0, width, height);

  // const logo = await loadImage(path.resolve(__dirname, "./../res/logo.png"));
  // ctxCanvas.drawImage(
  //   logo,
  //   mainStartX,
  //   (90 / 1000) * Math.min(width, height),
  //   (120 / 1000) * Math.min(width, height),
  //   (120 / 1000) * Math.min(width, height)
  // );

  // Set styles for the text
  ctxCanvas.textAlign = "left";
  ctxCanvas.fillStyle = "#FFFFFF";

  ctxCanvas.font = `bold ${(70 / 1000) * Math.min(width, height)}px Arial`;

  ctxCanvas.fillText(status.toUpperCase(), mainStartX, height * 0.555);

  ctxCanvas.font = `bold ${(85 / 1000) * Math.min(width, height)}px Arial`;
  ctxCanvas.fillText(price, mainStartX, height * 0.72);

  ctxCanvas.font = `bold ${(85 / 1000) * Math.min(width, height)}px Arial`;
  ctxCanvas.fillText(location, mainStartX, height * 0.81);

  ctxCanvas.font = `bold ${(30 / 1000) * Math.min(width, height)}px Arial`;
  ctxCanvas.fillText(
    `${noOfBedRooms} beds | ${noOfBathRooms} baths | ${area} sqft`,
    mainStartX,
    height * 0.92
  );

  // Merge the canvas and the image
  const buffer = canvas.toBuffer("image/jpeg");
  writeFileSync(outputPath, buffer);
}

// Format currency function
export function formatCurrency(
  amount: number,
  locale = "en-US",
  currency = "USD",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Format the amount
  return formatter.format(amount);
}

// Format units function
export function formatDecimals(
  amount: number,
  locale = "en-US",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  // Format the amount
  return formatter.format(amount);
}
