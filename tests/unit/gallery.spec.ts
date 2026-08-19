import { beforeEach, describe, expect, test } from 'vitest';
import { galleryKey, loadPhotos, persistPhotos, type GalleryPhoto } from '@/services/gallery';

describe('galeria local', () => {
  beforeEach(() => localStorage.clear());

  test('salva e recupera fotos por usuário', () => {
    const photos: GalleryPhoto[] = [{ id:'foto-1', dataUrl:'data:image/jpeg;base64,abc', createdAt:'2026-08-19T12:00:00.000Z' }];
    persistPhotos(galleryKey('aluno@teste.com'), photos);
    expect(loadPhotos(galleryKey('aluno@teste.com'))).toEqual(photos);
  });

  test('migra fotos criadas pela versão anterior', () => {
    localStorage.setItem('galeria:aluno@teste.com', JSON.stringify([{ id:'antiga', dataUrl:'data:image/jpeg;base64,abc' }]));
    const key = galleryKey('aluno@teste.com');
    expect(loadPhotos(key)[0].id).toBe('antiga');
    expect(localStorage.getItem('galeria:aluno@teste.com')).toBeNull();
  });

  test('ignora conteúdo local inválido', () => {
    localStorage.setItem(galleryKey('aluno@teste.com'), 'inválido');
    expect(loadPhotos(galleryKey('aluno@teste.com'))).toEqual([]);
  });
});
