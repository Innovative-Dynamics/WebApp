import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, onValue, push, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://embeddedapp-4a298-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const booksInDB = ref(database, "books")
const DataWriteInDB = ref(database, "write")
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const booksEl = document.getElementById("Tbooks")
var dataInDB = ref(database, "books")
const addButtonElPlus = document.getElementById("add-button-plus")
const decreaseButtonElPlus = document.getElementById("add-button-decrease")

const temperatureValueElement = document.getElementById("temperature-value");



onValue(booksInDB, function (snapshot) {
    if (snapshot.exists()) {
        let booksArray = Object.entries(snapshot.val());
        clearBooksListEl();
        for (let i = 0; i < booksArray.length; i++) {
            let booksIDArray = Object.entries(snapshot.val());
            let currentBook = booksIDArray[i];
            let currentBookID = currentBook[0];
            let currentBookValue = currentBook[1];

            // Append the book entry to the books element
            booksEl.appendChild(bookEntry);
        }
    }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FROM HERE -- BAR CHART!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// HERE WE WRITE DATA TO SEND Y VALUES [0] -->> NUTRIENT
var booksArray = [];

// Update booksArray whenever the data in the "books" node changes
onValue(booksInDB, function (snapshot) {
    if (snapshot.exists()) {
        booksArray = Object.entries(snapshot.val());
        clearBooksListEl();

        // Update the book entries and AAWrite nodes for each module
        booksArray.forEach(function (currentBook) {
            let currentBookID = currentBook[0];
            let currentBookValue = currentBook[1];

            // Create the book entry element
            let bookEntry = document.createElement('div');
            bookEntry.textContent = currentBookValue;

            // Append the book entry to the books element
            booksEl.appendChild(bookEntry);

            // Create AAWrite node for the current module
            const AAWriteRef = ref(database, `books/${currentBookID}/AAWrite`);

            // Set an initial value for AAWrite
            get(AAWriteRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    set(AAWriteRef, 0);
                }
            });
        });
    }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!FROM HERE -- BAR CHART!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var yValues = [0, 0, 0, 0, 0] // Initialize variables
var yChartValues = [0, 0, 0, 100];

var ctx_live = document.getElementById("myChart");
var xValues = ["Relative Humidity (%)", "Temperature (C)"]; // "pH"[0], , "Ionic Conductivity", "Water-Level"
var barColors = ["green", "yellow"];
onValue(DataWriteInDB, function (snapshot) {
    if (snapshot.exists()) {
        var dataWriteArray = Object.values(snapshot.val())//From Object to an Array
        let datasArray = Object.entries(snapshot.val());
        for (let i = 0; i < datasArray.length - 1; i++) { // Itera su tutti gli elementi tranne l'ultimo
            let currentData = datasArray[i];
            let currentDataKey = currentData[0];
            let exactLocationOfDataWrite = ref(database, `write/${currentDataKey}`);
            remove(exactLocationOfDataWrite);
        }
        //yValues[0] = dataWriteArray[datasArray.length]
        //myChart.update();
    }
});

// Increase value of Nutrient and decrease ------------->>>>  THIS IS AN EXAMPLE TO TEST CODE but we can change this behaivour

// addButtonElPlus.addEventListener("click", function () {
//     yValues[0]++;
//     yValues.push(yValues[0]);
//     let inpuTyValues = yValues[0]
//     push(DataWriteInDB, inpuTyValues)
//     myChart.update();
// });
// decreaseButtonElPlus.addEventListener("click", function () {
//     yValues[0]--;
//     yValues.push(yValues[0]);
//     let InpuTyValues = yValues[0]
//     push(DataWriteInDB, InpuTyValues)
//     myChart.update();
// });


//Input chart - MyChart
var myChart = new Chart(ctx_live, {
    type: "bar",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yChartValues
        }]
    },
    options: {
        responsive: true,
        legend: { display: false },
        title: {
            display: true,
            text: "Chart main Data"
        }
    }
});









const now = new Date(); // Ora corrente
const xLineValues = []; // Inizializza l'array delle etichette

// Genera una nuova etichetta ogni minuto e visualizza gli ultimi dieci minuti
for (let i = 0; i <= 10; i++) {
    const date = new Date(now.getTime() - (10 - i) * 60 * 1000); // Calcola la data per l'etichetta corrente
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ottiene i minuti formattati con lo zero iniziale
    const label = `${date.getHours()}:${minutes}`; // Converti in stringa l'etichetta
    xLineValues.push(label); // Aggiungi l'etichetta all'asse X del grafico
}
const yLineValues = [19, 18, 19, 20, 18, 20, 22, 22, 25, 26, 25];

const myLineChart = new Chart("myLineChart", {
    type: "line",
    data: {
        labels: xLineValues,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(0,0,255,1.0)",
            borderColor: "rgba(0,0,255,0.1)",
            data: yLineValues
        }]
    },
    options: {
        legend: { display: false },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: 60,
                    callback: function (value) {
                        return value + "°C"; // Aggiungi il simbolo °C dopo ogni valore sull'asse Y
                    }
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Ora"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Temperature (°C)"
                }
            }]
        }
    }
});


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!                  Third circle CHART                   !!!
var xCircleValues = ["Temperature", "To-Limit"];
var yCircleValues = [0, 55];

var barColors = [
    "#00aba9",
    "#b91d47",

];

var myCircleChart = new Chart("myCircleChart", {
    type: "doughnut",
    data: {
        labels: xCircleValues,
        datasets: [{
            backgroundColor: barColors,
            data: yCircleValues
        }]
    },
    options: {
        title: {
            display: true,
            text: "Max T (C) %",
            fontColor: "black"
        },
        legend: {
            labels: {
                fontColor: "black"
            }
        }
    }
});


// NOTE!!!   HERE WE GET THE VALUE FROM THE DATABASE !!!!!!!!!!!  Note ->  we start from i = 1 beause the first value is write by the users (for now)...  the positions vector in database are opposite to yValue index--> UPDATE : There's no more write's value from Users
function updateDataInDB(moduleID) {
    dataInDB = ref(database, `books/${moduleID}`);

    onValue(dataInDB, function (snapshot) {
        if (snapshot.exists()) {
            var dataArray = Object.values(snapshot.val())//From Object to an Array
            const latestYValue = dataArray[3] // IMPORTANT NOTE::: dataArray WITH INDEX 2 is Temperature
            const temperatureValue = dataArray[3];
            document.getElementById("temperature-value").textContent = temperatureValue;
            if (latestYValue !== yLineValues[yLineValues.length - 1]) { // Controlla se il valore è diverso dall'ultimo valore nel grafico
                const now = new Date();
                const latestXValue = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                xLineValues.push(latestXValue);
                yLineValues.push(latestYValue);

                if (xLineValues.length > 11) {
                    xLineValues.shift();
                    yLineValues.shift();
                }

                myLineChart.data.datasets[0].data = yLineValues;
                myLineChart.data.labels = xLineValues;
                myLineChart.update();
            }                           // LINE CHART
            yCircleValues[0] = dataArray[3];
            yCircleValues[1] = 55 - yCircleValues[0]
            myCircleChart.update();
            yChartValues[0] = dataArray[4]; // Only Temp. and Humidity in Chart !!
            yChartValues[1] = dataArray[3];
            myChart.update();
            for (let i = 0; i < dataArray.length; i++) {
                yValues[i] = dataArray[dataArray.length - i - 1] // IMPORTANT NOTE::: dataArray dim is equal to 5,                                    // yValues dim is equal to 5
            }
        } else {
            console.log("Vuoto")
        }
        document.getElementById("ph-value").textContent = yValues[0];
        document.getElementById("humidity-value").textContent = yValues[1] + " %";
        document.getElementById("photoresistance-value").textContent = yValues[3] + " mS/cm";
        document.getElementById("water-value").textContent = yValues[4];
        // BLINKING WATER !!!!!!!!!!!!!!
        const waterValueElement = document.getElementById("water-value");
        const photoresistenceValueElement = document.getElementById("photoresistance-value");
        if (yValues[4] <= 1) {
            waterValueElement.classList.add("blink");
        } else {
            waterValueElement.classList.remove("blink");
            waterValueElement.style.backgroundColor = "#fff";
            document.getElementById("input-field").placeholder = "High Water Level!";
            document.getElementById("popup-water-message").innerHTML = "High Water Level !";
            document.getElementById("popup-water").classList.add("show");
            setTimeout(function () {
                document.getElementById("popup-water").classList.remove("show");
            }, 5000);
        }

        if (yValues[3] < 1.5) {
            photoresistenceValueElement.classList.add("blink");
        } else {
            photoresistenceValueElement.classList.remove("blink");
            photoresistenceValueElement.style.backgroundColor = "#fff";
            document.getElementById("input-field").placeholder = "ADD WATER!";
            document.getElementById("popup-message").innerHTML = "Electrical Conductivity HIGH! ADD WATER";
            document.getElementById("popup").classList.add("show");
            setTimeout(function () {
                document.getElementById("popup").classList.remove("show");
            }, 5000);
        }
        if (yValues[3] < 1) {
            photoresistenceValueElement.classList.remove("blink");
            photoresistenceValueElement.style.backgroundColor = "#fff";
            document.getElementById("input-field").placeholder = "START STEPPER!";
            document.getElementById("popup-message").innerHTML = "Electrical Conductivity LOW! STEPPER START";
            document.getElementById("popup").classList.add("show");
            setTimeout(function () {
                document.getElementById("popup").classList.remove("show");
            }, 5000);
        }
    })
}


// HERE TO VIEW THE MODULE ON FIREBASE!! DO NOT TOUCH IT PLEASE
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
function appendItemToBooksListEl(item) {
    let newEl = document.createElement("li");
    let itemID = item[0];
    let itemValue = item[1];

    newEl.textContent = itemID;
    newEl.id = itemID; // Assegna l'ID all'elemento li
    booksEl.append(newEl);

    newEl.addEventListener("click", function () {
        showNumericKeyboard();
        let exactLocationOfItemInDB = ref(database, `books/${itemID}`);
        remove(exactLocationOfItemInDB);
    });
}


function clearBooksListEl() {
    booksEl.innerHTML = " " //You can view once time item in HTML PAGE!
}


// Recupera tutti gli elementi 'Tbooks'
onValue(booksInDB, function (snapshot) {
    var tBooksList = booksEl;
    var tBookItems = tBooksList.getElementsByTagName("li");

    if (snapshot.exists()) {
        let booksArray = Object.entries(snapshot.val());

        for (var i = 0; i < tBookItems.length; i++) {
            let currentBook = booksArray[i];
            let itemID = currentBook[0];

            tBookItems[i].addEventListener('click', function () {
                // Rimuovi la classe 'selected' da tutti gli elementi 'Tbooks'
                for (var j = 0; j < tBookItems.length; j++) {
                    tBookItems[j].classList.remove('selected');
                }

                // Aggiungi la classe 'selected' all'elemento 'Tbooks' selezionato
                this.classList.add('selected');

                // Imposta il valore booleano ABool di tutti i moduli su false nel database Firebase
                for (var k = 0; k < tBookItems.length; k++) {
                    var resetModulePath = `books/${booksArray[k][0]}/ABool`;
                    var resetModuleRef = ref(database, resetModulePath);
                    set(resetModuleRef, false);
                }

                // Imposta il valore booleano ABool del modulo selezionato su true nel database Firebase
                var modulePath = `books/${itemID}/ABool`;
                var moduleRef = ref(database, modulePath);
                set(moduleRef, true);

                // Update the dataInDB variable with the new module reference
                updateDataInDB(itemID);
            });

            // Verifica se il modulo corrente è selezionato e aggiungi la classe 'selected' di conseguenza
            if (currentBook[1].ABool) {
                tBookItems[i].classList.add('selected');
                // Update the dataInDB variable with the selected module reference
                updateDataInDB(itemID);
            }
            let ABoolRef = ref(database, `books/${itemID}/ABool`);
            onValue(ABoolRef, function (snapshot) {
                if (snapshot.exists() && snapshot.val()) {
                    // Update the dataInDB variable with the new module reference
                    updateDataInDB(itemID);
                }
            });
        }
    }
});










