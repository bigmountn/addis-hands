import { promises as fs } from "fs";
import path from "path";

export type InquiryRecord = {
  id: string;
  createdAt: string;
  role?: "buyer" | "seller";
  name: string;
  buyerCompany: string;
  country: string;
  email: string;
  interestCompany?: string;
  interestProduct?: string;
  quantity?: string;
  onlinePresence?: string;
  sellerFocus?: string;
  message: string;
};

const filePath = path.join(process.cwd(), "data", "inquiries.json");

export async function saveInquiryLocally(
  inquiry: Omit<InquiryRecord, "id" | "createdAt">,
) {
  const record: InquiryRecord = {
    ...inquiry,
    id: `inq_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let existing: InquiryRecord[] = [];
  try {
    const raw = await fs.readFile(filePath, "utf8");
    existing = JSON.parse(raw) as InquiryRecord[];
  } catch {
    existing = [];
  }

  existing.push(record);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");
  return record;
}
