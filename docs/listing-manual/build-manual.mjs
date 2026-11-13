import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType,
  VerticalAlign,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "Addis-Hands-Listing-Information-Kit.docx");

const PAGE_WIDTH = 12240; // US Letter
const MARGIN = 720;
const CONTENT = PAGE_WIDTH - MARGIN * 2;

function loadImage(name) {
  return fs.readFileSync(path.join(__dirname, name));
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: opts.line },
    alignment: opts.align,
    ...opts.paragraph,
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: opts.size ?? 20,
        bold: opts.bold,
        italics: opts.italics,
        color: opts.color ?? "1C1B1A",
      }),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    children: [
      new TextRun({
        text,
        font: "Georgia",
        size: 32,
        bold: true,
        color: "39221E",
      }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        font: "Georgia",
        size: 26,
        bold: true,
        color: "6B443D",
      }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "•  ", font: "Calibri", size: 20, color: "6B443D" }),
      new TextRun({ text, font: "Calibri", size: 20, color: "1C1B1A" }),
    ],
  });
}

function fieldRow(label, hint = "", height = 500) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3200, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: "F7F1E8" },
        borders: thinBorders(),
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            spacing: { after: 0 },
            children: [
              new TextRun({
                text: label,
                font: "Calibri",
                size: 18,
                bold: true,
                color: "39221E",
              }),
            ],
          }),
          hint
            ? new Paragraph({
                spacing: { after: 0 },
                children: [
                  new TextRun({
                    text: hint,
                    font: "Calibri",
                    size: 15,
                    italics: true,
                    color: "838280",
                  }),
                ],
              })
            : new Paragraph({ children: [] }),
        ],
      }),
      new TableCell({
        width: { size: CONTENT - 3200, type: WidthType.DXA },
        borders: thinBorders(),
        children: [
          new Paragraph({
            spacing: { after: 0 },
            children: [
              new TextRun({
                text: " ",
                font: "Calibri",
                size: 20,
              }),
            ],
          }),
        ],
      }),
    ],
    height: { value: height, rule: "atLeast" },
  });
}

function thinBorders() {
  const b = { style: BorderStyle.SINGLE, size: 8, color: "E1DCD3" };
  return { top: b, bottom: b, left: b, right: b };
}

function formTable(rows) {
  return new Table({
    width: { size: CONTENT, type: WidthType.DXA },
    columnWidths: [3200, CONTENT - 3200],
    rows,
  });
}

function imageBlock(file, widthPx, heightPx, caption) {
  const nodes = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 80 },
      children: [
        new ImageRun({
          type: file.endsWith(".jpg") || file.endsWith(".jpeg") ? "jpg" : "png",
          data: loadImage(file),
          transformation: { width: widthPx, height: heightPx },
          altText: { title: caption, description: caption, name: caption },
        }),
      ],
    }),
    p(caption, {
      size: 16,
      italics: true,
      color: "838280",
      align: AlignmentType.CENTER,
      after: 200,
    }),
  ];
  return nodes;
}

const companyImg = loadImage("example-company.png");
const productImg = loadImage("example-product.png");
const listImg = loadImage("example-companies-list.png");
const photoProduct = loadImage("photo-example-product.jpg");
const photoHero = loadImage("photo-example-hero.jpg");

// Approximate aspect ratios from sips output - use reasonable display sizes
const doc = new Document({
  styles: {
    default: {
      document: {
        styles: [
          {
            id: "Normal",
            run: { font: "Calibri", size: 20, color: "1C1B1A" },
          },
        ],
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: 15840 },
          margin: {
            top: MARGIN,
            bottom: MARGIN,
            left: MARGIN,
            right: MARGIN,
          },
        },
      },
      children: [
        p("ADDIS HANDS", {
          size: 18,
          bold: true,
          color: "AF751B",
          after: 40,
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: "Listing Information Kit",
              font: "Georgia",
              size: 48,
              bold: true,
              color: "39221E",
            }),
          ],
        }),
        p(
          "For Ethiopian leather & craft SMEs — prepare the information buyers will see on your company and product pages.",
          { size: 22, color: "4A4741", after: 200 },
        ),
        p("Website: https://addis-hands.vercel.app", { size: 18, after: 40 }),
        p("Listing inquiry: https://addis-hands.vercel.app/en/inquire?role=seller", {
          size: 18,
          after: 40,
        }),
        p("Email: info@bigmountn.com", { size: 18, after: 280 }),

        h1("1. How your listing will look"),
        p(
          "Below are real page layouts from Addis Hands. Your information will appear in these sections. Please prepare clear English text and high-quality photos so buyers can understand your workshop and products quickly.",
          { after: 200 },
        ),

        h2("A. Companies list (card)"),
        p(
          "Buyers first see a short card: cover photo, company name, city, category, and a 1–2 sentence summary.",
          { after: 120 },
        ),
        ...imageBlock(
          "example-companies-list.png",
          480,
          667,
          "Example: Companies list page on Addis Hands",
        ),

        h2("B. Company profile page"),
        p(
          "Your company page shows: logo, company name, city/country, summary, category, strengths, workshop photos (cover + gallery), and your products.",
          { after: 120 },
        ),
        ...imageBlock(
          "example-company.png",
          480,
          667,
          "Example: Company profile layout (photos go where you see image areas)",
        ),

        h2("C. Product detail page"),
        p(
          "Each product page shows: cover + detail photos, product name, company, short summary, material, origin, MOQ, lead time, and other trading details.",
          { after: 120 },
        ),
        ...imageBlock(
          "example-product.png",
          480,
          667,
          "Example: Product page layout (replace placeholders with your real photos)",
        ),

        h2("D. Photo quality examples"),
        p(
          "Please send clear, well-lit photos (JPG/PNG). Avoid heavy filters. Show the product and workshop honestly — buyers trust real craftsmanship.",
          { after: 120 },
        ),
        new Table({
          width: { size: CONTENT, type: WidthType.DXA },
          columnWidths: [CONTENT / 2, CONTENT / 2],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: CONTENT / 2, type: WidthType.DXA },
                  borders: thinBorders(),
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          type: "jpg",
                          data: photoProduct,
                          transformation: { width: 240, height: 240 },
                          altText: {
                            title: "Product photo",
                            description: "Product photo example",
                            name: "product",
                          },
                        }),
                      ],
                    }),
                    p("Good product photo example", {
                      size: 15,
                      italics: true,
                      color: "838280",
                      align: AlignmentType.CENTER,
                      after: 80,
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: CONTENT / 2, type: WidthType.DXA },
                  borders: thinBorders(),
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          type: "jpg",
                          data: photoHero,
                          transformation: { width: 240, height: 160 },
                          altText: {
                            title: "Lifestyle photo",
                            description: "Lifestyle photo example",
                            name: "hero",
                          },
                        }),
                      ],
                    }),
                    p("Good lifestyle / bag photo example", {
                      size: 15,
                      italics: true,
                      color: "838280",
                      align: AlignmentType.CENTER,
                      after: 80,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        h1("2. Please fill in this form"),
        p(
          "Type directly into the blank cells (or print and write by hand). English is preferred. Incomplete fields are OK — we will follow up — but the more complete your answers, the faster we can publish your listing.",
          { after: 200 },
        ),

        h2("A. Contact person"),
        formTable([
          fieldRow("Full name", "Person we should contact"),
          fieldRow("Position / role", "Owner, export manager, etc."),
          fieldRow("Email", ""),
          fieldRow("Phone / WhatsApp", "Include country code"),
          fieldRow("Preferred language", "English / Amharic / other"),
        ]),

        h2("B. Company information"),
        p("This appears on your company profile page.", {
          italics: true,
          color: "838280",
          after: 120,
        }),
        formTable([
          fieldRow("Company / workshop name *", "Official trading name"),
          fieldRow("City *", "e.g. Addis Ababa, Modjo"),
          fieldRow("Country", "Usually Ethiopia"),
          fieldRow("Category *", "e.g. Leather goods, Footwear, Fashion accessories"),
          fieldRow(
            "Company summary *",
            "2–4 sentences: what you make, for whom, export readiness",
            1200,
          ),
          fieldRow(
            "Strengths (3–5 bullets)",
            "One strength per line, e.g. natural cowhide finishing",
            1000,
          ),
          fieldRow("Year founded", "Optional"),
          fieldRow("Number of employees", "e.g. 11–50"),
          fieldRow("Export ready?", "Yes / No / Partially"),
          fieldRow("Website", "If any"),
          fieldRow("Instagram / Facebook", "URL or @handle"),
          fieldRow("Other social / marketplace", "Optional"),
        ]),

        h2("C. Company photos to attach"),
        bullet("Company logo (PNG/JPG, square preferred)"),
        bullet("Cover / workshop photo (main image on company page)"),
        bullet("Gallery photo 1 — workshop / production"),
        bullet("Gallery photo 2 — team / process / finishing (optional but recommended)"),
        p("File naming tip: CompanyName-logo.jpg, CompanyName-cover.jpg, CompanyName-gallery-1.jpg", {
          size: 16,
          italics: true,
          color: "838280",
          after: 200,
        }),

        new Paragraph({ children: [new PageBreak()] }),

        h2("D. Product information (copy this section for each product)"),
        p(
          "Fill one block per SKU. Start with your best 2–5 products for export buyers.",
          { after: 120 },
        ),
        formTable([
          fieldRow("Product name *", "English name buyers will search"),
          fieldRow("Category *", "e.g. Wallets, Belts, Bags, Footwear"),
          fieldRow(
            "Short summary *",
            "1–2 sentences for the product card",
            900,
          ),
          fieldRow(
            "Longer description",
            "3–6 sentences: story, use cases, finishing, buyer notes",
            1400,
          ),
          fieldRow("Material *", "e.g. Natural cowhide, goat suede"),
          fieldRow("Origin *", "Usually Made in Ethiopia"),
          fieldRow("MOQ *", "e.g. 50 pcs / 100 pcs"),
          fieldRow("Lead time *", "e.g. 3–4 weeks after order confirmation"),
          fieldRow("Price range / unit price", "Optional — or say “on inquiry”"),
          fieldRow("Colors available", ""),
          fieldRow("Sizes / dimensions", ""),
          fieldRow("Unit", "pcs / pairs / sets"),
          fieldRow("Model / SKU number", "Optional"),
          fieldRow("Sample available?", "Yes / No + sample lead time"),
          fieldRow("Packaging notes", "Optional"),
          fieldRow("Certifications", "Optional"),
          fieldRow("Payment terms", "Optional, e.g. T/T"),
          fieldRow("Port / shipping notes", "Optional"),
          fieldRow(
            "Key selling points",
            "3–5 short bullets",
            1000,
          ),
        ]),

        h2("E. Product photos to attach (per product)"),
        bullet("Cover photo — clearest front / hero shot"),
        bullet("Angle / detail 1 — side, interior, stitching, or hardware"),
        bullet("Angle / detail 2 — lifestyle or close-up texture (optional)"),
        p(
          "File naming tip: ProductName-cover.jpg, ProductName-1.jpg, ProductName-2.jpg",
          { size: 16, italics: true, color: "838280", after: 240 },
        ),

        h1("3. How to send this back"),
        bullet("Reply to our email with this completed Word file (or PDF scan)"),
        bullet("Attach all photos in the same email (or Google Drive / WeTransfer link)"),
        bullet("Or submit a short listing inquiry first: https://addis-hands.vercel.app/en/inquire?role=seller"),
        p("", { after: 160 }),
        p(
          "Once we receive your materials, the Addis Hands team will review, format your listing, and confirm before publishing.",
          { after: 200 },
        ),
        p("Thank you — we look forward to introducing your craftsmanship to buyers.", {
          after: 80,
        }),
        p("Addis Hands team · info@bigmountn.com", {
          bold: true,
          color: "6B443D",
          after: 40,
        }),
        p("https://addis-hands.vercel.app", { color: "838280", size: 18 }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buffer);
console.log("Wrote", outPath);
