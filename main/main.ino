#include <WiFi.h>
#include <FirebaseESP32.h>
#include <SD_MMC.h>
#include "HardwareSerial.h"
#include <stdlib.h>

#define FIREBASE_HOST "https://embeddedapp-4a298-default-rtdb.europe-west1.firebasedatabase.app/"
#define FIREBASE_AUTH "***************************"

#define WIFI_SSID "******"
#define WIFI_PASSWORD "********"

FirebaseData fData;
FirebaseJson json;

HardwareSerial SerialPort(2);
uint8_t buffer[32];
double val2, val3, val4, val5, val6;

size_t updateTime = 0;
int moduleNumber = 1; // Start with module number 1
int numericValue = 0; // To store the value of 'number' from Firebase
bool val1 = false;
bool connection = true;
std::vector<float> val;

void setup()
{
    Serial.begin(9600); // Set baud rate
    SerialPort.begin(115200, SERIAL_8N1, 16, 17);

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    size_t start_time = millis();
    while (WiFi.status() != WL_CONNECTED)
    {
        if (millis() - start_time > 5000)
        {
            Serial.print(".");
            start_time = millis();
        }
    }
    Serial.println("Connessione");
    Serial.println();
    Serial.print("WiFi Connesso, indirizzo IP:");
    Serial.println(WiFi.localIP());
    Serial.println();

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);
    Firebase.setReadTimeout(fData, 1000 * 60);
    Firebase.setwriteSizeLimit(fData, "tiny");

    Serial.println();
    Serial.println(".....................");
    Serial.println("Done! WiFi Connesso");
    updateTime = millis();

    if (Firebase.getString(fData, "/number"))
    {
        if (fData.stringData())
        {
            String numberValue = fData.stringData();
            numericValue = numberValue.toInt();
            Serial.print("Number value: ");
            Serial.println(numericValue);
        }
    }
    else
    {
        Serial.println("Failed to get number value from Firebase");
        setup();
    }

    updateModulesInFirebase(); // Update modules Firebase
}

void loop()
{
    checkSelectedModules();
    if (moduleNumber == 1)
    {
        checkSelectedModules();
        val.clear();
        // SerialPort.read(buffer, sizeof(buffer));
        String received = SerialPort.readString();
        Serial.println(received);
        int startIndex = 1; // Skip the first character (';')
        int endIndex = received.indexOf(';', startIndex);

        while (endIndex != -1)
        {
            String valueStr = received.substring(startIndex, endIndex);
            int value = valueStr.toInt();
            val.push_back(value);
            Serial.print("Value: ");
            Serial.println(value);

            startIndex = endIndex + 1;
            endIndex = received.indexOf(';', startIndex);
            val1 = true;
            val2 = val[0];
            val3 = val[1];
            val4 = val[2];
            val5 = val[3];
            val6 = val[4];
            connection = true;
        }
        delay(100);
    }
    else
    {
        if (millis() - updateTime > 10000)
        {
            val1 = true;
            val2 = random(-7, 7);
            val3 = random(60, 100);
            val4 = random(3);
            val5 = 1 + random(0, 51) / 100.0 + random(-25, 26) / 100.0;
            val6 = random(10, 55);
            connection = true;
            checkSelectedModules();
            updateTime = millis();
        }
        UpdateModuleOne();
        checkSelectedModules();
    }

    json.clear();

    String modulePath = "books/Modulo" + String(moduleNumber);
    json.set("/ABool", val1);
    json.set("/pH", val2);
    json.set("/Umidità", val3);
    json.set("/Acqua", val4);
    json.set("/Conduttività", val5);
    json.set("/Temperatura", val6);

    Firebase.updateNode(fData, modulePath.c_str(), json);
    updateConnectionInFirebase(connection);
    checkNumberChange();
    checkSelectedModules();
}

void updateModulesInFirebase()
{
    Firebase.deleteNode(fData, "books");

    for (int moduleNumber = 1; moduleNumber <= numericValue; moduleNumber++)
    {
        if (moduleNumber == 1)
        {
            val.clear();
            SerialPort.read(buffer, sizeof(buffer));

            String received = SerialPort.readString();
            Serial.println(received);
            int startIndex = 1; // Skip the first character (';')
            int endIndex = received.indexOf(';', startIndex);

            while (endIndex != -1)
            {
                String valueStr = received.substring(startIndex, endIndex);
                int value = valueStr.toInt();
                val.push_back(value);
                Serial.print("Value: ");
                Serial.println(value);

                startIndex = endIndex + 1;
                endIndex = received.indexOf(';', startIndex);
                val1 = false;
                val2 = val[0];
                val3 = val[1];
                val4 = val[2];
                val5 = val[3];
                val6 = val[4];
                connection = true;
            }
        }
        else
        {
            val1 = false;
            val2 = random(-7, 7);
            val3 = random(60, 100);
            val4 = random(3);
            val5 = 1 + random(0, 51) / 100.0 + random(-25, 26) / 100.0;
            val6 = random(10, 55);
            connection = true;
        }

        String modulePath = "books/Modulo" + String(moduleNumber);

        json.clear();
        json.set("/ABool", val1);
        json.set("/pH", val2);
        json.set("/Umidità", val3);
        json.set("/Acqua", val4);
        json.set("/Conduttività", val5);
        json.set("/Temperatura", val6);

        Firebase.updateNode(fData, modulePath.c_str(), json);
    }

    updateConnectionInFirebase(connection);
}

void updateConnectionInFirebase(bool connection)
{
    connection = true;
    json.clear();
    json.set("/Connection", connection);

    Firebase.updateNode(fData, "connection", json);
}

void checkNumberChange()
{
    if (Firebase.getString(fData, "/number"))
    {
        if (fData.stringData())
        {
            String numberValue = fData.stringData();
            int newNumericValue = numberValue.toInt();
            if (newNumericValue != numericValue)
            {
                numericValue = newNumericValue;
                updateModulesInFirebase();
                moduleNumber = 1;
            }
        }
    }
}

void checkSelectedModules()
{
    for (int i = 1; i <= numericValue; i++)
    {
        String modulePath = "books/Modulo" + String(i) + "/ABool";

        if (Firebase.getBool(fData, modulePath.c_str()))
        {
            bool isModuleSelected = fData.boolData();

            if (isModuleSelected)
            {
                moduleNumber = i;
                checkNumberChange();

                for (int j = 1; j <= numericValue; j++)
                {
                    if (j != i)
                    {
                        String resetModulePath = "books/Modulo" + String(j) + "/ABool";
                        Firebase.setBool(fData, resetModulePath.c_str(), false);
                    }
                }
            }
        }
    }
}