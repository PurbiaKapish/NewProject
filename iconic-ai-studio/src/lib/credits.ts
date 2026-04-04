export function getCreditsForResolution(resolution: "2K" | "4K"): number {
  return resolution === "4K" ? 3 : 2;
}

export function hasCredits(
  totalCredits: number,
  usedCredits: number,
  resolution: "2K" | "4K" = "2K"
): boolean {
  return totalCredits - usedCredits >= getCreditsForResolution(resolution);
}

export function getRemainingCredits(
  totalCredits: number,
  usedCredits: number
): number {
  return Math.max(0, totalCredits - usedCredits);
}
