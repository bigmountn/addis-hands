import { NextResponse } from "next/server";
import { Resend } from "resend";
import { saveInquiryLocally } from "@/lib/inquiries";

const INQUIRY_TO = "info@bigmountn.com";

type Body = {
  role?: string;
  name?: string;
  buyerCompany?: string;
  country?: string;
  email?: string;
  interestCompany?: string;
  interestProduct?: string;
  quantity?: string;
  onlinePresence?: string;
  sellerFocus?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const role = body.role === "seller" ? "seller" : "buyer";
    const name = String(body.name ?? "").trim();
    const buyerCompany = String(body.buyerCompany ?? "").trim();
    const country =
      role === "seller"
        ? String(body.country ?? "").trim() || "Ethiopia"
        : String(body.country ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const interestCompany = String(body.interestCompany ?? "").trim();
    const interestProduct = String(body.interestProduct ?? "").trim();
    const quantity = String(body.quantity ?? "").trim();
    const onlinePresence = String(body.onlinePresence ?? "").trim();
    const sellerFocus = String(body.sellerFocus ?? "").trim();

    if (
      !name ||
      !buyerCompany ||
      !email ||
      !message ||
      (role === "buyer" && !country)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const roleLabel = role === "seller" ? "Listing" : "Buyer";
    const subjectParts = [
      `[Addis Hands ${roleLabel}]`,
      role === "seller"
        ? sellerFocus || buyerCompany
        : interestCompany || buyerCompany,
      role === "seller" ? "Listing inquiry" : interestProduct || "General",
    ];

    const text = [
      `Role: ${roleLabel}`,
      `Name: ${name}`,
      `Company: ${buyerCompany}`,
      `Country: ${country}`,
      `Email: ${email}`,
      role === "seller"
        ? [
            `Website / social: ${onlinePresence || "-"}`,
            `Registration focus: ${sellerFocus || "-"}`,
          ].join("\n")
        : [
            `Interest company: ${interestCompany || "-"}`,
            `Interest product: ${interestProduct || "-"}`,
            `Quantity / MOQ: ${quantity || "-"}`,
          ].join("\n"),
      "",
      "Message:",
      message,
    ].join("\n");

    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const from =
        process.env.RESEND_FROM_EMAIL ?? "Addis Hands <onboarding@resend.dev>";

      const { error } = await resend.emails.send({
        from,
        to: [INQUIRY_TO],
        replyTo: email,
        subject: subjectParts.join(" "),
        text,
      });

      if (error) {
        console.error("Resend error", error);
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 502 },
        );
      }
    } else {
      const saved = await saveInquiryLocally({
        role,
        name,
        buyerCompany,
        country,
        email,
        interestCompany: role === "buyer" ? interestCompany : undefined,
        interestProduct: role === "buyer" ? interestProduct : undefined,
        quantity: role === "buyer" ? quantity : undefined,
        onlinePresence: role === "seller" ? onlinePresence : undefined,
        sellerFocus: role === "seller" ? sellerFocus : undefined,
        message,
      });
      console.log("Inquiry saved locally (no RESEND_API_KEY):", saved.id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
