import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(miliseconds) {
  let startTime = performance.now();
  while (performance.now() - startTime < miliseconds) {

  }
}

export function convertPreferenceToStyle(preferences) {
  return {
    ...preferences,
    fontSize: preferences.fontSize.toString() + 'px',
    lineHeight: preferences.lineHeight,
  };
}
