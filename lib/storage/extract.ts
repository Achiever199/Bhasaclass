import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const allowedExtensions = new Set(["pdf", "docx", "txt"]);
const allowedMimeTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/octet-stream"]);

export type ExtractedLesson = { text: string; extension: "pdf" | "docx" | "txt"; filename: string };

function safeFilename(name: string) { return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "lesson"; }
function cleanText(value: string) { return value.replace(/\u0000/g, "").replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim().slice(0, 250_000); }

export async function extractLesson(file: File): Promise<ExtractedLesson> {
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) throw new Error("Upload a file between 1 byte and 10 MB.");
  const filename = safeFilename(file.name);
  const extension = filename.toLowerCase().split(".").pop() as string;
  if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.type || "application/octet-stream")) throw new Error("Only PDF, DOCX, and TXT files are supported.");
  const buffer = Buffer.from(await file.arrayBuffer());
  let text = "";
  if (extension === "pdf") {
    if (buffer.subarray(0, 5).toString() !== "%PDF-") throw new Error("The uploaded file is not a valid PDF.");
    text = (await pdfParse(buffer)).text;
  } else if (extension === "docx") {
    if (buffer.subarray(0, 2).toString("hex") !== "504b") throw new Error("The uploaded file is not a valid DOCX document.");
    text = (await mammoth.extractRawText({ buffer })).value;
  } else {
    text = buffer.toString("utf8");
  }
  const cleaned = cleanText(text);
  if (cleaned.length < 20) throw new Error("We could not find enough readable lesson text in that file.");
  return { text: cleaned, extension: extension as "pdf" | "docx" | "txt", filename };
}
