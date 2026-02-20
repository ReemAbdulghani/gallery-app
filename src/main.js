import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

let app;

// Wait until Firebase knows the auth state before mounting the app
onAuthStateChanged(auth, (user) => {
  if (!app) {
    app = createApp(App)
    app.use(router)


    app.mount('#app')
  }
});
