// Data dummy siswa
const daftarSiswa = [
    "randy mardiansyah",
    "muhamad ikbal",
    "brachma adipati",
    " muhamad bahaudin",
    "derga agung",
    "ahmad fahmi",
    "fauzan",
    "mayang",
    "sunita",
    "laila"
];

// Fungsi untuk mengisi dropdown (select) nama siswa
function populateSiswaDropdown() {
    const select = document.getElementById('nama-siswa');
    daftarSiswa.forEach(nama => {
        const option = document.createElement('option');
        option.value = nama;
        option.textContent = nama;
        select.appendChild(option);
    });
}

// Fungsi untuk mendapatkan data absensi dari Local Storage
function getAbsensiData() {
    const data = localStorage.getItem('absensiKelas');
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data absensi ke Local Storage
function saveAbsensiData(data) {
    localStorage.setItem('absensiKelas', JSON.stringify(data));
}

// Fungsi untuk menampilkan tanggal sekarang
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    document.getElementById('tanggal-sekarang').textContent = `Tanggal: ${today}`;
}

// Fungsi untuk mengirim (submit) absensi
function submitAbsen() {
    const select = document.getElementById('nama-siswa');
    const namaSiswa = select.value;

    if (!namaSiswa) {
        alert("Mohon pilih nama siswa terlebih dahulu!");
        return;
    }

    const dataAbsensi = getAbsensiData();

    // Cek apakah siswa sudah absen hari ini
    const today = new Date().toDateString();
    const isAlreadyAbsent = dataAbsensi.some(item => 
        item.nama === namaSiswa && new Date(item.waktu).toDateString() === today
    );

    if (isAlreadyAbsent) {
        alert(`Siswa ${namaSiswa} sudah absen hari ini.`);
        return;
    }

    // Catat absensi baru
    const waktuAbsen = new Date();
    dataAbsensi.push({
        nama: namaSiswa,
        waktu: waktuAbsen.toISOString(),
        status: "Hadir"
    });

    saveAbsensiData(dataAbsensi);
    renderAbsensiTable(dataAbsensi);
    
    // Reset dropdown setelah absen berhasil
    select.value = ""; 
    alert(`Absensi ${namaSiswa} berhasil dicatat!`);
}

// Fungsi untuk merender tabel absensi
function renderAbsensiTable(data) {
    const tbody = document.querySelector('#tabel-absensi tbody');
    tbody.innerHTML = ''; // Kosongkan tabel sebelum merender ulang

    let counter = 1;
    const today = new Date().toDateString();

    // Filter absensi untuk hari ini saja
    const absensiHariIni = data.filter(item => 
        new Date(item.waktu).toDateString() === today
    );
    
    // Urutkan berdasarkan waktu absen
    absensiHariIni.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));

    absensiHariIni.forEach(item => {
        const waktuLokal = new Date(item.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const row = tbody.insertRow();
        row.insertCell().textContent = counter++;
        row.insertCell().textContent = item.nama;
        row.insertCell().textContent = waktuLokal;
        row.insertCell().textContent = item.status;
    });
}

// Jalankan semua fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    populateSiswaDropdown();
    displayDate();
    const initialData = getAbsensiData();
    renderAbsensiTable(initialData);
});