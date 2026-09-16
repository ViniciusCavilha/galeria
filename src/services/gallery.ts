export type GalleryPhoto = {
  id: string;
  dataUrl: string;
  filePath?: string;
  createdAt: string;
};

const MAX_IMAGE_SIZE = 1600;
const JPEG_QUALITY = 0.82;

export function galleryKey(email: string) {
  const key = `galeria:photos:${email}`;
  const legacyKey = `galeria:${email}`;
  if (!localStorage.getItem(key) && localStorage.getItem(legacyKey)) {
    localStorage.setItem(key, localStorage.getItem(legacyKey) as string);
    localStorage.removeItem(legacyKey);
  }
  return key;
}

export function loadPhotos(key: string): GalleryPhoto[] {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]') as Array<Partial<GalleryPhoto>>;
    return saved
      .filter((photo) => photo.id && photo.dataUrl)
      .map((photo) => ({
        id: photo.id as string,
        dataUrl: photo.dataUrl as string,
        filePath: photo.filePath,
        createdAt: photo.createdAt ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function persistPhotos(key: string, photos: GalleryPhoto[]) {
  localStorage.setItem(key, JSON.stringify(photos));
}

export function createPhoto(dataUrl: string, filePath?: string): GalleryPhoto {
  return {
    id: `${Date.now()}-${crypto.randomUUID()}`,
    dataUrl,
    filePath,
    createdAt: new Date().toISOString(),
  };
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function optimizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Não foi possível processar a imagem.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    image.onerror = () => reject(new Error('Imagem inválida.'));
    image.src = dataUrl;
  });
}
