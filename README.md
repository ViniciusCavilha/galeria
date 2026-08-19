# Memórias — Galeria de Fotos

Aplicativo mobile desenvolvido com Ionic, Vue 3, TypeScript e Capacitor. Permite criar uma conta local, entrar, fotografar ou selecionar imagens do aparelho e organizá-las em uma galeria pessoal.

## Identificação acadêmica

- **Aluno:** Vinicius Souza
- **Curso:** _preencher com o nome do curso_
- **Unidade curricular:** _preencher com o nome da unidade curricular_

> Antes da entrega, substitua os dois campos acima pelos dados oficiais.

## Funcionalidades

- Cadastro e login com validação e Home protegida;
- Câmera e seleção de até 10 fotos da galeria por vez;
- Mosaico responsivo, preview em tela cheia, data, confirmação de exclusão e persistência por usuário;
- Redimensionamento e compressão automática das imagens antes de salvar;
- Tela Sobre com versão nativa, termos de uso e privacidade;
- Solicitação nativa de permissões no Android.

## Como rodar no navegador

Pré-requisitos: Node.js 20 ou superior e npm.

```bash
npm install
npm run dev
```

## Como rodar no Android Studio

Pré-requisitos: Android Studio, Android SDK e Java 21.

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

No Android Studio, aguarde o Gradle, escolha um emulador ou aparelho e clique em **Run**. Para testar a câmera completamente, prefira um aparelho físico. Após mudanças web, rode novamente `npm run build` e `npx cap sync android`.

## Permissões

O plugin `@capacitor/camera` usa APIs nativas. A câmera é solicitada no primeiro uso de **Tirar foto**; o acesso às imagens é mediado pelo seletor do sistema. Permissões podem ser revogadas nos ajustes do Android.

## Armazenamento e segurança

Este é um protótipo acadêmico offline: cadastro, sessão e imagens ficam no `localStorage` do WebView, sem servidor ou backup. Em produção, senhas devem ser autenticadas por backend seguro e fotos devem usar armazenamento apropriado.

## Scripts

- `npm run dev`: desenvolvimento;
- `npm run build`: checagem de tipos e build;
- `npm run test:unit -- --run`: testes unitários;
- `npm run lint`: lint.

## Estrutura

```text
src/
├── services/auth.ts
├── services/gallery.ts
├── views/LoginPage.vue
├── views/RegisterPage.vue
├── views/HomePage.vue
├── views/AboutPage.vue
├── router/index.ts
└── resources/icon.png  # ícone-fonte do aplicativo
```

## Entrega no GitHub

```bash
git add .
git commit -m "feat: implementa aplicativo de galeria"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/galeria.git
git push -u origin main
```

Inclua o link público do repositório no ambiente de entrega da disciplina.
