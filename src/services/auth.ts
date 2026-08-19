import { computed, readonly, ref } from 'vue';

export type User = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = 'galeria:users';
const SESSION_KEY = 'galeria:session';

function readUsers(): User[] {
  try {
    const value = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const users = ref<User[]>(readUsers());
const savedSession = localStorage.getItem(SESSION_KEY);
const activeUser = ref<User | null>(
  users.value.find((user) => user.email === savedSession) ?? null,
);

if (savedSession && !activeUser.value) {
  localStorage.removeItem(SESSION_KEY);
}

export const currentUser = readonly(activeUser);
export const isAuthenticated = computed(() => activeUser.value !== null);

export function register(userInput: User): string | null {
  const user: User = {
    name: userInput.name.trim(),
    email: normalizeEmail(userInput.email),
    password: userInput.password,
  };

  if (user.name.length < 2) return 'Informe seu nome.';
  if (!/^\S+@\S+\.\S+$/.test(user.email)) return 'Informe um e-mail válido.';
  if (user.password.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (users.value.some((item) => item.email === user.email)) return 'Este e-mail já está cadastrado.';

  users.value = [...users.value, user];
  localStorage.setItem(USERS_KEY, JSON.stringify(users.value));

  // O cadastro também inicia a sessão antes de liberar a rota protegida.
  startSession(user);
  return null;
}

export function signIn(emailInput: string, password: string): boolean {
  const email = normalizeEmail(emailInput);
  const found = users.value.find((user) => user.email === email && user.password === password);
  if (!found) return false;

  startSession(found);
  return true;
}

function startSession(user: User) {
  activeUser.value = user;
  localStorage.setItem(SESSION_KEY, user.email);
}

export function signOut() {
  activeUser.value = null;
  localStorage.removeItem(SESSION_KEY);
}

export function resetAuthForTests() {
  users.value = readUsers();
  const email = localStorage.getItem(SESSION_KEY);
  activeUser.value = users.value.find((user) => user.email === email) ?? null;
}
