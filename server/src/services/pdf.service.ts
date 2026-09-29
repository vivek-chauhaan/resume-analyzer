import fs from "fs/promises";
// pdf-parse has no official types; requiring it directly avoids a fragile @types shim
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse");

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  const result = await pdfParse(buffer);
  // Collapse excessive whitespace so downstream scoring isn't thrown off by PDF layout artifacts
  return result.text.replace(/\s+/g, " ").trim();
}
