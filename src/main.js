import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

let app;

// 1. Create a function that resolves only when Firebase is ready
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Stop listening once we get the initial state
        resolve(user);
      },
      reject
    );
  });
};

// 2. Initialize the app
async function init() {
  // Wait for the first auth response from Firebase
  await getCurrentUser();

  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
  }
}

init();