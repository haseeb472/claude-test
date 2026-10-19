export type FeatureIcon =
  | { type: 'image'; desktopSrc: string; mobileSrc: string }
  | { type: 'glyph'; glyph: string; className: string }

export interface Feature {
  title: string
  description: string
  // Shorter copy used by the mobile design.
  shortDescription: string
  icon: FeatureIcon
}
