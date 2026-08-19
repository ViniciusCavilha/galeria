<template>
  <ion-page><ion-content :fullscreen="true">
    <main class="auth-shell register-shell">
      <section class="brand-panel">
        <div class="brand-top"><span class="brand-dot"></span><strong>memórias</strong></div>
        <div class="brand-copy"><p class="eyebrow">SEU ESPAÇO PESSOAL</p><h1>Uma conta.<br><span>Mil histórias.</span></h1><p>Crie seu acesso e comece agora a sua coleção de momentos.</p></div>
        <div class="visual-stack compact-stack" aria-hidden="true"><span></span><span><ion-icon :icon="sparklesOutline" /></span></div>
      </section>
      <section class="form-panel">
        <form class="auth-card" @submit.prevent="submit">
          <div class="form-heading"><p class="eyebrow">COMECE AGORA</p><h2>Crie sua conta</h2><p>É rápido e seus dados ficam neste aparelho.</p></div>
          <div class="fields">
            <ion-input v-model="name" label="Nome completo" label-placement="stacked" autocomplete="name" fill="outline" placeholder="Como podemos chamar você?" required><ion-icon slot="start" :icon="personOutline" /></ion-input>
            <ion-input v-model="email" label="E-mail" label-placement="stacked" type="email" autocomplete="email" fill="outline" placeholder="voce@exemplo.com" required><ion-icon slot="start" :icon="mailOutline" /></ion-input>
            <ion-input v-model="password" label="Senha" label-placement="stacked" type="password" autocomplete="new-password" :minlength="6" fill="outline" placeholder="Mínimo de 6 caracteres" required><ion-icon slot="start" :icon="lockClosedOutline" /><ion-input-password-toggle slot="end" /></ion-input>
            <div class="strength" :class="strengthClass"><span><i></i></span><small>{{ strengthLabel }}</small></div>
            <ion-input v-model="confirmation" label="Confirmar senha" label-placement="stacked" type="password" autocomplete="new-password" :minlength="6" fill="outline" placeholder="Digite a senha novamente" required><ion-icon slot="start" :icon="shieldCheckmarkOutline" /><ion-input-password-toggle slot="end" /></ion-input>
          </div>
          <div v-if="error" class="form-error" role="alert"><ion-icon :icon="alertCircleOutline" />{{ error }}</div>
          <ion-button type="submit" expand="block" size="large">Criar minha conta<ion-icon slot="end" :icon="arrowForwardOutline" /></ion-button>
          <p class="switch">Já tem uma conta? <router-link to="/login">Entrar agora</router-link></p>
        </form>
        <p class="legal">Este é um protótipo acadêmico. Seus dados permanecem armazenados localmente.</p>
      </section>
    </main>
  </ion-content></ion-page>
</template>
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';import { useRouter } from 'vue-router';
import { IonButton,IonContent,IonIcon,IonInput,IonInputPasswordToggle,IonPage } from '@ionic/vue';
import { alertCircleOutline,arrowForwardOutline,lockClosedOutline,mailOutline,personOutline,shieldCheckmarkOutline,sparklesOutline } from 'ionicons/icons';
import { register } from '@/services/auth';
const router=useRouter();const name=ref('');const email=ref('');const password=ref('');const confirmation=ref('');const error=ref('');
const strengthClass=computed(()=>password.value.length>=10?'strong':password.value.length>=6?'medium':'weak');
const strengthLabel=computed(()=>!password.value?'Digite uma senha':password.value.length>=10?'Senha forte':password.value.length>=6?'Senha válida':'Muito curta');
async function submit(){error.value='';if(password.value!==confirmation.value){error.value='As duas senhas não coincidem.';return;}error.value=register({name:name.value,email:email.value,password:password.value})??'';if(error.value)return;await nextTick();await router.replace('/home');}
</script>
<style scoped src="../theme/auth.css"></style>
