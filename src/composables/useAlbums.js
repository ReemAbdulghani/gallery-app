import { ref } from "vue";
import { db, auth } from "@/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDoc,
  getDocs
} from "firebase/firestore";

export function useAlbums() {
  const error = ref();
  const loading = ref(false);

  // 👉 Get single album
  const getAlbum = async (albumId) => {
    loading.value = true;
    error.value = null;
    try {
        const albumRef = doc(db, "albums", albumId);
        const albumSnap = await getDoc(albumRef);
    
        return albumSnap.exists() ? albumSnap.data() : null;
    } catch (e) {
        error.value = e.message;    
    } finally {
        loading.value = false;  
    }   
  };

  // 👉 Get public albums only (for Home page)
  const getAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const albumsRef = collection(db, "albums");
      const q = query(albumsRef, where("isPublic", "==", true));
      const albumsSnap = await getDocs(q);

      return albumsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    } catch (e) {
      error.value = e.message;    
    } finally {
      loading.value = false;
    }
  };

  const getMyAlbums = async () => {
    loading.value = true;
    error.value = null;
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return [];
    
      const q = query(
        collection(db, "albums"),
        where("ownerId", "==", uid)
      );
    
      const albumsSnap = await getDocs(q);
      return albumsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  // 👉 Create album
  const createAlbum = async (data) => {
    loading.value = true;
    error.value = null;
    try {
        const albumRef = doc(collection(db, "albums")); // auto-id
        await setDoc(albumRef, {
          ...data,
          id: albumRef.id,
          ownerId: auth.currentUser?.uid || null,
          createdAt: Date.now(),
        });
        console.log("Album created", albumRef);
        return albumRef.id;
    } catch (e) {
        error.value = e.message;    
    } finally {
        loading.value = false;  
    } 
  };


  const updateAlbum = async (id, data) => {
    loading.value = true;
    error.value = null;
    try {
        await updateDoc(doc(db, "albums", id), data);
    } catch (e) {
        error.value = e.message;    
    }   finally { 
        loading.value = false;
    }
  };

  return { createAlbum, getAlbum, getAll, getMyAlbums, updateAlbum, loading, error };
}
