import { ref } from "vue";
import { storage, db } from "@/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { mapFirebaseError } from "@/firebaseErrors";

export function usePhotos(albumId) {
  const error = ref();
  const uploadedUrls = ref([]);

  const uploadPhotos = async (files, ownerId, isPublic) => {
    error.value = null;
    uploadedUrls.value = [];
    
    const photosErrors = ref([]);
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
        photosErrors.value.push(`${file.name} failed: ${mapFirebaseError(e)}`);
      }
    }
    if (photosErrors.value.length) {
      error.value = photosErrors.value.join("\n ");
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
      console.error("Delete failed:", mapFirebaseError(e));
    }
  };

  return { error, uploadedUrls, uploadPhotos, deletePhoto };
}
