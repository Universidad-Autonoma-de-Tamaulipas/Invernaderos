// script.js

// Hacer una solicitud GET a la API de ThingSpeak
var channelID = 2032589; // ID de canal de ThingSpeak
var apiKey = 'OLJKBLAGI2D2U06T'; // clave de API de escritura de ThingSpeak
var url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}`;


var channelID2 = 2348578; // ID de canal de ThingSpeak
var apiKey2 = '4KN8YIXSKTVC8KPC'; // clave de API de escritura de ThingSpeak
var url2 = `https://api.thingspeak.com/channels/${channelID2}/feeds.json?api_key=${apiKey2}`;

var myChart;
var myChart2;
var myChart3;
let sensor1Data; 

// Función para cargar y mostrar los datos
function fetchData1() {
    fetch(url)
        .then(response1 => response1.json())
        .then(data1 => {
            fetchData();
            sensor1Data=data1
            displayData1(sensor1Data);
            createOrUpdateChart1(sensor1Data);
            
            
        })
        .catch(error1 => {
            console1.error(error1);
        });
}

function fetchData() {
    fetch(url2)
        .then(response => response.json())
        .then(data => {
            displayData(data);
            //createOrUpdateChart(data);
            displayAverages(sensor1Data, data);
            createOrUpdateChart3(sensor1Data, data);
            createOrUpdateChart2(sensor1Data, data)
            createOrUpdateChart1(sensor1Data, data)
        })
        .catch(error => {
            console.error(error);
        });
}


function displayData(data) {
    var dataContainer1 = document.getElementById('data-container1');
    var html1 = '<h2>Sensor 1</h2>';
    if (data.feeds && data.feeds.length > 0) {
        // Obtener el último feed
        const latestFeed = data.feeds[data.feeds.length - 1];
        // Obtener la hora UTC del feed
        const utcTime = new Date(latestFeed.created_at);
        // Convertir la hora UTC a la zona horaria local (por ejemplo, México en zona centro)
        const options = { timeZone: 'America/Mexico_City' };
        // Convertir la hora local a una cadena legible
        const localTimeString = utcTime.toLocaleString('es-MX', options);
        html1 += `<p>Fecha y Hora: ${localTimeString}, Temperatura: ${latestFeed.field4} °C, Humedad: ${latestFeed.field5}%, Niveles de CO2: ${latestFeed.field6} PPM</p>`;
    } else {
        html1 += '<p>No hay datos disponibles para SENSOR 1.</p>';

    }
    dataContainer1.innerHTML = html1;
}

function displayData1(data1) {
    var dataContainer2 = document.getElementById('data-container2');
    var html2 = '<h2>Sensor 2</h2>';

    if (data1.feeds && data1.feeds.length > 0) {
        // Obtener el último feed
        const latestFeed1 = data1.feeds[data1.feeds.length - 1];
        // Obtener la hora UTC del feed
        const utcTime1 = new Date(latestFeed1.created_at);
        // Convertir la hora UTC a la zona horaria local (por ejemplo, México en zona centro)
        const options1 = { timeZone: 'America/Mexico_City' };
        // Convertir la hora local a una cadena legible
        const localTimeString1 = utcTime1.toLocaleString('es-MX', options1);
        html2 += `<p>Fecha y Hora: ${localTimeString1}, Temperatura: ${latestFeed1.field1} °C, Humedad: ${latestFeed1.field2}%, Niveles de CO2: ${latestFeed1.field3} PPM</p>`;
    } else {
        html2 += '<p>No hay datos disponibles para SENSOR 2.</p>';
    }
    dataContainer2.innerHTML = html2;
}

function displayAverages(data, data1) {
    var dataContainer3 = document.getElementById('data-container3');
    var html3 = '<h2>Sensor Virtual - Promedio</h2>';
    if (data1.feeds && data1.feeds.length > 0 && data.feeds && data.feeds.length > 0) {
        
        const latestFeed = data.feeds[data.feeds.length - 1];
        const latestFeed1 = data1.feeds[data1.feeds.length - 1];

        const valor1 = parseFloat(latestFeed.field1);
        const valor2 = parseFloat(latestFeed1.field4);
        const valor3 = parseFloat(latestFeed.field2);
        const valor4 = parseFloat(latestFeed1.field5);
        const valor5 = parseFloat(latestFeed.field3);
        const valor6 = parseFloat(latestFeed1.field6);

        // Ahora suma los valores numéricos
        const suma1 = (valor1 + valor2)/2;
        const suma2 = (valor3 + valor4)/2;
        const suma3 = (valor5 + valor6)/2;


        // Formatear la fecha y hora
        const utcTime = new Date(latestFeed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTimeString = utcTime.toLocaleString('es-MX', options);
        html3 += `<p>Fecha y Hora: ${localTimeString}, Temperatura: ${suma1} °C, Humedad: ${suma2}%, Niveles de CO2: ${suma3} PPM</p>`;

    } else {
        html3 += '<p>No hay datos disponibles para el Sensor Virtual.</p>';
    }
    dataContainer3.innerHTML = html3;
}

function createOrUpdateChart2(data, data1) {
    var ctx2 = document.getElementById('chart1').getContext('2d');

    var labels1 = data.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var labels2 = data1.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var temperatura1 = data.feeds.map(feed => parseFloat(feed.field1));
    var temperatura2 = data1.feeds.map(feed => parseFloat(feed.field4));
    var suma1 = temperatura1.map((temp, index) => (temp + temperatura2[index]) / 2);  // Calcula el promedio

    // Mantener solo los últimos 20 puntos
    if (labels1.length > 20) {
        labels1 = labels1.slice(labels1.length - 20);
        temperatura1 = temperatura1.slice(temperatura1.length - 20);
    }

    if (labels2.length > 20) {
        labels2 = labels2.slice(labels2.length - 20);
        temperatura2 = temperatura2.slice(temperatura2.length - 20);
    }

    if (suma1.length > 20) {
        suma1 = suma1.slice(suma1.length - 20);
    }

    if (!myChart2) {
        myChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels1, // Puedes usar labels1 o labels2, ya que ambos deben tener la misma longitud
                datasets: [
                    {
                        label: 'Temperatura sensor2 (°C)',
                        data: temperatura2,
                        borderColor: 'rgba(239, 127, 26, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Temperatura sensor1 (°C)',
                        data: temperatura1,
                        borderColor: 'rgba(239, 127, 26, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Temperatura Promedio (°C)',
                        data: suma1,
                        borderColor: 'rgba(0, 255, 255, 1)',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        myChart2.data.labels = labels1.concat(labels2).slice(-20);  // Usa ambas etiquetas y mantiene solo los últimos 20 puntos
        myChart2.data.datasets[0].data = temperatura1.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart2.data.datasets[1].data = temperatura2.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart2.data.datasets[2].data = suma1.slice(-20);
        myChart2.update();
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function createOrUpdateChart1(data, data1) {
    var ctx2 = document.getElementById('chart2').getContext('2d');

    var labels1 = data.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var labels2 = data1.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var humedad1 = data.feeds.map(feed => parseFloat(feed.field2));
    var humedad2 = data1.feeds.map(feed => parseFloat(feed.field5));
    var suma2 = humedad1.map((hum, index) => (hum + humedad2[index]) / 2);  // Calcula el promedio

    // Mantener solo los últimos 20 puntos
    if (labels1.length > 20) {
        labels1 = labels1.slice(labels1.length - 20);
        humedad1 = humedad1.slice(humedad1.length - 20);
    }

    if (labels2.length > 20) {
        labels2 = labels2.slice(labels2.length - 20);
        humedad2 = humedad2.slice(humedad2.length - 20);
    }

    if (suma2.length > 20) {
        suma2 = suma2.slice(suma2.length - 20);
    }

    if (!myChart) {
        myChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels1, // Puedes usar labels1 o labels2, ya que ambos deben tener la misma longitud
                datasets: [
                    {
                        label: 'Humedad sensor 2 (%)',
                        data: humedad2,
                        borderColor: 'rgba(0, 50, 200, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Humedad sensor 1 (%)',
                        data: humedad1,
                        borderColor: 'rgba(0, 50,200, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Humedad Promedio (%)',
                        data: suma2,
                        borderColor: 'rgba(0, 255, 255, 1)',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        myChart.data.labels = labels1.concat(labels2).slice(-20);  // Usa ambas etiquetas y mantiene solo los últimos 20 puntos
        myChart.data.datasets[0].data = humedad1.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart.data.datasets[1].data = humedad2.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart.data.datasets[2].data = suma2.slice(-20);
        myChart.update();
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function createOrUpdateChart3(data, data1) {
    var ctx2 = document.getElementById('chart3').getContext('2d');

    var labels1 = data.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var labels2 = data1.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return utcTime.toISOString();  // Utiliza toISOString para mantener la fecha y hora en formato ISO
    });

    var co21 = data.feeds.map(feed => parseFloat(feed.field3));
    var co22 = data1.feeds.map(feed => parseFloat(feed.field6));
    var suma3 = co21.map((co, index) => (co + co22[index]) / 2);  // Calcula el promedio

    // Mantener solo los últimos 20 puntos
    if (labels1.length > 20) {
        labels1 = labels1.slice(labels1.length - 20);
        co21 = co21.slice(co21.length - 20);
    }

    if (labels2.length > 20) {
        labels2 = labels2.slice(labels2.length - 20);
        co22 = co22.slice(co22.length - 20);
    }

    if (suma3.length > 20) {
        suma3 = suma3.slice(suma3.length - 20);
    }

    if (!myChart3) {
        myChart3 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels1, // Puedes usar labels1 o labels2, ya que ambos deben tener la misma longitud
                datasets: [
                    {
                        label: 'Niveles de CO2 en sensor 2 (PPM)',
                        data: co21,
                        borderColor: 'rgba(0, 255, 0, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Niveles de CO2 en sensor 1 (PPM)',
                        data: co22,
                        borderColor: 'rgba(0, 255, 0, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'CO2 Promedio (PPM)',
                        data: suma3,
                        borderColor: 'rgba(255, 255, 0, 1)',
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    } else {
        myChart3.data.labels = labels1.concat(labels2).slice(-20);  // Usa ambas etiquetas y mantiene solo los últimos 20 puntos
        myChart3.data.datasets[0].data = co21.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart3.data.datasets[1].data = co22.slice(-20);  // Mantiene solo los últimos 20 puntos
        myChart3.data.datasets[2].data = suma3.slice(-20);
        myChart3.update();
    }
}






function generateCSVContent(data) {
    let csvContent = "Fecha, Hora, Temperatura (°C), Humedad (%), CO2 (PPM)\n";

    data.feeds.forEach(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        const row = `${localTime}, ${feed.field1}, ${feed.field2}, ${feed.field3}\n`;
        csvContent += row;
    });

    return csvContent;
}

// Función para descargar el archivo CSV
function downloadCSV() {
    // Realizar una nueva solicitud para obtener los datos más recientes
    fetch(url)
    .then(response => response.json())
    .then(data => {
    const csvContent = generateCSVContent(data);

    // Crear un objeto Blob
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8" });

    // Crear un enlace para la descarga
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Datos_de_Sensor_1.csv";

    // Agregar el enlace al DOM y simular el clic
    document.body.appendChild(a);
    a.click();

    // Limpiar recursos después de la descarga
    URL.revokeObjectURL(a.href);
        // Eliminar el enlace del DOM
        document.body.removeChild(a);
        })
        .catch(error => {
        console.error(error);
    });
}
// Agregar un listener de clic al botón para iniciar la descarga
document.getElementById('download-button').addEventListener('click', downloadCSV);



//******************************************************************************** */
function generateCSVContent2(data1) {
    let csvContent = "Fecha, Hora, Temperatura (°C), Humedad (%), CO2 (PPM)\n";

    data1.feeds.forEach(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        const row = `${localTime}, ${feed.field4}, ${feed.field5}, ${feed.field6}\n`;
        csvContent += row;
    });

    return csvContent;
}

// *************************************************************************************************************
function downloadCSV2() {
    // Realizar una nueva solicitud para obtener los datos más recientes
    fetch(url2)
    .then(response1 => response1.json())
    .then(data1 => {
    const csvContent = generateCSVContent2(data1);

    // Crear un objeto Blob
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8" });

    // Crear un enlace para la descarga
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Datos_de_Sensor_2.csv";

    // Agregar el enlace al DOM y simular el clic
    document.body.appendChild(a);
    a.click();

    // Limpiar recursos después de la descarga
    URL.revokeObjectURL(a.href);
        // Eliminar el enlace del DOM
        document.body.removeChild(a);
        })
        .catch(error => {
        console.error(error);
    });
}
// Agregar un listener de clic al botón para iniciar la descarga
document.getElementById('download-button2').addEventListener('click', downloadCSV2);




// Actualizar los datos y gráfica cada 5 segundos
setInterval(fetchData, 5000);
setInterval(fetchData1, 5000);




