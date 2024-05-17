import axios from "axios";
import { Canvas, createCanvas, loadImage } from "canvas";
import { writeFileSync } from "fs";
import { PropertyDetails } from "../Interfaces";

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
  outputPath1: string,
  outputPath2: string
) {
  // Download the image
  const response = await axios({
    url: fileLink,
    responseType: "arraybuffer",
  });

  // Load the image with canvas
  const background = await loadImage(response.data);
  const width = background.width;
  const height = background.height;

  // Create a canvas to draw the text
  const canvas = createCanvas(width, height);
  const ctxCanvas = canvas.getContext("2d");

  // Draw the image onto the canvas
  ctxCanvas.drawImage(background, 0, 0, width, height);

  const canvas1_1 = await getCenterCrop(canvas, 1080, 1080);
  const canvas16_9 = await getCenterCrop(canvas, 1920, 1080);

  const textAddedCanvas1_1 = await addTextToCanvas(canvas1_1, {
    price,
    status,
    location,
    noOfBedRooms,
    noOfBathRooms,
    area,
  });
  const textAddedCanvas16_9 = await addTextToCanvas(canvas16_9, {
    price,
    status,
    location,
    noOfBedRooms,
    noOfBathRooms,
    area,
  });

  // Merge the canvas and the image
  const buffer1_1 = textAddedCanvas1_1.toBuffer("image/jpeg");
  const buffer16_9 = textAddedCanvas16_9.toBuffer("image/jpeg");
  writeFileSync(outputPath1, buffer1_1);
  writeFileSync(outputPath2, buffer16_9);
}

// Function to add text to canvas
export async function addTextToCanvas(
  inputCanvas: Canvas,
  details: Omit<PropertyDetails, "fileLink">
): Promise<Canvas> {
  const { status, price, location, noOfBedRooms, noOfBathRooms, area } =
    details;
  const { width, height } = inputCanvas;
  const mainStartX = Number((width * 0.06).toFixed(0));

  const outputCanvas = createCanvas(width, height);
  const ctxOutputCanvas = outputCanvas.getContext("2d");

  // Draw the image onto the canvas
  ctxOutputCanvas.drawImage(inputCanvas, 0, 0, width, height);

  // Create a gradient for the transparent overlay
  const gradient = ctxOutputCanvas.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.8)"); // Relatively opaque at the left
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Transparent at the right

  // Apply the gradient as a fill style
  ctxOutputCanvas.fillStyle = gradient;
  // Draw a rectangle to cover the canvas
  ctxOutputCanvas.fillRect(0, 0, width, height);

  // Set styles for the text
  ctxOutputCanvas.textAlign = "left";

  ctxOutputCanvas.fillStyle = "#00B22D";
  ctxOutputCanvas.font = `800 ${(70 / 1000) * Math.min(width, height)}px Arial`;
  ctxOutputCanvas.fillText(status.toUpperCase(), mainStartX, height * 0.555);

  ctxOutputCanvas.fillStyle = "#FFFFFF";
  ctxOutputCanvas.font = `bold ${
    (85 / 1000) * Math.min(width, height)
  }px Arial`;
  ctxOutputCanvas.fillText(price, mainStartX, height * 0.7);

  ctxOutputCanvas.font = `bold ${
    (85 / 1000) * Math.min(width, height)
  }px Arial`;
  ctxOutputCanvas.fillText(location, mainStartX, height * 0.8);

  ctxOutputCanvas.font = `bold ${
    (30 / 1000) * Math.min(width, height)
  }px Arial`;
  ctxOutputCanvas.fillText(
    `${noOfBedRooms} beds | ${noOfBathRooms} baths | ${area} sqft`,
    mainStartX,
    height * 0.92
  );

  return outputCanvas;
}

// Function to get the best center crop
export async function getCenterCrop(
  inputCanvas: Canvas,
  targetWidth: number,
  targetHeight: number
): Promise<Canvas> {
  const { width, height } = inputCanvas;
  const aspectRatioImage = width / height;
  const aspectRatioTarget = targetWidth / targetHeight;
  let cropWidth, cropHeight;

  if (aspectRatioImage > aspectRatioTarget) {
    cropHeight = height;
    cropWidth = cropHeight * aspectRatioTarget;
  } else {
    cropWidth = width;
    cropHeight = cropWidth / aspectRatioTarget;
  }

  const x = (width - cropWidth) / 2;
  const y = (height - cropHeight) / 2;

  const outputCanvas = createCanvas(cropWidth, cropHeight);
  const ctxOutputCanvas = outputCanvas.getContext("2d");
  ctxOutputCanvas.drawImage(
    inputCanvas,
    x,
    y,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );
  return outputCanvas;
}
