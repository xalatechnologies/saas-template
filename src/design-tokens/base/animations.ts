/**
 * Animation tokens for consistent motion patterns across the application
 */
import { AnimationTokens } from '../animation-types';

export const animation: AnimationTokens = {
  "durations": {
    "xfast": "100ms",
    "fast": "200ms",
    "normal": "300ms",
    "medium": "400ms",
    "slow": "500ms",
    "xslow": "800ms",
    "xxslow": "1200ms"
  },
  "easings": {
    "linear": "linear",
    "standard": "cubic-bezier(0.4, 0.0, 0.2, 1)",
    "easeOut": "cubic-bezier(0.0, 0.0, 0.2, 1)",
    "emphasizedDecelerate": "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
    "easeIn": "cubic-bezier(0.4, 0.0, 1, 1)",
    "emphasizedAccelerate": "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
    "easeInOut": "cubic-bezier(0.4, 0.0, 0.2, 1)",
    "spring": "cubic-bezier(0.5, 0, 0.1, 1)"
  },
  "presets": {
    "fadeIn": {
      "duration": "300ms",
      "easing": "cubic-bezier(0.0, 0.0, 0.2, 1)",
      "properties": "opacity"
    },
    "fadeOut": {
      "duration": "250ms",
      "easing": "cubic-bezier(0.4, 0.0, 1, 1)",
      "properties": "opacity"
    },
    "slideUp": {
      "duration": "400ms",
      "easing": "cubic-bezier(0.0, 0.0, 0.2, 1)",
      "properties": "transform"
    },
    "slideDown": {
      "duration": "350ms",
      "easing": "cubic-bezier(0.4, 0.0, 0.2, 1)",
      "properties": "transform"
    },
    "scaleUp": {
      "duration": "400ms",
      "easing": "cubic-bezier(0.5, 0, 0.1, 1)",
      "properties": "transform"
    },
    "scaleDown": {
      "duration": "350ms",
      "easing": "cubic-bezier(0.5, 0, 0.1, 1)",
      "properties": "transform"
    }
  },
  "delay": {
    "none": "0ms",
    "short": "50ms",
    "medium": "100ms",
    "long": "200ms"
  },
  "stagger": {
    "xxsmall": "10ms",
    "xsmall": "20ms",
    "small": "30ms",
    "medium": "50ms",
    "large": "80ms",
    "xlarge": "100ms"
  }
};
