import { computed, ref } from 'vue';
export type User = { name: string; email: string; password: string };
const USERS_KEY = 'galeria:users';
const SESSION_KEY = 'galeria:session';
function readUsers(): User[] { try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]'); } catch { return []; } }
const sessionEmail = ref(localStorage.getItem(SESSION_KEY));
export const currentUser = computed(() => readUsers().find((user) => user.email === sessionEmail.value) ?? null);
export const isAuthenticated = computed(() => Boolean(currentUser.value));
export function register(user: User): string | null {
  const users = readUsers(); const email = user.email.trim().toLowerCase();
  if (users.some((item) => item.email === email)) return 'Este e-mail já está cadastrado.';
  users.push({ ...user, name: user.name.trim(), email });
  localStorage.setItem(USERS_KEY, JSON.stringify(users)); localStorage.setItem(SESSION_KEY, email); sessionEmail.value = email; return null;
}
export function signIn(emailInput: string, password: string): boolean {
  const email = emailInput.trim().toLowerCase(); const found = readUsers().find((user) => user.email === email && user.password === password);
  if (!found) return false; localStorage.setItem(SESSION_KEY, email); sessionEmail.value = email; return true;
}
export function signOut() { localStorage.removeItem(SESSION_KEY); sessionEmail.value = null; }
