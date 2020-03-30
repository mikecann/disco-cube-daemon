import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import { CubeState } from "./cube";

const config = {
  apiKey: "AIzaSyCNZOxJQX8x5-z2iWyMLCkKZ6sQjkaGZR8",
  authDomain: "disco-cube.firebaseapp.com",
  databaseURL: "https://disco-cube.firebaseio.com",
  projectId: "disco-cube",
  storageBucket: "disco-cube.appspot.com",
  messagingSenderId: "239577858848",
  appId: "1:239577858848:web:f84d626c0604a452698d45",
  measurementId: "G-D9SX9GEWJY",
};

export const initFirebase = () => {
  firebase.initializeApp(config);
  firebase.analytics();
};

const defaultUserEmail = `mike.cann@gmail.com`;

export const signInToFirebase = (password: string) =>
  firebase.auth().signInWithEmailAndPassword(defaultUserEmail, password);

export const signOutOfFirebase = () => firebase.auth().signOut();

export const listenForFirebaseAuthStateChange = (handler: (user: firebase.User | null) => any) =>
  firebase.auth().onAuthStateChanged(handler);

export const listenForCubeSnapshots = (handler: (cube: CubeState | undefined) => any) =>
  firebase
    .firestore()
    .collection("cubes")
    .doc("0")
    .onSnapshot((x) => handler(x.data() as any));
