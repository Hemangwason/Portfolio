/* What the visitor's connection can afford. Browsers that expose the
   Network Information API tell us about Data Saver and slow links;
   everywhere else we assume a normal connection. */

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
};

const SLOW_TYPES = new Set(["slow-2g", "2g", "3g"]);

function connection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

/** True on Data Saver or a 3G-or-slower link: skip optional video. */
export function isConstrainedNetwork(): boolean {
  const c = connection();
  if (!c) return false;
  return Boolean(c.saveData) || SLOW_TYPES.has(c.effectiveType ?? "4g");
}
