import logo1 from '../assets/icons/trusted_logo_1.svg'
import logo2 from '../assets/icons/trusted_logo_2.svg'
import logo3 from '../assets/icons/trusted_logo_3.svg'
import logo4 from '../assets/icons/trusted_logo_4.svg'
import logo5 from '../assets/icons/trusted_logo_5.svg'
import logo6 from '../assets/icons/trusted_logo_6.svg'
import type { TrustedLogo } from '../types/trustedBy'

export const trustedByHeading = 'Trusted by modern teams'

// The logo files are cropped differently (33, 22 and 13px tall), so they are
// aligned by their text baseline instead of by the centre of the file.
export const LOGO_BASELINE = 25

export const trustedLogos: TrustedLogo[] = [
  { name: 'Google', src: logo1, baseline: 25.1 },
  { name: 'Slack', src: logo2, baseline: 25 },
  { name: 'Notion', src: logo3, baseline: 25 },
  { name: 'Spotify', src: logo4, baseline: 16.75 },
  { name: 'Zoom', src: logo5, baseline: 12.13 },
  { name: 'Shopify', src: logo6, baseline: 16.75 },
]
