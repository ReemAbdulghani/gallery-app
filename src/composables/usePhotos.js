import { ref } from "vue";
import { storage, db } from "@/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export function usePhotos(albumId) {
  const errors = ref([]);
  const uploadedUrls = ref([]);

  const uploadPhotos = async (files, ownerId, isPublic) => {
    errors.value = [];
    uploadedUrls.value = [];

    for (let file of files) {
      try {
        const path = `albums/${albumId}/${file.name}`;
        const sRef = storageRef(storage, path);

         // Upload file
        const metadata = {
          customMetadata: {
            'ownerId': ownerId,
            'isPublic': isPublic.toString() // Metadata values must be strings
          }
        };
        await uploadBytes(sRef, file, metadata);

        // Get download URL
        const url = await getDownloadURL(sRef);

        // Push to local state
        const photoData = { url, path };
        uploadedUrls.value.push(photoData);

        // Update Firestore album doc
        const albumRef = doc(db, "albums", albumId);
        await updateDoc(albumRef, {
          photos: arrayUnion(photoData),
        });

      } catch (e) {
        errors.value.push(`${file.name} failed: ${e.message}`);
      }
    }
  };

  const deletePhoto = async (photo) => {
    const sRef = storageRef(storage, photo.path);

    try {
      await deleteObject(sRef);

      await updateDoc(doc(db, "albums", albumId), {
        photos: arrayRemove(photo)
      });
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return { errors, uploadedUrls, uploadPhotos, deletePhoto };
}
