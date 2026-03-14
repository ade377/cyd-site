/**
 * GET /api/birthday-status
 * 
 * Returns the current birthday mode, server time, countdown data,
 * and activation boundaries. The frontend polls this to stay synced.
 * 
 * Response shape:
 * {
 *   currentMode: "countdown" | "birthday",
 *   isBirthdayLive: boolean,
 *   serverTime: string,
 *   serverTimeUTC: string,
 *   timezone: "America/Chicago",
 *   targetDate: "YYYY-MM-DD",
 *   unlockAt: string,
 *   lockAt: string,
 *   secondsRemaining: number,
 *   millisecondsRemaining: number,
 *   countdownTarget: string,
 *   birthdayYear: number
 * }
 */

import { NextResponse } from "next/server";
import { getBirthdayStatus } from "@/utils/birthday-engine";

export const dynamic = "force-dynamic"; // Never cache this route
export const revalidate = 0;

export async function GET() {
  try {
    const status = getBirthdayStatus();

    return NextResponse.json(status, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[birthday-status] Error:", error);

    return NextResponse.json(
      { error: "Failed to compute birthday status" },
      { status: 500 }
    );
  }
}
