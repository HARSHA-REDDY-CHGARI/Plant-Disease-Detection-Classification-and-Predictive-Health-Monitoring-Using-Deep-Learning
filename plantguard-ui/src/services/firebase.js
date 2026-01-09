// // src/services/firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyD-3vH0_TlZqDcMKzx5bzbnbI_QT_FIOFo",
//   authDomain: "plantgaurd-3fb32.firebaseapp.com",
//   projectId: "plantgaurd-3fb32",
//   storageBucket: "plantgaurd-3fb32.appspot.com", // corrected
//   messagingSenderId: "80034465397",
//   appId: "1:80034465397:web:20160c26364cfc9f655a3c"
// };

// const app = initializeApp(firebaseConfig);

// // Export these so other files can use them
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

///////
// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-3vH0_TlZqDcMKzx5bzbnbI_QT_FIOFo",
  authDomain: "plantgaurd-3fb32.firebaseapp.com",
  projectId: "plantgaurd-3fb32",
  storageBucket: "plantgaurd-3fb32.appspot.com",
  messagingSenderId: "80034465397",
  appId: "1:80034465397:web:20160c26364cfc9f655a3c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
