import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    NextOrObserver,
    User 
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection,
    writeBatch,
    query,
    getDocs,
    QueryDocumentSnapshot 
} from 'firebase/firestore';

import { Category } from '../../store/categories/category.types';

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

  export type ObjectToAdd = {
    title: string;
  };

  export const addCollectionAndDocuments = async<T extends ObjectToAdd> (
    collectionKey: string, 
    objectsToAdd: T[]
  ): Promise<void> => {
      const collectionRef = collection(db, collectionKey);
      const batch = writeBatch(db);

      objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);        
      });

      await batch.commit();
      console.log('done');
  };

  export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (docSnapshot) => docSnapshot.data() as Category
    );
  };

  export type AdditionalInformation = {
    displayName?: string;
  }

  export type UserData = {
    email: string;
    createdAt: Date;
    displayName: string;
  };

  export const createUserDocumentFromAuth = async (
    userAuth: User, 
    additionalInformation = {} as AdditionalInformation
  ): Promise<void | QueryDocumentSnapshot<UserData>> => {
      if (!userAuth) return;

      const userDocRef = doc(db, 'users', userAuth.uid);

      const userSnapshot = await getDoc(userDocRef);

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
              console.log('error creating the user', error);
          }
      }

      return userSnapshot as QueryDocumentSnapshot<UserData>;
  };

  export const createAuthUserWithEmailAndPassword = async (
    email: string, 
    password: string
  ) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
  };

  export const signInAuthUserWithEmailAndPassword = async (
    email: string, 
    password: string
  ) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
  };

  export const signOutUser = async () => await signOut(auth);

  export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => 
    onAuthStateChanged(auth, callback);

  export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      const unsuscribe = onAuthStateChanged(
        auth,
        (userAuth) => {
          unsuscribe();
          resolve(userAuth);
        },
        reject
      );
    });
  };