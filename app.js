const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m';

const tableBody = document.getElementById('tableBody');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const refreshBtn = document.getElementById('refreshBtn');

function showLoading() {
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    tableBody.innerHTML = '';
    refreshBtn.disabled = true;
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
    refreshBtn.disabled = false;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    hideLoading();
}

function formatDateTime(isoString) {
    return new Date(isoString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function displayWeatherData(data) {
    const times = data.hourly.time;
    const temperatures = data.hourly.temperature_2m;

    if (!times || !temperatures || times.length !== temperatures.length) {
        showError('Format data tidak valid');
        return;
    }

    times.forEach((time, index) => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = formatDateTime(time);

        const tempCell = document.createElement('td');
        const suhu = temperatures[index];
        tempCell.textContent = suhu === null ? '-' : suhu.toFixed(1);

        row.append(timeCell, tempCell);
        tableBody.appendChild(row);
    });

    hideLoading();
}

async function fetchWeatherData() {
    showLoading();

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError(`Gagal memuat data: ${error.message}`);
    }
}

refreshBtn.addEventListener('click', fetchWeatherData);
fetchWeatherData();
