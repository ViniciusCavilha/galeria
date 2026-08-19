import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = { appId: 'br.edu.galeria.memorias', appName: 'Memórias', webDir: 'dist', plugins: { Camera: { presentationStyle: 'popover' } } };
export default config;
