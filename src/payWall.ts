import { FREE_USAGE_LIMIT } from "./const";
import { getUsageCount } from "./db";

export async function checkUsageCount(
  userId: number,
  passCallback: any,
  failCallback: any
) {
  const usageCount = await getUsageCount(userId);
  if (usageCount < FREE_USAGE_LIMIT) {
    passCallback();
  } else {
    failCallback();
  }
}
