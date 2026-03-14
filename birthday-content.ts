/**
 * birthday-content.ts
 * 
 * Content layer for the birthday experience.
 * Currently hardcoded — structured for easy migration to
 * Supabase, JSON files, or any CMS later.
 * 
 * To migrate: replace the getXxx() functions with database queries.
 * The return types stay the same, so the API contract doesn't break.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  src: string;           // image URL or path
  caption: string;
  category?: string;     // "us" | "her" | "moments" | "adventures"
  order: number;
}

export interface LoveNote {
  id: string;
  title: string;
  body: string;
  timestamp?: string;    // optional: when it was written
  mood?: string;         // optional: "grateful" | "playful" | "deep" | "memory"
  order: number;
}

export interface TimelineEntry {
  id: string;
  date: string;          // display date like "June 2024"
  title: string;
  description: string;
  icon?: string;         // emoji or icon identifier
  order: number;
}

export interface SurpriseCard {
  id: string;
  type: "reveal" | "gift" | "promise" | "memory";
  title: string;
  content: string;
  isLocked: boolean;     // can be used for progressive unlocks
  unlockOrder?: number;  // order in which cards unlock
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontDisplay: string;
  fontBody: string;
  heroTitle: string;
  heroSubtitle: string;
  flowerEmoji: string;
  birthdayAge?: number;
}

export interface FeatureFlags {
  showGallery: boolean;
  showLoveNotes: boolean;
  showTimeline: boolean;
  showSurpriseCards: boolean;
  showCountdownOnBirthday: boolean;  // show "time remaining" during birthday
  enableProgressiveUnlocks: boolean;
}

export interface BirthdayContent {
  theme: ThemeConfig;
  features: FeatureFlags;
  gallery: GalleryItem[];
  loveNotes: LoveNote[];
  timeline: TimelineEntry[];
  surpriseCards: SurpriseCard[];
}

// ─── Default Content (Hardcoded — Replace Later) ─────────────────────────────

function getTheme(): ThemeConfig {
  return {
    primaryColor: "#d4af37",        // Gold
    accentColor: "#f5e6cc",         // Warm cream
    backgroundColor: "#0a0a0a",     // Deep black
    fontDisplay: "Playfair Display",
    fontBody: "Cormorant Garamond",
    heroTitle: "Happy Birthday",
    heroSubtitle: "A day made just for you",
    flowerEmoji: "🌹",
    birthdayAge: undefined,         // Set if you want to display age
  };
}

function getFeatureFlags(): FeatureFlags {
  return {
    showGallery: true,
    showLoveNotes: true,
    showTimeline: true,
    showSurpriseCards: true,
    showCountdownOnBirthday: false,
    enableProgressiveUnlocks: false,
  };
}

function getGallery(): GalleryItem[] {
  // STUB: Replace with real photos
  return [
    {
      id: "g1",
      src: "/images/gallery/placeholder-1.jpg",
      caption: "A moment I'll never forget",
      category: "moments",
      order: 1,
    },
    {
      id: "g2",
      src: "/images/gallery/placeholder-2.jpg",
      caption: "Us, always",
      category: "us",
      order: 2,
    },
  ];
}

function getLoveNotes(): LoveNote[] {
  // STUB: Replace with real notes
  return [
    {
      id: "ln1",
      title: "Why You Matter",
      body: "Write your heart here. This is where the real words go.",
      mood: "deep",
      order: 1,
    },
    {
      id: "ln2",
      title: "Remember When...",
      body: "A memory that made everything make sense.",
      mood: "memory",
      order: 2,
    },
  ];
}

function getTimeline(): TimelineEntry[] {
  // STUB: Replace with real timeline entries
  return [
    {
      id: "t1",
      date: "The Beginning",
      title: "First Chapter",
      description: "Where it all started.",
      icon: "✨",
      order: 1,
    },
    {
      id: "t2",
      date: "A Turning Point",
      title: "Everything Changed",
      description: "The moment things got real.",
      icon: "💛",
      order: 2,
    },
  ];
}

function getSurpriseCards(): SurpriseCard[] {
  // STUB: Replace with real surprises
  return [
    {
      id: "sc1",
      type: "reveal",
      title: "Open Me First",
      content: "The first surprise of the day.",
      isLocked: false,
      unlockOrder: 1,
    },
    {
      id: "sc2",
      type: "promise",
      title: "A Promise",
      content: "Something I commit to, for you.",
      isLocked: false,
      unlockOrder: 2,
    },
  ];
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get the complete birthday content payload.
 * This is the single function the content API endpoint calls.
 * 
 * To migrate to a database:
 * 1. Replace each getXxx() call with a Supabase/DB query
 * 2. Keep this function signature the same
 * 3. The API route doesn't need to change
 */
export function getBirthdayContent(): BirthdayContent {
  return {
    theme: getTheme(),
    features: getFeatureFlags(),
    gallery: getGallery(),
    loveNotes: getLoveNotes(),
    timeline: getTimeline(),
    surpriseCards: getSurpriseCards(),
  };
}

/**
 * Get content filtered by feature flags.
 * If a feature is disabled, its content array is empty.
 */
export function getFilteredContent(): BirthdayContent {
  const content = getBirthdayContent();
  const flags = content.features;
  
  return {
    ...content,
    gallery: flags.showGallery ? content.gallery : [],
    loveNotes: flags.showLoveNotes ? content.loveNotes : [],
    timeline: flags.showTimeline ? content.timeline : [],
    surpriseCards: flags.showSurpriseCards ? content.surpriseCards : [],
  };
}
