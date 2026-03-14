/**
 * GET /api/birthday-content
 * 
 * Returns the birthday celebration content — gallery, love notes,
 * timeline, surprise cards, and theme configuration.
 * 
 * Access control:
 * - In countdown mode: returns theme + features only (no content spoilers)
 * - In birthday mode: returns the full payload
 * 
 * This prevents someone from inspecting network requests
 * before midnight and seeing the surprise content early.
 */

import { NextResponse } from "next/server";
import { getCurrentMode } from "@/utils/birthday-engine";
import { getBirthdayContent, getFilteredContent } from "@/content/birthday-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const mode = getCurrentMode();

    if (mode === "countdown") {
      // Don't leak content before the birthday
      const content = getBirthdayContent();
      return NextResponse.json(
        {
          mode: "countdown",
          theme: content.theme,
          features: content.features,
          gallery: [],
          loveNotes: [],
          timeline: [],
          surpriseCards: [],
          message: "Content unlocks on the birthday.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }
      );
    }

    // Birthday is live — serve everything
    const content = getFilteredContent();
    return NextResponse.json(
      {
        mode: "birthday",
        ...content,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("[birthday-content] Error:", error);

    return NextResponse.json(
      { error: "Failed to load birthday content" },
      { status: 500 }
    );
  }
}
