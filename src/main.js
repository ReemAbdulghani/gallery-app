import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

let app;

// this to wait for Firebase to check the auth state before rendering the app
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)

    app.mount('#app')
  }
})