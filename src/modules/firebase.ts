import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import { FirebaseCollections } from "../sharedTypes";
import * as log4js from "log4js";

const logger = log4js.getLogger(`firebase`);

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

export const initFirebase = () => firebase.initializeApp(config);

export const signInToFirebase = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

export const signOutOfFirebase = () => firebase.auth().signOut();

export const listenForFirebaseAuthStateChange = (handler: (user: firebase.User | null) => any) =>
  firebase.auth().onAuthStateChanged(handler);

export const listenForFirebaseSnapshots = <T extends keyof FirebaseCollections>(
  collection: T,
  handler: (cube: FirebaseCollections[T] | undefined) => any
) => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) throw new Error(`user must be authenticated`);
  firebase
    .firestore()
    .collection(collection)
    .doc(currentUser.uid)
    .onSnapshot((x) => handler(x.data() as any));
};

export const setFirebaseState = <T extends keyof FirebaseCollections>(
  collection: T,
  state: FirebaseCollections[T]
) => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) throw new Error(`user must be authenticated`);
  return firebase.firestore().collection(collection).doc(currentUser.uid).set(state);
};

export const updateFirebaseState = <T extends keyof FirebaseCollections>(
  collection: T,
  partial: Partial<FirebaseCollections[T]>
) => {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) throw new Error(`user must be authenticated`);
  return firebase.firestore().collection(collection).doc(currentUser.uid).update(partial);
};

// Borrowed from: https://firebase.google.com/docs/firestore/solutions/presence
export const startReportingPresenceToFirebase = () => {
  logger.debug(`starting to report presenese`);

  const currentUser = firebase.auth().currentUser;
  if (!currentUser) throw new Error(`user must be authenticated`);

  // Fetch the current user's ID from Firebase Authentication.
  var uid = currentUser.uid;

  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);

  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    status: "offline",
    statusChangedAt: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    status: "online",
    statusChangedAt: firebase.database.ServerValue.TIMESTAMP,
  };

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  firebase
    .database()
    .ref(".info/connected")
    .on("value", function (snapshot) {
      logger.debug(`database connected`, snapshot.val());

      // If we're not currently connected, don't do anything.
      if (snapshot.val() == false) {
        return;
      }

      // If we are currently connected, then use the 'onDisconnect()'
      // method to add a set which will only trigger once this
      // client has disconnected by closing the app,
      // losing internet, or any other means.
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(function () {
          // The promise returned from .onDisconnect().set() will
          // resolve as soon as the server acknowledges the onDisconnect()
          // request, NOT once we've actually disconnected:
          // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

          logger.debug(`fully online`);

          // We can now safely set ourselves as 'online' knowing that the
          // server will mark us as offline once we lose connection.
          userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });
};
