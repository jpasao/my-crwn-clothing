import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMf_iXz4s1fmI2fofqH5z97MNvpa_HAZs",
    authDomain: "crw-clothing-db-89d6d.firebaseapp.com",
    projectId: "crw-clothing-db-89d6d",
    storageBucket: "crw-clothing-db-89d6d.appspot.com",
    messagingSenderId: "365053237181",
    appId: "1:365053237181:web:b82491c099875fc7bee4d4"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
      prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

  export const db = getFirestore();

  export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
      if (!userAuth) return;

      const userDocRef = doc(db, 'users', userAuth.uid);

      console.log(userDocRef);

      const userSnapshot = await getDoc(userDocRef);
      console.log(userSnapshot);
      console.log(userSnapshot.exists());

      // user data not exists...
      if (!userSnapshot.exists()){
          const {displayName, email} = userAuth;
          const createdAt = new Date();

          try {
              await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
              });
          } catch (error) {
              console.log('error creating the user', error.message);
          }
      }

      return userDocRef;
  };

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
  };

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
  };