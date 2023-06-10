import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, push, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://embeddedapp-4a298-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const errorMessageEl = document.getElementById("error-message");


const booksInDB = ref(database, "books")
const NumberModuleInDB = ref(database, "number")
const inputFieldEl = document.getElementById("input-TestModuleField")
const addButtonEl = document.getElementById("add-TestButton")
const removeButtonEl = document.getElementById("remove-TestButton");

const booksEl = document.getElementById("TestBooks")



// Password
const InputTextFieldEl = document.getElementById("input-TextPswField")

function showTestPage() {
    document.getElementById('input-TestField').style.display = 'none';
    document.getElementById('page-test').classList.remove('hidden');
}


function checkPassword() {
    const passwordRef = ref(database, "Password");

    onValue(passwordRef, function (snapshot) {
        if (snapshot.exists()) {
            let password = Object.entries(snapshot.val())// entries: Both: ID and Name

            if (password[0][1] === InputTextFieldEl.value) {
                showTestPage();
            }
            else {
                errorMessageEl.textContent = "Wrong password. Please try again.";
            }
        }
    });
}

// Password - Event
InputTextFieldEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
});


onValue(booksInDB, function (snapshot) {
    if (snapshot.exists()) {
        let booksArray = Object.entries(snapshot.val());
        clearBooksListEl();
        for (let i = 0; i < booksArray.length; i++) {
            let currentBook = booksArray[i];
            let itemID = currentBook[0];
            let itemValue = currentBook[1].value; // Recupera il valore dall'oggetto JSON

            appendItemToBooksListEl([itemID, itemValue]);
        }
    } else {
        clearBooksListEl();
        appendItemToBooksListEl(["/", ""]); // Risolve il problema di visualizzazione
    }
});


addButtonEl.addEventListener("click", function () {
    let numericValue;

    // Promessa per ottenere il valore corrente di number dal database Firebase
    const getNumericValuePromise = new Promise((resolve) => {
        onValue(NumberModuleInDB, function (snapshot) {
            if (snapshot.exists()) {
                numericValue = snapshot.val();
            } else {
                numericValue = 0; // Valore predefinito se number non esiste nel database
            }
            resolve();
        });
    });

    // Una volta ottenuto il valore corrente di number, incrementa il valore di numericValue di 1
    getNumericValuePromise.then(() => {
        numericValue = parseInt(numericValue) + 1;

        // Aggiorna il valore di numericValue nel database Firebase
        set(NumberModuleInDB, numericValue);
    });
});

removeButtonEl.addEventListener("click", function () {
    let numericValue;

    // Promessa per ottenere il valore corrente di number dal database Firebase
    const getNumericValuePromise = new Promise((resolve) => {
        onValue(NumberModuleInDB, function (snapshot) {
            if (snapshot.exists()) {
                numericValue = snapshot.val();
            } else {
                numericValue = 0; // Valore predefinito se number non esiste nel database
            }
            resolve();
        });
    });

    // Una volta ottenuto il valore corrente di number, decrementa il valore di numericValue di 1
    getNumericValuePromise.then(() => {
        numericValue = parseInt(numericValue) - 1;

        // Assicurati che numericValue non scenda mai sotto 1
        if (numericValue < 1) {
            numericValue = 1;
        }

        // Aggiorna il valore di numericValue nel database Firebase
        set(NumberModuleInDB, numericValue);
    });
});





function appendItemToBooksListEl(item) {
    let newEl = document.createElement("li");
    let itemID = item[0];
    let itemValue = item[1];

    newEl.textContent = itemID;
    newEl.id = itemID; // Assegna l'ID all'elemento li
    booksEl.append(newEl);

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `books/${itemID}`);
        //remove(exactLocationOfItemInDB);
    });
}


function clearBooksListEl() {
    booksEl.innerHTML = " " //You can view once time item in HTML PAGE!
}

/* function showNumericKeyboard() {
    const numericInput = document.getElementById("numericInput");
    numericInput.style.display = "block";
}

const numericInput = document.getElementById("numericInput");
numericInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, ""); // Rimuove tutti i caratteri non numerici
}); */

