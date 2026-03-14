/**
 * birthday-engine.ts
 * 
 * Single source of truth for all birthday activation logic.
 * All date calculations use America/Chicago (Houston time).
 * 
 * Birthday: March 15, every year
 * Activation window: March 15 00:00:00 → March 15 23:59:59.999 CST/CDT
 * Outside window: Countdown mode targeting next March 15
 */

import { DateTime, Duration } from "luxon";

// ─── Constants ───────────────────────────────────────────────────────────────

const TIMEZONE = "America/Chicago";
const BIRTHDAY_MONTH = 3;  // March
const BIRTHDAY_DAY = 15;

export type BirthdayMode = "countdown" | "birthday";

export interface BirthdayStatus {
  currentMode: BirthdayMode;
  isBirthdayLive: boolean;
  serverTime: string;           // ISO string in Houston time
  serverTimeUTC: string;        // ISO string in UTC
  timezone: string;
  targetDate: string;           // "YYYY-MM-DD"
  unlockAt: string;             // ISO datetime when birthday mode activates
  lockAt: string;               // ISO datetime when birthday mode deactivates
  secondsRemaining: number;     // seconds until next state change
  millisecondsRemaining: number;// ms until next state change
  countdownTarget: string;      // ISO datetime the countdown is targeting
  birthdayYear: number;         // which year's birthday we're referencing
}

// ─── Core Engine ─────────────────────────────────────────────────────────────

/**
 * Get the current time in Houston timezone.
 */
export function getNow(): DateTime {
  return DateTime.now().setZone(TIMEZONE);
}

/**
 * Get the unlock datetime (start of birthday) for a given year.
 * March 15 at 00:00:00.000 America/Chicago
 */
export function getUnlockDateTime(year: number): DateTime {
  return DateTime.fromObject(
    { year, month: BIRTHDAY_MONTH, day: BIRTHDAY_DAY, hour: 0, minute: 0, second: 0, millisecond: 0 },
    { zone: TIMEZONE }
  );
}

/**
 * Get the lock datetime (end of birthday) for a given year.
 * March 15 at 23:59:59.999 America/Chicago
 */
export function getLockDateTime(year: number): DateTime {
  return DateTime.fromObject(
    { year, month: BIRTHDAY_MONTH, day: BIRTHDAY_DAY, hour: 23, minute: 59, second: 59, millisecond: 999 },
    { zone: TIMEZONE }
  );
}

/**
 * Determine the current mode based on Houston time.
 * 
 * Logic:
 * - If now is within [unlock, lock] of current year → birthday mode
 * - Otherwise → countdown mode
 */
export function getCurrentMode(now?: DateTime): BirthdayMode {
  const current = now ?? getNow();
  const year = current.year;
  
  const unlock = getUnlockDateTime(year);
  const lock = getLockDateTime(year);
  
  if (current >= unlock && current <= lock) {
    return "birthday";
  }
  
  return "countdown";
}

/**
 * Get the next target birthday datetime.
 * 
 * - If we're before this year's birthday → target this year
 * - If we're during this year's birthday → target is current (live)
 * - If we're after this year's birthday → target next year
 */
export function getTargetBirthday(now?: DateTime): { unlock: DateTime; lock: DateTime; year: number } {
  const current = now ?? getNow();
  const year = current.year;
  
  const thisYearUnlock = getUnlockDateTime(year);
  const thisYearLock = getLockDateTime(year);
  
  // Currently in birthday window
  if (current >= thisYearUnlock && current <= thisYearLock) {
    return { unlock: thisYearUnlock, lock: thisYearLock, year };
  }
  
  // Before this year's birthday
  if (current < thisYearUnlock) {
    return { unlock: thisYearUnlock, lock: thisYearLock, year };
  }
  
  // After this year's birthday → next year
  const nextYear = year + 1;
  return {
    unlock: getUnlockDateTime(nextYear),
    lock: getLockDateTime(nextYear),
    year: nextYear,
  };
}

/**
 * Calculate time remaining until the next state change.
 * 
 * - In countdown mode: time until unlock
 * - In birthday mode: time until lock
 */
export function getTimeRemaining(now?: DateTime): { seconds: number; milliseconds: number; targetDateTime: DateTime } {
  const current = now ?? getNow();
  const mode = getCurrentMode(current);
  const target = getTargetBirthday(current);
  
  let targetDateTime: DateTime;
  
  if (mode === "countdown") {
    // Counting down to the unlock moment
    targetDateTime = target.unlock;
  } else {
    // Birthday is live — counting down to lock
    targetDateTime = target.lock;
  }
  
  const diff = targetDateTime.diff(current, ["seconds", "milliseconds"]);
  
  return {
    seconds: Math.max(0, Math.floor(diff.as("seconds"))),
    milliseconds: Math.max(0, Math.floor(diff.as("milliseconds"))),
    targetDateTime,
  };
}

/**
 * Generate the complete birthday status payload.
 * This is the single function the API endpoint calls.
 */
export function getBirthdayStatus(): BirthdayStatus {
  const now = getNow();
  const mode = getCurrentMode(now);
  const target = getTargetBirthday(now);
  const remaining = getTimeRemaining(now);
  
  return {
    currentMode: mode,
    isBirthdayLive: mode === "birthday",
    serverTime: now.toISO()!,
    serverTimeUTC: now.toUTC().toISO()!,
    timezone: TIMEZONE,
    targetDate: `${target.year}-${String(BIRTHDAY_MONTH).padStart(2, "0")}-${String(BIRTHDAY_DAY).padStart(2, "0")}`,
    unlockAt: target.unlock.toISO()!,
    lockAt: target.lock.toISO()!,
    secondsRemaining: remaining.seconds,
    millisecondsRemaining: remaining.milliseconds,
    countdownTarget: remaining.targetDateTime.toISO()!,
    birthdayYear: target.year,
  };
}

// ─── Validation & Edge Cases ─────────────────────────────────────────────────

/**
 * Validate that the engine correctly handles midnight transitions.
 * Use for testing — call with specific datetimes to verify behavior.
 */
export function validateAtTime(isoString: string): BirthdayStatus {
  const testTime = DateTime.fromISO(isoString, { zone: TIMEZONE });
  
  if (!testTime.isValid) {
    throw new Error(`Invalid datetime: ${isoString}`);
  }
  
  const mode = getCurrentMode(testTime);
  const target = getTargetBirthday(testTime);
  const remaining = getTimeRemaining(testTime);
  
  return {
    currentMode: mode,
    isBirthdayLive: mode === "birthday",
    serverTime: testTime.toISO()!,
    serverTimeUTC: testTime.toUTC().toISO()!,
    timezone: TIMEZONE,
    targetDate: `${target.year}-${String(BIRTHDAY_MONTH).padStart(2, "0")}-${String(BIRTHDAY_DAY).padStart(2, "0")}`,
    unlockAt: target.unlock.toISO()!,
    lockAt: target.lock.toISO()!,
    secondsRemaining: remaining.seconds,
    millisecondsRemaining: remaining.milliseconds,
    countdownTarget: remaining.targetDateTime.toISO()!,
    birthdayYear: target.year,
  };
}
