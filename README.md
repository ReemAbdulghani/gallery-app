Gallery App

A simple gallery web app where users can sign up, log in, create albums, upload photos, and set albums as public or private.

## Test Account
You can log in using this seeded user account:
- **Email:** user@example.com  
- **Password:** user1234$

## Tech choice
Firebase is chosen over supabase because of the Storage service which is more reliable, fast solution for handling user-uploaded images—perfect for a gallery app that depends on smooth uploads and secure file access.

Beside firebase, I used Vue with js and tailwind 
## Project Setup

Clone the repository:

```sh
git clone https://github.com/ReemAbdulghani/gallery-app.git
```
```sh
cd gallery-app
```

Install dependencies

```sh
npm install
```
Run for development

```sh
npm run dev
```
Run for productio

```sh
npm run build
```

## Environment Variables

Create a .env (or .env.local) file in the project root and add the following:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment to Vercel
1- Push your project to a Git repository (GitHub/GitLab/Bitbucket).

2- Go to Vercel and import your repository.

3- Add the same Firebase environment variables in Vercel project settings.

4- Deploy the project – Vercel will handle build and hosting automatically.

## Schema 
```text
/users
  └─ {userId}
       ├─ name: string
       ├─ email: string
       └─ createdAt: timestamp

/albums
  └─ {albumId}
       ├─ title: string
       ├─ description: string
       ├─ ownerId: string (references {userId})
       ├─ isPublic: boolean
       ├─ photos: array of objects
       │     ├─ path: string
       │     └─ url: string
       └─ createdAt: timestamp
```

## Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /albums/{albumId} {

      function isOwner() {
        return request.auth != null &&
               request.auth.uid == resource.data.ownerId;
      }

      // READ:
      // Public albums are readable by anyone
      // Private albums → only owner
      allow read: if resource.data.isPublic == true
                  || isOwner();

      // CREATE:
      // Only authenticated users can create
      // And ownerId must match auth user
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.ownerId;

      // UPDATE + DELETE
      // Only owner may edit or delete
      allow update, delete: if isOwner();
    }
  }
}

```
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    match /albums/{albumId}/{filename} {
      // Helper to check if the user is the owner based on file metadata
      function isOwner() {
        return request.auth != null && 
               request.auth.uid == resource.metadata.ownerId;
      }

      // Helper to check if file is marked as public in metadata
      function isPublic() {
        return resource.metadata.isPublic == 'true';
      }

      // Allow read if public OR if the user is the owner
      allow read: if isPublic() || isOwner();

      // Allow write (upload) if the user provides their own UID as ownerId 
      // and they are authenticated.
      allow write: if request.auth != null && 
                   request.resource.metadata.ownerId == request.auth.uid;
    
    	// DELETE
      // Allow delete only for the owner of the photo
    	allow delete: if isOwner();
    
    }
  }
}

```
