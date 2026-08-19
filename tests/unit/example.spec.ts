import { beforeEach, describe, expect, test } from 'vitest';
import { isAuthenticated, register, signIn, signOut } from '@/services/auth';
describe('autenticação local', () => {
  beforeEach(() => { signOut(); localStorage.clear(); });
  test('cadastra, encerra e inicia uma sessão', () => {
    expect(register({ name:'Aluno Teste', email:'aluno@teste.com', password:'123456' })).toBeNull();
    expect(isAuthenticated.value).toBe(true); signOut(); expect(isAuthenticated.value).toBe(false);
    expect(signIn('aluno@teste.com','123456')).toBe(true);
  });
  test('não aceita e-mail duplicado', () => {
    register({ name:'Aluno', email:'aluno@teste.com', password:'123456' });
    expect(register({ name:'Outro', email:'ALUNO@teste.com', password:'abcdef' })).toContain('já está cadastrado');
  });
});
