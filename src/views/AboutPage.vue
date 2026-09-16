<template>
  <ion-page>
    <ion-header class="ion-no-border"><ion-toolbar>
      <ion-buttons slot="start"><ion-back-button default-href="/home" text="" /></ion-buttons>
      <ion-title>Sobre</ion-title>
    </ion-toolbar></ion-header>
    <ion-content :fullscreen="true">
      <main class="about-shell">
        <ion-note v-if="!isOnline" class="offline-banner"><ion-icon :icon="cloudOfflineOutline" /> Sem internet no momento</ion-note>

        <section class="about-hero">
          <div class="app-mark"><span></span><ion-icon :icon="imagesOutline" /></div>
          <p class="eyebrow">SEU ESPAÇO DE MEMÓRIAS</p><h1>memórias</h1><p class="version">Versão {{ version }}</p>
          <p class="description">Feito para guardar momentos importantes de um jeito simples, bonito e pessoal.</p>
        </section>

        <section class="status-grid">
          <article class="status-card">
            <div class="card-title"><span class="item-icon green"><ion-icon :icon="locationOutline" /></span><div><p class="section-label">LOCALIZAÇÃO</p><h2>Sua posição atual</h2></div></div>
            <div class="coords">
              <div><span>Latitude</span><strong>{{ formatCoordinate(location?.latitude) }}</strong></div>
              <div><span>Longitude</span><strong>{{ formatCoordinate(location?.longitude) }}</strong></div>
              <div><span>Altitude</span><strong>{{ formatAltitude(location?.altitude) }}</strong></div>
            </div>
            <p v-if="locationError" class="helper error">{{ locationError }}</p>
            <p v-else class="helper">A localização aparece após a permissão do Android.</p>
            <ion-button fill="outline" shape="round" :disabled="loadingLocation" @click="loadLocation">
              <ion-icon slot="start" :icon="navigateOutline" />{{ loadingLocation ? 'Buscando...' : 'Atualizar localização' }}
            </ion-button>
          </article>

          <article class="status-card compact">
            <div class="card-title"><span class="item-icon blue"><ion-icon :icon="wifiOutline" /></span><div><p class="section-label">CONEXÃO</p><h2>{{ networkLabel }}</h2></div></div>
            <p class="helper">{{ isOnline ? 'O app está com acesso à rede.' : 'O app detectou que você está offline.' }}</p>
          </article>
        </section>

        <section class="privacy-card">
          <div class="privacy-icon"><ion-icon :icon="phonePortraitOutline" /></div>
          <div><strong>Seus dados ficam com você</strong><p>Fotos e dados de acesso permanecem localmente neste dispositivo.</p></div>
          <ion-icon class="check" :icon="checkmarkCircle" />
        </section>

        <section class="links">
          <p class="section-label">INFORMAÇÕES</p>
          <ion-list lines="none">
            <ion-item>
              <span class="item-icon purple" slot="start"><ion-icon :icon="moonOutline" /></span>
              <ion-label><h2>Dark mode</h2><p>Tema escuro salvo no Preferences</p></ion-label>
              <ion-toggle slot="end" :checked="darkMode" aria-label="Alternar dark mode" @ion-change="onThemeChange" />
            </ion-item>
            <ion-item button detail @click="openTerms=true"><span class="item-icon purple" slot="start"><ion-icon :icon="documentTextOutline" /></span><ion-label><h2>Termos de uso</h2><p>Condições para utilizar o aplicativo</p></ion-label></ion-item>
            <ion-item button detail @click="openPrivacy=true"><span class="item-icon pink" slot="start"><ion-icon :icon="shieldCheckmarkOutline" /></span><ion-label><h2>Política de privacidade</h2><p>Entenda como cuidamos dos seus dados</p></ion-label></ion-item>
            <ion-item><span class="item-icon orange" slot="start"><ion-icon :icon="codeSlashOutline" /></span><ion-label><h2>Tecnologias</h2><p>Ionic · Vue · TypeScript · Capacitor</p></ion-label></ion-item>
          </ion-list>
        </section>
        <footer><span class="brand-dot"></span><p>Projeto acadêmico feito com cuidado.</p></footer>
      </main>

      <ion-modal :is-open="openTerms" class="document-modal" @did-dismiss="openTerms=false">
        <ion-header class="ion-no-border"><ion-toolbar><ion-title>Termos de uso</ion-title><ion-buttons slot="end"><ion-button @click="openTerms=false">Concluir</ion-button></ion-buttons></ion-toolbar></ion-header>
        <ion-content><article class="document"><div class="document-icon"><ion-icon :icon="documentTextOutline" /></div><p class="updated">ÚLTIMA ATUALIZAÇÃO · SETEMBRO DE 2026</p><h1>Termos de uso</h1><h2>1. Sobre o aplicativo</h2><p>O Memórias é um projeto acadêmico destinado ao armazenamento local de imagens escolhidas pelo usuário.</p><h2>2. Responsabilidades</h2><p>Você é responsável pelas imagens adicionadas e deve respeitar direitos autorais, privacidade e a legislação aplicável.</p><h2>3. Armazenamento</h2><p>Não há garantia de backup. Remover os dados ou desinstalar o aplicativo poderá apagar contas e fotos salvas.</p><h2>4. Disponibilidade</h2><p>Por se tratar de um protótipo acadêmico, as funcionalidades podem ser alteradas ou descontinuadas.</p></article></ion-content>
      </ion-modal>
      <ion-modal :is-open="openPrivacy" class="document-modal" @did-dismiss="openPrivacy=false">
        <ion-header class="ion-no-border"><ion-toolbar><ion-title>Privacidade</ion-title><ion-buttons slot="end"><ion-button @click="openPrivacy=false">Concluir</ion-button></ion-buttons></ion-toolbar></ion-header>
        <ion-content><article class="document"><div class="document-icon privacy"><ion-icon :icon="shieldCheckmarkOutline" /></div><p class="updated">PRIVACIDADE EM PRIMEIRO LUGAR</p><h1>Política de privacidade</h1><h2>Dados armazenados</h2><p>Nome, e-mail, senha e imagens são usados somente para oferecer as funções deste protótipo e ficam no armazenamento local do aparelho.</p><h2>Permissões</h2><p>O acesso à câmera, galeria e localização ocorre apenas após sua ação e depende da permissão do sistema Android. Você pode revogá-la nos ajustes do aparelho.</p><h2>Compartilhamento</h2><p>O aplicativo só compartilha uma foto quando você toca no botão de compartilhar e escolhe outro aplicativo.</p><h2>Exclusão</h2><p>Você pode remover fotos individualmente. A limpeza dos dados do aplicativo remove todo o conteúdo local.</p></article></ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { App } from '@capacitor/app';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { IonBackButton,IonButton,IonButtons,IonContent,IonHeader,IonIcon,IonItem,IonLabel,IonList,IonModal,IonNote,IonPage,IonTitle,IonToggle,IonToolbar } from '@ionic/vue';
import { checkmarkCircle,cloudOfflineOutline,codeSlashOutline,documentTextOutline,imagesOutline,locationOutline,moonOutline,navigateOutline,phonePortraitOutline,shieldCheckmarkOutline,wifiOutline } from 'ionicons/icons';
import { loadSavedDarkTheme, saveDarkTheme } from '@/services/theme';

const openTerms=ref(false);const openPrivacy=ref(false);const version=ref('1.0.0');
const darkMode=ref(false);const isOnline=ref(true);const connectionType=ref('unknown');
const loadingLocation=ref(false);const locationError=ref('');
const location=ref<{latitude:number;longitude:number;altitude:number|null}|null>(null);
let networkListener: PluginListenerHandle | undefined;

const networkLabel=computed(()=>isOnline.value?`Online (${connectionType.value})`:'Offline');

onMounted(async()=>{
  darkMode.value=await loadSavedDarkTheme();
  if(Capacitor.isNativePlatform()){try{version.value=(await App.getInfo()).version;}catch{/* usa a versão padrão */}}
  await loadNetworkStatus();
  networkListener=await Network.addListener('networkStatusChange',(status)=>{isOnline.value=status.connected;connectionType.value=status.connectionType;});
  await loadLocation();
});
onBeforeUnmount(()=>{void networkListener?.remove();});

async function loadNetworkStatus(){const status=await Network.getStatus();isOnline.value=status.connected;connectionType.value=status.connectionType;}
async function onThemeChange(event: CustomEvent){const enabled=Boolean(event.detail.checked);darkMode.value=enabled;await saveDarkTheme(enabled);}
async function loadLocation(){
  try{
    loadingLocation.value=true;locationError.value='';
    if(Capacitor.isNativePlatform()){
      const permission=await Geolocation.requestPermissions();
      if(permission.location!=='granted'){locationError.value='Permita a localização para exibir latitude, longitude e altitude.';return;}
    }
    const position=await Geolocation.getCurrentPosition({enableHighAccuracy:true,timeout:12000});
    location.value={latitude:position.coords.latitude,longitude:position.coords.longitude,altitude:position.coords.altitude};
  }catch{locationError.value='Não foi possível obter a localização agora.';}
  finally{loadingLocation.value=false;}
}
function formatCoordinate(value:number|undefined){return typeof value==='number'?value.toFixed(6):'--';}
function formatAltitude(value:number|null|undefined){return typeof value==='number'?`${value.toFixed(1)} m`:'Não disponível';}
</script>
<style scoped>
.about-shell{max-width:760px;margin:auto;padding:12px 18px 45px}.offline-banner{display:flex;align-items:center;justify-content:center;gap:8px;margin:8px 0 4px;padding:11px 14px;border-radius:16px;background:rgba(220,53,69,.12);color:#cf2939;font-weight:800}.about-hero{padding:34px 18px 28px;text-align:center}.app-mark{position:relative;display:grid;place-items:center;width:94px;height:94px;margin:0 auto 24px;border-radius:30px;background:linear-gradient(145deg,#4d2ec4,#845eff 62%,#d066d3);color:#fff;font-size:3rem;box-shadow:0 18px 36px rgba(var(--ion-color-primary-rgb),.3)}.app-mark span{position:absolute;inset:7px;border:1px solid rgba(255,255,255,.22);border-radius:24px}.eyebrow,.section-label,.updated{margin:0 0 7px;color:var(--ion-color-primary);font-size:.64rem;font-weight:900;letter-spacing:.16em}.about-hero h1{margin:0;font-size:2.1rem;font-weight:900;letter-spacing:-.05em}.version{margin:5px 0 18px;color:var(--ion-color-medium);font-size:.75rem}.description{max-width:390px;margin:auto;color:var(--ion-color-medium);font-size:.9rem;line-height:1.55}.status-grid{display:grid;gap:14px;margin-bottom:18px}.status-card{padding:17px;border-radius:22px;background:var(--ion-card-background,#fff);box-shadow:0 8px 28px rgba(30,22,52,.06)}.card-title{display:flex;align-items:center;gap:12px;margin-bottom:14px}.card-title h2{margin:0;font-size:.98rem;font-weight:800}.coords{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:14px}.coords div{padding:11px 8px;border-radius:14px;background:rgba(var(--ion-color-primary-rgb),.07);min-width:0}.coords span{display:block;margin-bottom:5px;color:var(--ion-color-medium);font-size:.62rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.coords strong{font-size:.78rem;word-break:break-word}.helper{margin:0 0 14px;color:var(--ion-color-medium);font-size:.76rem;line-height:1.45}.helper.error{color:#cf2939}.privacy-card{display:flex;align-items:center;gap:14px;margin-bottom:28px;padding:17px;border:1px solid rgba(var(--ion-color-primary-rgb),.14);border-radius:20px;background:rgba(var(--ion-color-primary-rgb),.07)}.privacy-icon,.item-icon{display:grid;place-items:center;flex:0 0 auto;width:42px;height:42px;border-radius:14px;background:var(--ion-color-primary);color:#fff;font-size:1.25rem}.privacy-card div:nth-child(2){flex:1}.privacy-card strong{font-size:.88rem}.privacy-card p{margin:3px 0 0;color:var(--ion-color-medium);font-size:.72rem;line-height:1.4}.privacy-card .check{color:var(--ion-color-success);font-size:1.35rem}.section-label{margin-left:8px;color:var(--ion-color-medium)}.links ion-list{overflow:hidden;padding:4px;border-radius:22px;background:var(--ion-card-background,#fff);box-shadow:0 8px 28px rgba(30,22,52,.06)}.links ion-item{--min-height:72px;--padding-start:12px;--inner-padding-end:10px;--background:transparent}.item-icon{width:40px;height:40px}.item-icon.pink{background:#ee5a9e}.item-icon.orange{background:#ee8b42}.item-icon.green{background:#24a36a}.item-icon.blue{background:#2f80ed}.links h2{font-size:.9rem;font-weight:750}.links p{font-size:.7rem}footer{display:flex;align-items:center;justify-content:center;gap:8px;padding:34px 0 0;color:var(--ion-color-medium);font-size:.72rem}.brand-dot{width:8px;height:8px;border-radius:3px;background:var(--ion-color-secondary)}.document{max-width:620px;margin:auto;padding:36px 24px 60px}.document-icon{display:grid;place-items:center;width:58px;height:58px;margin-bottom:22px;border-radius:18px;background:rgba(var(--ion-color-primary-rgb),.1);color:var(--ion-color-primary);font-size:1.7rem}.document-icon.privacy{color:#d53b86;background:rgba(230,83,156,.1)}.document .updated{color:var(--ion-color-medium)}.document h1{margin:0 0 32px;font-size:2rem;font-weight:850;letter-spacing:-.04em}.document h2{margin:25px 0 7px;font-size:1rem}.document p{color:var(--ion-color-medium);font-size:.9rem;line-height:1.65}:global(.ion-palette-dark) .privacy-card{background:rgba(var(--ion-color-primary-rgb),.12)}@media(min-width:680px){.status-grid{grid-template-columns:1.5fr 1fr}.status-card.compact{display:flex;flex-direction:column;justify-content:center}}@media(max-width:520px){.coords{grid-template-columns:1fr}}
</style>
