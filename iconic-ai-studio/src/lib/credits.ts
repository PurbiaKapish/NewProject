export function hasCredits(
  totalCredits: number,
  usedCredits: number
): boolean {
  return totalCredits - usedCredits > 0;
}

export function getRemainingCredits(
  totalCredits: number,
  usedCredits: number
): number {
  return Math.max(0, totalCredits - usedCredits);
}
