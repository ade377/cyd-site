/**
 * GET /api/birthday-debug
 * 
 * Development-only endpoint for testing the birthday engine
 * at specific points in time. Validates edge cases.
 * 
 * Query params:
 * - ?at=2026-03-15T00:00:00  (test at specific datetime)
 * - ?runTests=true            (run full edge case suite)
 * 
 * IMPORTANT: Remove or protect this route in production.
 */

import { NextResponse } from "next/server";
import { validateAtTime, getBirthdayStatus } from "@/utils/birthday-engine";

export const dynamic = "force-dynamic";

interface TestCase {
  label: string;
  input: string;
  expectedMode: "countdown" | "birthday";
}

const EDGE_CASE_TESTS: TestCase[] = [
  // Just before midnight — should still be countdown
  { label: "Mar 14 23:59:59", input: "2026-03-14T23:59:59", expectedMode: "countdown" },
  // Exact midnight — birthday activates
  { label: "Mar 15 00:00:00", input: "2026-03-15T00:00:00", expectedMode: "birthday" },
  // Mid-day — birthday
  { label: "Mar 15 12:00:00", input: "2026-03-15T12:00:00", expectedMode: "birthday" },
  // End of birthday
  { label: "Mar 15 23:59:59", input: "2026-03-15T23:59:59", expectedMode: "birthday" },
  // Just after birthday ends
  { label: "Mar 16 00:00:00", input: "2026-03-16T00:00:00", expectedMode: "countdown" },
  // Way before birthday
  { label: "Jan 1 00:00:00", input: "2026-01-01T00:00:00", expectedMode: "countdown" },
  // Way after birthday
  { label: "Dec 31 23:59:59", input: "2026-12-31T23:59:59", expectedMode: "countdown" },
  // New Year's after birthday — should target next year
  { label: "2027 Jan 1", input: "2027-01-01T00:00:00", expectedMode: "countdown" },
  // Next year's birthday
  { label: "2027 Mar 15 noon", input: "2027-03-15T12:00:00", expectedMode: "birthday" },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const testAt = url.searchParams.get("at");
  const runTests = url.searchParams.get("runTests") === "true";

  try {
    // Test at a specific time
    if (testAt) {
      const result = validateAtTime(testAt);
      return NextResponse.json({ testInput: testAt, ...result });
    }

    // Run full test suite
    if (runTests) {
      const results = EDGE_CASE_TESTS.map((test) => {
        const status = validateAtTime(test.input);
        const passed = status.currentMode === test.expectedMode;
        return {
          label: test.label,
          input: test.input,
          expected: test.expectedMode,
          actual: status.currentMode,
          passed,
          details: status,
        };
      });

      const allPassed = results.every((r) => r.passed);

      return NextResponse.json({
        summary: allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED",
        totalTests: results.length,
        passed: results.filter((r) => r.passed).length,
        failed: results.filter((r) => !r.passed).length,
        results,
      });
    }

    // Default: return current status
    return NextResponse.json({
      message: "Birthday debug endpoint",
      usage: {
        testSpecificTime: "/api/birthday-debug?at=2026-03-15T00:00:00",
        runEdgeCaseTests: "/api/birthday-debug?runTests=true",
      },
      currentStatus: getBirthdayStatus(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 400 }
    );
  }
}
