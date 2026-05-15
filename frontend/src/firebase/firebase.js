// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALuQPfYZVRrvjyaJN0DRBs9Qawnep_d84",
  authDomain: "job-portal-web-564ba.firebaseapp.com",
  projectId: "job-portal-web-564ba",
  storageBucket: "job-portal-web-564ba.firebasestorage.app",
  messagingSenderId: "1043378748013",
  appId: "1:1043378748013:web:1053991cb6b004afda9d64",
  measurementId: "G-02R3QQ9RJB"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);