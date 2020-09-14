import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgJhYNg9MmiloEZkEXkdQ7rU1y81mObWc",
  authDomain: "thebesttodoapp.firebaseapp.com",
  databaseURL: "https://thebesttodoapp.firebaseio.com",
  projectId: "thebesttodoapp",
  storageBucket: "thebesttodoapp.appspot.com",
  messagingSenderId: "37191938830",
  appId: "1:37191938830:web:0a2399b628dfc3bfa81d5f",
  measurementId: "G-DQ891XCBVR",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }
  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
        console.log(user.uid);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];

      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });

      callback(lists);
    });
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;
