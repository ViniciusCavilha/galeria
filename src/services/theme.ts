import { Preferences } from '@capacitor/preferences';

const DARK_THEME_KEY = 'galeria:dark-mode';
const DARK_THEME_CLASS = 'ion-palette-dark';

export function applyDarkTheme(enabled: boolean) {
  document.documentElement.classList.toggle(DARK_THEME_CLASS, enabled);
}

export async function loadSavedDarkTheme() {
  const saved = await Preferences.get({ key: DARK_THEME_KEY });
  const enabled = saved.value === 'true';
  applyDarkTheme(enabled);
  return enabled;
}

export async function saveDarkTheme(enabled: boolean) {
  applyDarkTheme(enabled);
  await Preferences.set({ key: DARK_THEME_KEY, value: String(enabled) });
}
