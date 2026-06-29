import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
