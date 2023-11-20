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
let sensor1Data; 

// Función para cargar y mostrar los datos
function fetchData1() {
    fetch(url)
        .then(response1 => response1.json())
        .then(data1 => {
            sensor1Data=data1
            displayData1(sensor1Data);
            createOrUpdateChart1(sensor1Data);
            fetchData();
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
            createOrUpdateChart(data);
            displayAverages(sensor1Data, data);
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

        // Calcular los promedios
        const v1 = (latestFeed.field1 + latestFeed1.field4)/2;
        const v2 = (latestFeed.field2 + latestFeed1.field5)/2;
        const v3 = (latestFeed.field3 + latestFeed1.field6)/2;

        // Formatear la fecha y hora
        const utcTime = new Date(latestFeed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTimeString = utcTime.toLocaleString('es-MX', options);
        html3 += `<p>Fecha y Hora: ${localTimeString}, Promedio de Temperatura: ${v1} °C, Promedio de Humedad: ${v2}%, Promedio de Niveles de CO2: ${v3} PPM</p>`;

    } else {
        html3 += '<p>No hay datos disponibles para el Sensor Virtual.</p>';
    }
    dataContainer3.innerHTML = html3;
}


function createOrUpdateChart(data) {
    var ctx2 = document.getElementById('chart1').getContext('2d');

    var labels = data.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return localTime.toLocaleString('es-MX', options);
    });

    var temperatures = data.feeds.map(feed => parseFloat(feed.field4));
    var humidity = data.feeds.map(feed => parseFloat(feed.field5));
    var co2Levels = data.feeds.map(feed => parseFloat(feed.field6));

    // Mantener solo los últimos 20 puntos
    if (labels.length > 20) {
        labels = labels.slice(labels.length - 20);
        temperatures = temperatures.slice(temperatures.length - 20);
        humidity = humidity.slice(humidity.length - 20);
        co2Levels = co2Levels.slice(co2Levels.length - 20);
    }

    if (!myChart2) {
        myChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: temperatures,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Humedad (%)',
                        data: humidity,
                        borderColor: 'rgba(75, 192, 255, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Niveles de CO2 (PPM)',
                        data: co2Levels,
                        borderColor: 'rgba(54, 255, 54, 1)',
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
        myChart2.data.labels = labels;
        myChart2.data.datasets[0].data = temperatures;
        myChart2.data.datasets[1].data = humidity;
        myChart2.data.datasets[2].data = co2Levels;
        myChart2.update();
    }
}


function createOrUpdateChart1(data1) {
    var ctx1 = document.getElementById('chart2').getContext('2d');

    var labels = data1.feeds.map(feed => {
        const utcTime = new Date(feed.created_at);
        const options = { timeZone: 'America/Mexico_City' };
        const localTime = utcTime.toLocaleString('es-MX', options);
        return localTime.toLocaleString('es-MX', options);
    });

    var fed1 = data1.feeds.map(feed =>parseFloat(feed.field1));
    var fed2 = data1.feeds.map(feed =>parseFloat(feed.field2));
    var fed3 = data1.feeds.map(feed =>parseFloat(feed.field3));

    // Mantener solo los últimos 20 puntos
    if (labels.length > 20) {
        labels = labels.slice(labels.length - 20);
        fed1 = fed1.slice(fed1.length - 20);
        fed2 = fed2.slice(fed2.length - 20);
        fed3 = fed3.slice(fed3.length - 20);
    }


    if (!myChart) {
        myChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: fed1,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Humedad (%)',
                        data: fed2,
                        borderColor: 'rgba(75, 192, 255, 1)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Niveles de CO2 (PPM)',
                        data: fed3,
                        borderColor: 'rgba(54, 255, 54, 1)',
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
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = fed1;
        myChart.data.datasets[1].data = fed2;
        myChart.data.datasets[2].data = fed3;
        myChart.update();
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




