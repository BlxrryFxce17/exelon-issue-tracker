/**
 * Platform and OS detection utilities for keyboard shortcuts
 */

export const isMacOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  // Modern userAgentData API check if available
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  if (nav.userAgentData?.platform) {
    return /mac/i.test(nav.userAgentData.platform);
  }
  // Standard userAgent / platform check
  const platform = navigator.platform || navigator.userAgent || '';
  return /Mac|iPhone|iPod|iPad/i.test(platform);
};

export const isWindowsOS = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  if (nav.userAgentData?.platform) {
    return /win/i.test(nav.userAgentData.platform);
  }
  const platform = navigator.platform || navigator.userAgent || '';
  return /Win/i.test(platform);
};

/** Primary modifier key symbol: ⌘ on Mac, Ctrl on Windows/Linux */
export const getModKey = (): string => {
  return isMacOS() ? '⌘' : 'Ctrl';
};

/** Primary modifier key name: Cmd on Mac, Ctrl on Windows/Linux */
export const getModKeyName = (): string => {
  return isMacOS() ? 'Cmd' : 'Ctrl';
};

/** Option / Alt key name */
export const getAltKey = (): string => {
  return isMacOS() ? '⌥' : 'Alt';
};

/** Returns human-readable OS name for UI display */
export const getOSName = (): string => {
  if (isMacOS()) return 'macOS';
  if (isWindowsOS()) return 'Windows';
  return 'Linux';
};
