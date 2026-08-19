<template>
  <ion-page>
    <ion-header class="ion-no-border"><ion-toolbar>
      <ion-buttons slot="start"><ion-back-button default-href="/home" text="" /></ion-buttons>
      <ion-title>Sobre</ion-title>
    </ion-toolbar></ion-header>
    <ion-content :fullscreen="true">
      <main class="about-shell">
        <section class="about-hero">
          <div class="app-mark"><span></span><ion-icon :icon="imagesOutline" /></div>
          <p class="eyebrow">SEU ESPAÇO DE MEMÓRIAS</p><h1>memórias</h1><p class="version">Versão {{ version }}</p>
          <p class="description">Feito para guardar momentos importantes de um jeito simples, bonito e pessoal.</p>
        </section>

        <section class="privacy-card">
          <div class="privacy-icon"><ion-icon :icon="phonePortraitOutline" /></div>
          <div><strong>Seus dados ficam com você</strong><p>Fotos e dados de acesso permanecem localmente neste dispositivo.</p></div>
          <ion-icon class="check" :icon="checkmarkCircle" />
        </section>

        <section class="links">
          <p class="section-label">INFORMAÇÕES</p>
          <ion-list lines="none">
            <ion-item button detail @click="openTerms=true"><span class="item-icon purple" slot="start"><ion-icon :icon="documentTextOutline" /></span><ion-label><h2>Termos de uso</h2><p>Condições para utilizar o aplicativo</p></ion-label></ion-item>
            <ion-item button detail @click="openPrivacy=true"><span class="item-icon pink" slot="start"><ion-icon :icon="shieldCheckmarkOutline" /></span><ion-label><h2>Política de privacidade</h2><p>Entenda como cuidamos dos seus dados</p></ion-label></ion-item>
            <ion-item><span class="item-icon orange" slot="start"><ion-icon :icon="codeSlashOutline" /></span><ion-label><h2>Tecnologias</h2><p>Ionic · Vue · TypeScript · Capacitor</p></ion-label></ion-item>
          </ion-list>
        </section>
        <footer><span class="brand-dot"></span><p>Projeto acadêmico feito com cuidado.</p></footer>
      </main>

      <ion-modal :is-open="openTerms" class="document-modal" @did-dismiss="openTerms=false">
        <ion-header class="ion-no-border"><ion-toolbar><ion-title>Termos de uso</ion-title><ion-buttons slot="end"><ion-button @click="openTerms=false">Concluir</ion-button></ion-buttons></ion-toolbar></ion-header>
        <ion-content><article class="document"><div class="document-icon"><ion-icon :icon="documentTextOutline" /></div><p class="updated">ÚLTIMA ATUALIZAÇÃO · AGOSTO DE 2026</p><h1>Termos de uso</h1><h2>1. Sobre o aplicativo</h2><p>O Memórias é um projeto acadêmico destinado ao armazenamento local de imagens escolhidas pelo usuário.</p><h2>2. Responsabilidades</h2><p>Você é responsável pelas imagens adicionadas e deve respeitar direitos autorais, privacidade e a legislação aplicável.</p><h2>3. Armazenamento</h2><p>Não há garantia de backup. Remover os dados ou desinstalar o aplicativo poderá apagar contas e fotos salvas.</p><h2>4. Disponibilidade</h2><p>Por se tratar de um protótipo acadêmico, as funcionalidades podem ser alteradas ou descontinuadas.</p></article></ion-content>
      </ion-modal>
      <ion-modal :is-open="openPrivacy" class="document-modal" @did-dismiss="openPrivacy=false">
        <ion-header class="ion-no-border"><ion-toolbar><ion-title>Privacidade</ion-title><ion-buttons slot="end"><ion-button @click="openPrivacy=false">Concluir</ion-button></ion-buttons></ion-toolbar></ion-header>
        <ion-content><article class="document"><div class="document-icon privacy"><ion-icon :icon="shieldCheckmarkOutline" /></div><p class="updated">PRIVACIDADE EM PRIMEIRO LUGAR</p><h1>Política de privacidade</h1><h2>Dados armazenados</h2><p>Nome, e-mail, senha e imagens são usados somente para oferecer as funções deste protótipo e ficam no armazenamento local do aparelho.</p><h2>Permissões</h2><p>O acesso à câmera e às fotos ocorre apenas após sua ação e depende da permissão do sistema Android. Você pode revogá-la nos ajustes do aparelho.</p><h2>Compartilhamento</h2><p>O aplicativo não envia nem compartilha seus dados com servidores ou terceiros.</p><h2>Exclusão</h2><p>Você pode remover fotos individualmente. A limpeza dos dados do aplicativo remove todo o conteúdo local.</p></article></ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { onMounted,ref } from 'vue';import { Capacitor } from '@capacitor/core';import { App } from '@capacitor/app';
import { IonBackButton,IonButton,IonButtons,IonContent,IonHeader,IonIcon,IonItem,IonLabel,IonList,IonModal,IonPage,IonTitle,IonToolbar } from '@ionic/vue';
import { checkmarkCircle,codeSlashOutline,documentTextOutline,imagesOutline,phonePortraitOutline,shieldCheckmarkOutline } from 'ionicons/icons';
const openTerms=ref(false);const openPrivacy=ref(false);const version=ref('1.0.0');
onMounted(async()=>{if(Capacitor.isNativePlatform()){try{version.value=(await App.getInfo()).version;}catch{/* usa a versão padrão */}}});
</script>
<style scoped>
.about-shell{max-width:680px;margin:auto;padding:0 18px 45px}.about-hero{padding:42px 18px 32px;text-align:center}.app-mark{position:relative;display:grid;place-items:center;width:94px;height:94px;margin:0 auto 24px;border-radius:30px;background:linear-gradient(145deg,#4d2ec4,#845eff 62%,#d066d3);color:#fff;font-size:3rem;box-shadow:0 18px 36px rgba(var(--ion-color-primary-rgb),.3)}.app-mark span{position:absolute;inset:7px;border:1px solid rgba(255,255,255,.22);border-radius:24px}.eyebrow,.section-label,.updated{margin:0 0 7px;color:var(--ion-color-primary);font-size:.64rem;font-weight:900;letter-spacing:.16em}.about-hero h1{margin:0;font-size:2.1rem;font-weight:900;letter-spacing:-.05em}.version{margin:5px 0 18px;color:var(--ion-color-medium);font-size:.75rem}.description{max-width:390px;margin:auto;color:var(--ion-color-medium);font-size:.9rem;line-height:1.55}.privacy-card{display:flex;align-items:center;gap:14px;margin-bottom:28px;padding:17px;border:1px solid rgba(var(--ion-color-primary-rgb),.14);border-radius:20px;background:rgba(var(--ion-color-primary-rgb),.07)}.privacy-icon,.item-icon{display:grid;place-items:center;flex:0 0 auto;width:42px;height:42px;border-radius:14px;background:var(--ion-color-primary);color:#fff;font-size:1.25rem}.privacy-card div:nth-child(2){flex:1}.privacy-card strong{font-size:.88rem}.privacy-card p{margin:3px 0 0;color:var(--ion-color-medium);font-size:.72rem;line-height:1.4}.privacy-card .check{color:var(--ion-color-success);font-size:1.35rem}.section-label{margin-left:8px;color:var(--ion-color-medium)}.links ion-list{overflow:hidden;padding:4px;border-radius:22px;background:var(--ion-card-background,#fff);box-shadow:0 8px 28px rgba(30,22,52,.06)}.links ion-item{--min-height:72px;--padding-start:12px;--inner-padding-end:10px;--background:transparent}.item-icon{width:40px;height:40px}.item-icon.pink{background:#ee5a9e}.item-icon.orange{background:#ee8b42}.links h2{font-size:.9rem;font-weight:750}.links p{font-size:.7rem}footer{display:flex;align-items:center;justify-content:center;gap:8px;padding:34px 0 0;color:var(--ion-color-medium);font-size:.72rem}.brand-dot{width:8px;height:8px;border-radius:3px;background:var(--ion-color-secondary)}.document{max-width:620px;margin:auto;padding:36px 24px 60px}.document-icon{display:grid;place-items:center;width:58px;height:58px;margin-bottom:22px;border-radius:18px;background:rgba(var(--ion-color-primary-rgb),.1);color:var(--ion-color-primary);font-size:1.7rem}.document-icon.privacy{color:#d53b86;background:rgba(230,83,156,.1)}.document .updated{color:var(--ion-color-medium)}.document h1{margin:0 0 32px;font-size:2rem;font-weight:850;letter-spacing:-.04em}.document h2{margin:25px 0 7px;font-size:1rem}.document p{color:var(--ion-color-medium);font-size:.9rem;line-height:1.65}@media(prefers-color-scheme:dark){.links ion-list{--ion-card-background:#1c1a22}.privacy-card{background:rgba(var(--ion-color-primary-rgb),.12)}}
</style>
