import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
      prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

  export const db = getFirestore();

  export const createUserDocumentFromAuth = async (userAuth) => {
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
                createdAt
              });
          } catch (error) {
              console.log('error creating the user', error.message);
          }
      }

      return userDocRef;
  };