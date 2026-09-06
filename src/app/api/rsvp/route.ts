import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, members, attendance } = body;

    const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

    if (scriptUrl) {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          members,
          attendance: attendance || "Attending",
          timestamp: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }),
        }),
        redirect: "follow",
      });

      if (!response.ok) {
        console.error("Google Sheets Webhook responded with error:", await response.text());
      }
    } else {
      console.log("RSVP Recorded locally (Add GOOGLE_SHEETS_SCRIPT_URL to .env.local to sync with Google Sheets):", {
        name,
        members,
        attendance,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record RSVP" },
      { status: 500 }
    );
  }
}
