import { beforeEach, describe, expect, test } from 'vitest';
import {
  currentUser, isAuthenticated, register, resetAuthForTests, signIn, signOut,
} from '@/services/auth';

describe('autenticação local', () => {
  beforeEach(() => {
    localStorage.clear();
    resetAuthForTests();
  });

  test('cadastro inicia sessão imediatamente para liberar a Home', () => {
    const error = register({ name: 'Vinicius', email: 'Aluno@Teste.com ', password: '123456' });
    expect(error).toBeNull();
    expect(isAuthenticated.value).toBe(true);
    expect(currentUser.value?.email).toBe('aluno@teste.com');
    expect(localStorage.getItem('galeria:session')).toBe('aluno@teste.com');
  });

  test('encerra e inicia uma nova sessão com os dados cadastrados', () => {
    register({ name: 'Aluno Teste', email: 'aluno@teste.com', password: '123456' });
    signOut();
    expect(isAuthenticated.value).toBe(false);
    expect(signIn(' ALUNO@teste.com ', '123456')).toBe(true);
    expect(isAuthenticated.value).toBe(true);
  });

  test('recusa senha incorreta', () => {
    register({ name: 'Aluno', email: 'aluno@teste.com', password: '123456' });
    signOut();
    expect(signIn('aluno@teste.com', 'errada')).toBe(false);
    expect(isAuthenticated.value).toBe(false);
  });

  test('não aceita e-mail duplicado', () => {
    register({ name: 'Aluno', email: 'aluno@teste.com', password: '123456' });
    expect(register({ name: 'Outro', email: 'ALUNO@teste.com', password: 'abcdef' })).toContain('já está cadastrado');
  });
});
