import { getUsageCount } from "./db";

export async function checkUsageCount(
  userId: number,
  passCallback: any,
  failCallback: any
) {
  const usageCount = await getUsageCount(userId);
  if (usageCount < 2) {
    passCallback();
  } else {
    failCallback();
  }
}
