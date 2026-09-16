<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          <span class="wordmark"><span class="wordmark-dot"></span>memórias</span>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button class="header-button" router-link="/sobre" aria-label="Abrir tela sobre">
            <ion-icon slot="icon-only" :icon="informationCircleOutline" />
          </ion-button>
          <ion-button class="header-button" aria-label="Sair" @click="confirmLogout">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="page-shell">
        <section class="hero">
          <div>
            <p class="eyebrow">OLÁ, {{ firstName.toUpperCase() }}</p>
            <h1>Seus momentos,<br><span>todos aqui.</span></h1>
          </div>
          <div class="counter" :class="{ empty: !photos.length }">
            <strong>{{ photos.length }}</strong>
            <span>{{ photos.length === 1 ? 'memória' : 'memórias' }}</span>
          </div>
        </section>

        <div v-if="photos.length" class="gallery-heading">
          <div><h2>Minha coleção</h2><p>Toque em uma foto para ampliar</p></div>
          <ion-button fill="clear" size="small" @click="openAddMenu"><ion-icon slot="start" :icon="addOutline" />Adicionar</ion-button>
        </div>

        <section v-if="photos.length" class="photo-grid" aria-label="Fotos salvas">
          <article v-for="(photo, index) in photos" :key="photo.id" class="photo-card">
            <button class="photo-open" type="button" :aria-label="`Abrir foto ${index + 1}`" @click="openPhoto(photo)">
              <img :src="photo.dataUrl" alt="" />
              <span class="photo-overlay"><ion-icon :icon="expandOutline" /></span>
            </button>
            <div class="photo-actions">
              <ion-button class="photo-action" fill="clear" size="small" aria-label="Compartilhar foto" @click.stop="sharePhoto(photo)">
                <ion-icon slot="icon-only" :icon="shareSocialOutline" />
              </ion-button>
              <ion-button class="photo-action danger" fill="clear" size="small" aria-label="Remover foto" @click.stop="askRemove(photo)">
                <ion-icon slot="icon-only" :icon="trashOutline" />
              </ion-button>
            </div>
          </article>
        </section>

        <section v-else class="empty-state">
          <div class="empty-art">
            <span class="polaroid one"></span><span class="polaroid two"></span>
            <div class="empty-icon"><ion-icon :icon="imagesOutline" /></div>
          </div>
          <p class="eyebrow">SUA COLEÇÃO</p>
          <h2>Comece uma história</h2>
          <p>Escolha uma foto especial ou capture um novo momento para guardar aqui.</p>
          <ion-button shape="round" size="large" @click="openAddMenu"><ion-icon slot="start" :icon="addOutline" />Adicionar memória</ion-button>
        </section>
      </div>

      <ion-fab v-if="photos.length" slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button aria-label="Adicionar foto" @click="openAddMenu"><ion-icon :icon="addOutline" /></ion-fab-button>
      </ion-fab>

      <ion-action-sheet
        :is-open="addMenuOpen"
        header="Adicionar uma memória"
        sub-header="Escolha de onde vem a sua foto"
        :buttons="addButtons"
        @did-dismiss="addMenuOpen=false"
      />

      <ion-action-sheet
        :is-open="logoutMenuOpen"
        header="Deseja sair?"
        sub-header="Suas fotos continuarão salvas neste aparelho."
        :buttons="logoutButtons"
        @did-dismiss="logoutMenuOpen=false"
      />

      <ion-modal :is-open="Boolean(selectedPhoto)" class="photo-modal" @did-dismiss="selectedPhoto=null">
        <ion-header class="ion-no-border"><ion-toolbar>
          <ion-title>Memória</ion-title>
          <ion-buttons slot="end"><ion-button @click="selectedPhoto=null">Fechar</ion-button></ion-buttons>
        </ion-toolbar></ion-header>
        <ion-content :fullscreen="true">
          <div v-if="selectedPhoto" class="preview">
            <img :src="selectedPhoto.dataUrl" alt="Foto ampliada" />
            <div class="preview-info">
              <div><span>ADICIONADA EM</span><strong>{{ formatDate(selectedPhoto.createdAt) }}</strong></div>
              <div class="preview-actions">
                <ion-button fill="outline" shape="round" @click="sharePhoto(selectedPhoto)"><ion-icon slot="start" :icon="shareSocialOutline" />Compartilhar</ion-button>
                <ion-button color="danger" fill="outline" shape="round" @click="askRemove(selectedPhoto)"><ion-icon slot="start" :icon="trashOutline" />Remover</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
      </ion-modal>

      <ion-alert
        :is-open="Boolean(photoToRemove)"
        header="Remover esta memória?"
        message="Esta ação não poderá ser desfeita."
        :buttons="removeButtons"
        @did-dismiss="photoToRemove=null"
      />
      <ion-loading :is-open="isLoading" message="Preparando suas fotos..." />
      <ion-toast :is-open="Boolean(message)" :message="message" :duration="2600" position="bottom" @did-dismiss="message=''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  IonActionSheet, IonAlert, IonButton, IonButtons, IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon, IonLoading, IonModal, IonPage, IonTitle, IonToast, IonToolbar,
} from '@ionic/vue';
import {
  addOutline, cameraOutline, closeOutline, expandOutline, imagesOutline,
  informationCircleOutline, logOutOutline, shareSocialOutline, trashOutline,
} from 'ionicons/icons';
import { currentUser, signOut } from '@/services/auth';
import { blobToDataUrl, createPhoto, galleryKey, loadPhotos, optimizeImage, persistPhotos, type GalleryPhoto } from '@/services/gallery';

const router = useRouter();
const message = ref('');
const isLoading = ref(false);
const addMenuOpen = ref(false);
const logoutMenuOpen = ref(false);
const selectedPhoto = ref<GalleryPhoto | null>(null);
const photoToRemove = ref<GalleryPhoto | null>(null);
const storageKey = galleryKey(currentUser.value?.email ?? 'visitante');
const photos = ref<GalleryPhoto[]>(loadPhotos(storageKey));
const firstName = computed(() => currentUser.value?.name.split(' ')[0] ?? 'visitante');

const addButtons = [
  { text: 'Tirar uma foto', icon: cameraOutline, handler: () => void takePhoto() },
  { text: 'Escolher da galeria', icon: imagesOutline, handler: () => void chooseFromGallery() },
  { text: 'Cancelar', role: 'cancel', icon: closeOutline },
];
const logoutButtons = [
  { text: 'Sair da conta', role: 'destructive', icon: logOutOutline, handler: () => void logout() },
  { text: 'Continuar no app', role: 'cancel' },
];
const removeButtons = [
  { text: 'Cancelar', role: 'cancel' },
  { text: 'Remover', role: 'destructive', handler: () => void removeConfirmed() },
];

function openAddMenu() { addMenuOpen.value = true; }
function confirmLogout() { logoutMenuOpen.value = true; }
function openPhoto(photo: GalleryPhoto) { selectedPhoto.value = photo; }
function askRemove(photo: GalleryPhoto) { photoToRemove.value = photo; }

function savePhotos() {
  try { persistPhotos(storageKey, photos.value); return true; }
  catch { message.value = 'O armazenamento do aparelho está cheio. Remova algumas fotos.'; return false; }
}

function getBase64Image(dataUrl: string) {
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) throw new Error('Formato de imagem inválido.');
  return base64Data;
}

async function saveImageFile(dataUrl: string) {
  const filePath = `fotos/foto-${Date.now()}-${crypto.randomUUID()}.jpg`;
  await Filesystem.writeFile({
    path: filePath,
    data: getBase64Image(dataUrl),
    directory: Directory.Data,
    recursive: true,
  });
  return filePath;
}

async function addPhoto(dataUrl: string, save = true) {
  const optimized = await optimizeImage(dataUrl);
  const filePath = await saveImageFile(optimized);
  photos.value.unshift(createPhoto(optimized, filePath));
  if (save) savePhotos();
}

async function takePhoto() {
  try {
    const permission = await Camera.requestPermissions({ permissions: ['camera'] });
    if (permission.camera !== 'granted') { message.value = 'Permita o acesso à câmera para tirar uma foto.'; return; }
    const photo = await Camera.getPhoto({ quality: 88, source: CameraSource.Camera, resultType: CameraResultType.DataUrl, correctOrientation: true });
    if (photo.dataUrl) { isLoading.value = true; await addPhoto(photo.dataUrl); message.value = 'Nova memória adicionada!'; }
  } catch (error) { handleCameraError(error); }
  finally { isLoading.value = false; }
}

async function chooseFromGallery() {
  try {
    const result = await Camera.pickImages({ quality: 88, limit: 10 });
    if (!result.photos.length) return;
    isLoading.value = true;
    for (const selected of result.photos) {
      const blob = await (await fetch(selected.webPath)).blob();
      await addPhoto(await blobToDataUrl(blob), false);
    }
    if (savePhotos()) message.value = result.photos.length === 1 ? 'Memória adicionada!' : `${result.photos.length} memórias adicionadas!`;
  } catch (error) { handleCameraError(error); }
  finally { isLoading.value = false; }
}

async function getShareFile(photo: GalleryPhoto) {
  if (photo.filePath) {
    return Filesystem.getUri({ path: photo.filePath, directory: Directory.Data });
  }

  const path = `compartilhar/memoria-${photo.id}.jpg`;
  await Filesystem.writeFile({ path, data: getBase64Image(photo.dataUrl), directory: Directory.Cache, recursive: true });
  return Filesystem.getUri({ path, directory: Directory.Cache });
}

async function sharePhoto(photo: GalleryPhoto) {
  try {
    const { uri } = await getShareFile(photo);
    await Share.share({
      title: 'Memória',
      text: 'Olha essa memória que salvei no app.',
      files: [uri],
      dialogTitle: 'Compartilhar foto',
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message.toLowerCase() : '';
    if (!detail.includes('cancel')) message.value = 'Não foi possível compartilhar esta foto.';
  }
}

async function removeSavedPhotoFile(photo: GalleryPhoto) {
  if (!photo.filePath) return;
  try { await Filesystem.deleteFile({ path: photo.filePath, directory: Directory.Data }); }
  catch { /* The gallery entry can still be removed if the file is already gone. */ }
}

async function removeConfirmed() {
  const photo = photoToRemove.value;
  if (!photo) return;
  photos.value = photos.value.filter((item) => item.id !== photo.id);
  selectedPhoto.value = null; photoToRemove.value = null;
  await removeSavedPhotoFile(photo);
  savePhotos(); message.value = 'Memória removida.';
}
function handleCameraError(error: unknown) {
  const detail = error instanceof Error ? error.message.toLowerCase() : '';
  if (!detail.includes('cancel')) message.value = 'Não foi possível acessar suas fotos. Confira as permissões.';
}
function formatDate(value: string) { return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(value)); }
async function logout() { signOut(); await router.replace('/login'); }
</script>

<style scoped>
.page-shell{max-width:980px;margin:0 auto;padding:0 18px 110px}.wordmark{display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:850;letter-spacing:-.03em}.wordmark-dot{width:11px;height:11px;border-radius:4px;background:linear-gradient(135deg,var(--ion-color-primary),var(--ion-color-secondary));box-shadow:0 0 0 5px rgba(var(--ion-color-primary-rgb),.1)}.header-button{--color:var(--ion-color-dark)}.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;padding:38px 4px 34px}.eyebrow{margin:0 0 9px;color:var(--ion-color-primary);font-size:.69rem;font-weight:900;letter-spacing:.17em}.hero h1{margin:0;color:var(--ion-color-dark);font-size:clamp(2.25rem,9vw,4.4rem);line-height:.98;font-weight:850;letter-spacing:-.055em}.hero h1 span{color:var(--ion-color-medium)}.counter{display:flex;flex:0 0 auto;flex-direction:column;align-items:center;justify-content:center;width:88px;height:88px;border-radius:28px;background:var(--ion-color-dark);color:var(--ion-color-light);box-shadow:0 14px 32px rgba(20,17,35,.16);transform:rotate(3deg)}.counter.empty{opacity:.22}.counter strong{font-size:1.7rem;line-height:1}.counter span{margin-top:5px;font-size:.62rem;font-weight:700}.gallery-heading{display:flex;align-items:end;justify-content:space-between;margin:4px 3px 18px}.gallery-heading h2{margin:0 0 4px;font-size:1.25rem;font-weight:800}.gallery-heading p{margin:0;color:var(--ion-color-medium);font-size:.78rem}.gallery-heading ion-button{margin:0 -10px 0 0;font-weight:750}.photo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.photo-card{position:relative;overflow:hidden;border-radius:20px;background:var(--ion-color-light);box-shadow:0 6px 22px rgba(28,20,56,.08);aspect-ratio:1}.photo-card:nth-child(5n+1){grid-row:span 2;aspect-ratio:auto}.photo-open{display:block;width:100%;height:100%;padding:0;border:0;background:transparent;cursor:pointer}.photo-open img{width:100%;height:100%;display:block;object-fit:cover;transition:transform .35s ease}.photo-open:active img{transform:scale(1.04)}.photo-overlay{position:absolute;right:9px;bottom:9px;display:grid;place-items:center;width:31px;height:31px;border-radius:11px;background:rgba(13,10,24,.52);color:#fff;font-size:.9rem;backdrop-filter:blur(8px)}.photo-actions{position:absolute;top:8px;right:8px;display:flex;gap:6px}.photo-action{width:34px;height:34px;margin:0;--padding-start:0;--padding-end:0;--border-radius:12px;--background:rgba(13,10,24,.54);--background-hover:rgba(13,10,24,.7);--color:#fff;backdrop-filter:blur(8px)}.photo-action.danger{--color:#ffd9e0}.empty-state{min-height:62vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 20px 80px;text-align:center}.empty-art{position:relative;width:150px;height:135px;margin-bottom:25px}.polaroid{position:absolute;top:18px;left:31px;width:80px;height:96px;border:8px solid #fff;border-bottom-width:22px;border-radius:4px;background:linear-gradient(145deg,#c6bcff,#ffb9d9);box-shadow:0 15px 30px rgba(41,25,89,.18);transform:rotate(-12deg)}.polaroid.two{left:50px;transform:rotate(11deg);background:linear-gradient(145deg,#ffd49c,#ff829b)}.empty-icon{position:absolute;right:3px;bottom:3px;display:grid;place-items:center;width:54px;height:54px;border:5px solid var(--ion-background-color);border-radius:19px;background:var(--ion-color-primary);color:#fff;font-size:1.65rem}.empty-state h2{margin:0 0 9px;font-size:1.7rem;font-weight:850;letter-spacing:-.035em}.empty-state>p:not(.eyebrow){max-width:330px;margin:0 0 24px;color:var(--ion-color-medium);line-height:1.55}.empty-state ion-button{--padding-start:24px;--padding-end:24px;font-weight:750}.preview{min-height:100%;display:flex;flex-direction:column;background:#0d0b12}.preview>img{width:100%;flex:1;min-height:55vh;object-fit:contain}.preview-info{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 22px calc(22px + env(safe-area-inset-bottom));background:var(--ion-background-color)}.preview-info div{display:flex;flex-direction:column;gap:4px}.preview-info span{color:var(--ion-color-medium);font-size:.62rem;font-weight:850;letter-spacing:.12em}.preview-info strong{font-size:.88rem;text-transform:capitalize}.preview-actions{flex-direction:row!important;flex-wrap:wrap;justify-content:flex-end}.preview-actions ion-button{margin:0}ion-fab-button{--box-shadow:0 12px 28px rgba(var(--ion-color-primary-rgb),.4)}@media(min-width:700px){.page-shell{padding-inline:30px}.photo-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.hero{padding-top:60px}.counter{width:110px;height:110px}.counter strong{font-size:2.2rem}}:global(.ion-palette-dark) .polaroid{border-color:#28252e}:global(.ion-palette-dark) .empty-icon{border-color:#111118}:global(.ion-palette-dark) .counter{background:#f5f2ff;color:#15121e}:global(.ion-palette-dark) .header-button{--color:#fff}@media(max-width:520px){.preview-info{align-items:flex-start;flex-direction:column}.preview-actions{justify-content:flex-start}}
</style>
