// src/firebaseErrors.js

export const mapFirebaseError = (error) => {
    const messages = {
        //login errors
        'auth/invalid-credential': 'Incorrect email or password. Please try again.',
        'auth/user-not-found': 'No user found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/user-disabled': 'This user account has been disabled.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        
        // sign up errors
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',

        // Firestore
        'permission-denied': "You don't have permission to perform this action.",
        'not-found': "We couldn't find that record.",
        'unavailable': "The database is temporarily offline.",
        'deadline-exceeded': "The request took too long. Please try again.",

        // Storage
        'storage/unauthorized': "You aren't authorized to manage this file.",
        'storage/object-not-found': "That file doesn't exist.",
        'storage/quota-exceeded': "We've run out of storage space!",
        'storage/unknown': "An unexpected error occurred during the upload.",  
        'storage/invalid-checksum': "The file was corrupted during upload. Please try again.",
        // General
        'auth/network-request-failed': "Please check your internet connection.",
        'default': "An unexpected error occurred. Please try again.",
    }

    return messages[error?.code] || messages['default'];
};
