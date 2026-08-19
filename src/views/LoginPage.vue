<template>
  <ion-page><ion-content :fullscreen="true">
    <main class="auth-shell">
      <section class="brand-panel">
        <div class="brand-top"><span class="brand-dot"></span><strong>memórias</strong></div>
        <div class="brand-copy"><p class="eyebrow">SUA VIDA EM IMAGENS</p><h1>Momentos passam.<br><span>Memórias ficam.</span></h1><p>Um espaço simples e pessoal para guardar as fotos que realmente importam.</p></div>
        <div class="visual-stack" aria-hidden="true"><span></span><span></span><span><ion-icon :icon="imagesOutline" /></span></div>
      </section>
      <section class="form-panel">
        <form class="auth-card" @submit.prevent="submit">
          <div class="form-heading"><p class="eyebrow">BEM-VINDO DE VOLTA</p><h2>Entre na sua galeria</h2><p>Use os dados cadastrados neste aparelho.</p></div>
          <div class="fields">
            <ion-input v-model="email" label="E-mail" label-placement="stacked" type="email" autocomplete="email" fill="outline" placeholder="voce@exemplo.com" required><ion-icon slot="start" :icon="mailOutline" /></ion-input>
            <ion-input v-model="password" label="Senha" label-placement="stacked" type="password" autocomplete="current-password" fill="outline" placeholder="Sua senha" required><ion-icon slot="start" :icon="lockClosedOutline" /><ion-input-password-toggle slot="end" /></ion-input>
          </div>
          <div v-if="error" class="form-error" role="alert"><ion-icon :icon="alertCircleOutline" />{{ error }}</div>
          <ion-button type="submit" expand="block" size="large">Entrar<ion-icon slot="end" :icon="arrowForwardOutline" /></ion-button>
          <div class="divider"><span>ou</span></div>
          <p class="switch">Primeira vez por aqui? <router-link to="/cadastro">Criar minha conta</router-link></p>
        </form>
        <p class="legal">Ao continuar, você concorda com os termos e a política de privacidade do aplicativo.</p>
      </section>
    </main>
  </ion-content></ion-page>
</template>
<script setup lang="ts">
import { ref } from 'vue'; import { useRouter } from 'vue-router';
import { IonButton,IonContent,IonIcon,IonInput,IonInputPasswordToggle,IonPage } from '@ionic/vue';
import { alertCircleOutline,arrowForwardOutline,imagesOutline,lockClosedOutline,mailOutline } from 'ionicons/icons';
import { signIn } from '@/services/auth';
const router=useRouter();const email=ref('');const password=ref('');const error=ref('');
async function submit(){error.value='';if(!signIn(email.value,password.value)){error.value='Não encontramos uma conta com esses dados.';return;}await router.replace('/home');}
</script>
<style scoped src="../theme/auth.css"></style>
