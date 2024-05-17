import { CREDITS_PER_GENERATION, FREE_USAGE_LIMIT } from "./const";
import { getCreditsAvailable, getUsageCount } from "./db";

export async function checkUsageCount(
  userId: number,
  passCallback: any,
  failCallback: any
) {
  const usageCount = await getUsageCount(userId);
  const creditsAvailable = await getCreditsAvailable(userId);
  if (
    usageCount < FREE_USAGE_LIMIT ||
    creditsAvailable > CREDITS_PER_GENERATION
  ) {
    passCallback();
  } else {
    failCallback();
  }
}
