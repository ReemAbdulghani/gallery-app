import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const user = ref(null);
const iniLoading = ref(true);
const loading = ref(false);
const error = ref("");

// Watch auth state
onAuthStateChanged(auth, (u) => {
  user.value = u;
  iniLoading.value = false;
  console.log("Auth state changed:", u);
  console.log("Current user:", user.value.uid);
});

export function useAuth() {
  const signup = async (email, password, name) => {
    loading.value = true;
    error.value = "";
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email, password) => {
    error.value = "";
    loading.value = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return { user, iniLoading, loading, error, signup, login, logout };
}
