import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, push, set } from "firebase/database"

// NOTE:  In this code you can view data from database in real time
// All the data are visible from the terminal

const appSettings = {
  apiKey: "AIzaSyAZ4ObxdjWDiWiIAxfxeAX0ngS8EpUbRmo",
  authDomain: "embeddedapp-4a298.firebaseapp.com",
  databaseURL: "https://embeddedapp-4a298-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "embeddedapp-4a298",
  storageBucket: "embeddedapp-4a298.appspot.com",
  messagingSenderId: "1099490719946",
  appId: "1:1099490719946:web:faf269c25acff6b0615c33",
  measurementId: "G-K1DXHS1F4Q"
};
const app = initializeApp(appSettings)
const database = getDatabase(app)
const booksInDB = ref(database, "books")
const dataInDB = ref(database, "books")
const passwordRef = ref(database, "Password");
const connectionRef = ref(database, "connection/Connection");

onValue(booksInDB, function (snapshot) {
  if (snapshot.exists()) {
    let booksArray = Object.values(snapshot.val())//From Object to an Array
    let booksIDArray = Object.entries(snapshot.val())// entries: Both: ID and Name
    //console.log(booksArray)
    //console.log(booksIDArray)//Shoe Also ID
    for (let i = 0; i < booksArray.length; i++) {
      let currentBook = booksArray[i];
      //let booksIDArray = Object.entries(snapshot.val())// entries: Both: ID and Name
      //console.log(currentBook)//show on screen
    }
  } else {
    console.log("Vuoto")
  }
})


onValue(dataInDB, function (snapshot) {
  if (snapshot.exists()) {
    let dataArray = Object.values(snapshot.val())//From Object to an Array
    let dataIDArray = Object.entries(snapshot.val())// entries: Both: ID and Name
    //console.log(booksArray)
    console.log(dataIDArray[0, 0][0, 0])//Shoe Also ID
    for (let i = 0; i < dataArray.length; i++) {
      let currentData = dataArray[i];
      //console.log(currentData)

    }
  } else {
    console.log("Vuoto")
  }
})

onValue(passwordRef, function (snapshot) {
  if (snapshot.exists()) {
    let dataArray = Object.values(snapshot.val())//From Object to an Array
    let dataIDArray = Object.entries(snapshot.val())// entries: Both: ID and Name
    //console.log(booksArray)
    //console.log(dataIDArray)//Shoe Also ID
    for (let i = 0; i < dataArray.length; i++) {
      let currentData = dataArray[i];
      //console.log(currentData)

    }
  } else {
    console.log("Vuoto")
  }
})


function handleConnectionValue(isConnected) {
  if (isConnected) {
    console.log("Connessione attiva");
    // Esegui le operazioni desiderate quando la connessione è attiva
  } else {
    console.log("Connessione inattiva");
    // Esegui le operazioni desiderate quando la connessione è inattiva
  }
}


function setConnectionValueToFalse() {
  set(connectionRef, false)
    .then(() => {
      console.log("Valore di connection impostato su false dopo 30 secondi");
    })
    .catch((error) => {
      console.log("Errore nell'impostazione del valore di connection su false:", error);
    });
}

onValue(connectionRef, function (snapshot) {
  if (snapshot.exists()) {
    const isConnected = snapshot.val();
    handleConnectionValue(isConnected);
    if (isConnected) {
      // Imposta il timeout di 30 secondi per impostare il valore di connection su false
      setTimeout(setConnectionValueToFalse, 30000);
    }
  } else {
    // Il valore di connection non esiste nel database
    console.log("Valore di connection non trovato nel database");
  }
});





