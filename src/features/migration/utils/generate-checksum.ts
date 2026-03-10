import crypto from "node:crypto";

export const generateChecksum = (sqlContent: string): string => {
  return crypto.createHash("sha256").update(sqlContent).digest("hex");
};
