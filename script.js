// --- STATE AWAL PEMAIN (UNTUK RESTART) ---
const initialPlayerState = {
    name: "Tanpa Nama",
    gender: null,
    age: 0,
    happiness: 70,
    health: 80,
    smarts: 50,
    looks: 60,
    money: 0,
    netWorth: 0,
    job: null,
    livingCost: 0,
    isAlive: true,
    usedEvents: []
};

// --- STATE PEMAIN SAAT INI ---
let player;
let selectedGender = null;

// ===================================================================================
// === BANK EVENT BESAR (VERSI SUPER LENGKAP) ===
// ===================================================================================
const toddlerEvents = [
    { 
        description: 'Ibu Anda menyuruh Anda tidur siang.',
        choices: [
            { text: 'Pura-pura tidur', effect: { smarts: 5, happiness: -5 }, outcome: 'Anda diam-diam membaca komik di bawah selimut.' },
            { text: 'Tidur siang dengan nyenyak', effect: { health: 5 }, outcome: 'Anda bangun dengan segar dan penuh energi.' }
        ]
    },
    { 
        description: 'Anda melihat ada genangan lumpur yang menggoda.',
        choices: [
            { text: 'Lompat dan main di lumpur!', effect: { happiness: 10, health: -5 }, outcome: 'Sangat menyenangkan! Tapi setelah itu Anda dimarahi habis-habisan.' },
            { text: 'Menghindarinya', effect: { smarts: 2 }, outcome: 'Anda tahu kalau bermain kotor akan membuat ibu marah.' }
        ]
    },
    { 
        description: 'Ayah Anda mencoba mengajari Anda bersepeda roda dua.',
        choices: [
            { text: 'Terus mencoba walau jatuh', effect: { health: -5, happiness: 15 }, outcome: 'Setelah beberapa kali jatuh dan lutut lecet, Anda akhirnya bisa!' },
            { text: 'Menangis dan menyerah', effect: { happiness: -10 }, outcome: 'Anda takut jatuh lagi dan kembali ke sepeda roda empat.' }
        ]
    },
    { 
        description: 'Saat di Posyandu, petugas akan memberikan imunisasi suntik.',
        choices: [
            { text: 'Menangis sekencang-kencangnya', effect: { happiness: -5 }, outcome: 'Rasanya sakit, tapi ibu Anda berhasil menenangkan Anda dengan permen.' },
            { text: 'Berani dan tidak menangis', effect: { health: 10, smarts: 5 }, outcome: 'Anda dipuji sebagai anak pemberani oleh semua orang.' }
        ]
    },
    { 
        description: 'Anda diberi uang jajan oleh nenek.',
        choices: [
            { text: 'Langsung beli permen', effect: { happiness: 10, health: -2, money: -2000 }, outcome: 'Rasanya enak sekali, walaupun gigi Anda sedikit ngilu.' },
            { text: 'Masukkan ke celengan ayam', effect: { smarts: 5, money: 10000 }, outcome: 'Anda belajar menabung. Nenek senang dan memberi Anda lebih banyak.' }
        ]
    }
];
const childhoodEvents = [
    { 
        description: 'Teman mengajakmu patungan untuk membeli komik terbaru.',
        choices: [
            { text: 'Ikut patungan', requires: { money: 10000 }, effect: { money: -10000, happiness: 10 }, outcome: 'Kalian membaca komik itu bersama-sama dengan seru.' },
            { text: 'Tidak ikut karena hemat', effect: { smarts: 5 }, outcome: 'Anda memilih menyimpan uang Anda untuk hal yang lebih penting.' }
        ]
    },
    { 
        description: 'Ibu menyuruh Anda pergi ke warung untuk membeli terigu.',
        choices: [
            { text: 'Langsung berangkat', effect: { smarts: 2, happiness: 5, money: 2000 }, outcome: 'Ibu senang karena Anda anak yang penurut. Anda diizinkan menyimpan uang kembaliannya.' },
            { text: 'Mengeluh dan menunda-nunda', effect: { happiness: -5 }, outcome: 'Anda akhirnya tetap pergi juga, tapi sambil cemberut.' }
        ]
    },
    {
        description: 'Saat hari raya Lebaran, Anda berkeliling & bersalaman dengan saudara.',
        choices: [
            { text: 'Kumpulkan semua angpau!', effect: { happiness: 15, money: 500000 }, outcome: 'Anda berhasil mengumpulkan banyak "THR"! Anda merasa kaya raya.' },
            { text: 'Malu-malu saat diberi', effect: { happiness: 5, money: 100000 }, outcome: 'Anda hanya menerima beberapa pemberian saja, tapi tetap bersyukur.' }
        ]
    },
    {
        description: 'Anda menemukan dompet jatuh di jalan dekat sekolah.',
        choices: [
            { text: 'Ambil uangnya, buang dompetnya', effect: { happiness: -15, smarts: -5, money: 100000 }, outcome: 'Anda mendapatkan uang, tapi seharian merasa bersalah dan takut ketahuan.' },
            { text: 'Serahkan ke guru piket', effect: { happiness: 15, smarts: 10 }, outcome: 'Pemilik dompet sangat berterima kasih. Anda dipuji karena kejujuran Anda.' }
        ]
    },
    {
        description: 'Layangan Anda putus saat sedang asyik bermain.',
        choices: [
            { text: 'Mengejar layangan putus', effect: { happiness: 10, health: -5 }, outcome: 'Lari-larian di gang sempit sangat seru! Anda berhasil mendapatkan layangan lain.' },
            { text: 'Merelakannya pergi', effect: { happiness: -5 }, outcome: 'Anda menatap nanar layangan Anda yang hilang di angkasa.' }
        ]
    }
];
const teenEvents = [
    { 
        description: 'Anda diajak teman untuk ikut tawuran antar sekolah.',
        choices: [
            { text: 'Ikut demi solidaritas', effect: { happiness: -20, health: -15, smarts: -10, looks: -5 }, outcome: 'Aksi tawuran dibubarkan polisi. Anda terluka dan diskors dari sekolah.' },
            { text: 'Menolak dengan tegas', effect: { happiness: 5, smarts: 5 }, outcome: 'Teman-temanmu sempat mengejekmu, tapi kamu bangga telah membuat keputusan yang benar.' }
        ]
    },
    { 
        description: 'Gebetan Anda memberi sinyal sepertinya dia juga suka.',
        choices: [
            { text: 'Tembak langsung!', effect: { happiness: 20, looks: 5 }, outcome: 'Dia menerima Anda! Hari-hari Anda di sekolah menjadi lebih berwarna.' },
            { text: 'Pendam perasaan dan tetap jadi teman', effect: { happiness: -10 }, outcome: 'Anda terlalu takut untuk ditolak dan kehilangan momen itu selamanya.' }
        ]
    },
    { 
        description: 'Anda ingin sekali punya smartphone terbaru.',
        choices: [
            { text: 'Merengek minta ke orang tua', outcome: 'Orang tua Anda menasihati tentang prioritas. Anda tidak mendapatkannya.' },
            { text: 'Cari kerja paruh waktu di kafe', effect: { smarts: 5, health: -5 }, outcome: 'Anda diterima! Ini akan melelahkan, tapi Anda bisa menghasilkan uang sendiri.', newJob: { title: 'Pekerja Paruh Waktu', salary: 800000 } }
        ]
    },
    { 
        description: 'Anda terpilih menjadi calon ketua OSIS.',
        choices: [
            { text: 'Lakukan kampanye besar-besaran', effect: { smarts: 10, happiness: 5, looks: 5 }, outcome: 'Anda belajar banyak tentang kepemimpinan dan berbicara di depan umum.' },
            { text: 'Mengundurkan diri karena tidak percaya diri', effect: { smarts: -5, happiness: -10 }, outcome: 'Anda melewatkan sebuah kesempatan berharga.' }
        ]
    },
    { 
        description: 'Token listrik di rumah Anda berbunyi nyaring di tengah malam.',
        choices: [
            { text: 'Langsung keluar cari konter pulsa', requires: {money: 51000}, effect: { health: -5, money: -51000 }, outcome: 'Anda berhasil mengisi token, tapi harus melawan kantuk keesokan harinya.' },
            { text: 'Biarkan saja sampai besok pagi', effect: { happiness: -10 }, outcome: 'Anda terpaksa tidur dalam gelap dan kegerahan.' }
        ]
    }
];
const youngAdultEvents = [
    { 
        description: 'Setelah lulus SMA, apa rencanamu?',
        choices: [
            { text: 'Mencoba masuk Perguruan Tinggi', effect: { smarts: 10 }, outcome: 'Kamu menghabiskan setahun untuk belajar keras demi masa depan yang lebih cerah.' },
            { text: 'Langsung cari kerja apa saja', effect: { happiness: -5, health: -5 }, outcome: 'Kamu mulai mencari lowongan kerja untuk bisa mandiri.' }
        ]
    },
    { 
        description: 'Anda lulus kuliah dan mendapat tawaran kerja pertama.',
        choices: [
            { text: 'Terima pekerjaan sebagai Junior Developer', effect: { happiness: 15, smarts: 5 }, outcome: 'Selamat! Anda resmi memasuki dunia kerja. Saatnya mencari kos dan hidup mandiri.', newJob: { title: 'Junior Developer', salary: 5300000 }, setLivingCost: 2000000 },
            { text: 'Tolak dan cari yang gajinya lebih besar', effect: { smarts: -5, happiness: -10 }, outcome: 'Anda mengambil risiko. Pencarian kerja ternyata lebih sulit dari yang dibayangkan.' }
        ]
    },
    { 
        description: 'Ibu kos menagih uang sewa yang sudah jatuh tempo.',
        choices: [
            { text: 'Bayar tepat waktu', requires: { money: 2000000 }, effect: { money: -2000000 }, outcome: 'Anda membayar kewajiban Anda. Ibu kos tersenyum senang.' },
            { text: 'Minta keringanan waktu', effect: { happiness: -10 }, outcome: 'Ibu kos mengizinkan, tapi Anda merasa tidak enak hati.' }
        ]
    },
    { 
        description: 'Saat reuni, seorang teman lama bertanya "Kapan nikah?".',
        choices: [
            { text: 'Jawab dengan senyum dan candaan', effect: { smarts: 5, happiness: 5 }, outcome: 'Anda berhasil mengatasi situasi canggung dengan elegan.' },
            { text: 'Merasa tertekan dan menghindar', effect: { happiness: -10 }, outcome: 'Pertanyaan itu membuat Anda berpikir dan sedikit cemas tentang masa depan.' }
        ]
    },
    { 
        description: 'Perusahaan tempat Anda bekerja memberikan bonus akhir tahun.',
        choices: [
            { text: 'Gunakan untuk liburan', requires: { job: true, money: 4000000 }, effect: { happiness: 20, health: 5 }, outcome: 'Anda mendapat bonus dan menggunakannya untuk liburan yang menyegarkan.' },
            { text: 'Masukkan ke tabungan & investasi', requires: { job: true }, effect: { smarts: 10, happiness: 5 }, outcome: 'Anda mendapat bonus dan langsung mengalokasikannya untuk masa depan.' }
        ]
    }
];
const adultEvents = [
    { 
        description: 'Anda dihadapkan pada pilihan untuk membeli rumah.',
        choices: [
            { text: 'Ambil KPR 20 tahun', requires: { money: 50000000 }, effect: { happiness: 25, money: -50000000, netWorth: 400000000 }, outcome: 'Anda akhirnya punya rumah sendiri! Beban finansial terasa berat, tapi ini adalah pencapaian besar.', newLivingCost: 3500000 },
            { text: 'Terus mengontrak', effect: {}, outcome: 'Anda memilih fleksibilitas finansial untuk saat ini.' }
        ]
    },
    { 
        description: 'Atasan Anda melakukan kesalahan, tetapi sepertinya akan menyalahkan Anda.',
        choices: [
            { text: 'Bicara baik-baik dan tunjukkan bukti', effect: { smarts: 10, happiness: -5 }, outcome: 'Situasi menjadi tegang, tapi Anda berhasil membersihkan nama Anda.' },
            { text: 'Diam dan menerima kesalahan', effect: { smarts: -10, happiness: -15 }, outcome: 'Anda dimarahi untuk kesalahan yang tidak Anda perbuat. Anda merasa tidak adil.' }
        ]
    },
    { 
        description: 'Anda mendapat undangan untuk menjadi bridesmaid/groomsman.',
        choices: [
            { text: 'Terima dengan senang hati', effect: { happiness: 10, money: -1000000 }, outcome: 'Anda ikut berbahagia untuk teman Anda, walaupun ada pengeluaran untuk seragam dan hadiah.' },
            { text: 'Tolak dengan alasan sibuk', effect: { happiness: -5 }, outcome: 'Anda menghemat uang, tapi teman Anda sedikit kecewa.' }
        ]
    },
    { 
        description: 'Hasil medical check-up menunjukkan kolesterol Anda tinggi.',
        choices: [
            { text: 'Mulai rutin berolahraga dan jaga makan', effect: { health: 20, happiness: 5, money: -500000 }, outcome: 'Beberapa bulan kemudian, kesehatan Anda membaik secara signifikan.' },
            { text: 'Mengabaikannya dan terus makan seperti biasa', effect: { health: -15 }, outcome: 'Anda merasa baik-baik saja untuk saat ini, tapi menanam bom waktu untuk masa depan.' }
        ]
    },
    {
        description: 'Perusahaan menawarkan promosi menjadi Manajer.',
        choices: [
            { text: 'Terima tanggung jawab baru', requires: { job: true, smarts: 70 }, effect: { smarts: 10, health: -10, happiness: 15 }, outcome: 'Gaji dan stres Anda meningkat pesat!', newJob: { title: 'Manager', salary: 15000000 } },
            { text: 'Tolak karena takut stres', requires: { job: true }, effect: { happiness: 5, health: 5 }, outcome: 'Anda memilih untuk tetap di zona nyaman.' }
        ]
    }
];
const middleAgeEvents = [
     { 
        description: 'Anak Anda yang sudah bekerja menawarkan untuk memberikan uang bulanan.',
        choices: [
            { text: 'Terima dengan senang hati', effect: { happiness: 15, money: 1000000 }, outcome: 'Anda merasa bangga dan beban finansial Anda sedikit lebih ringan.' },
            { text: 'Tolak dengan halus, katakan Anda masih mandiri', effect: { happiness: 5, smarts: 5 }, outcome: 'Anda tidak ingin merepotkan anak Anda.' }
        ]
    },
     { 
        description: 'Anda mencapai usia pensiun. Apa yang akan Anda lakukan?',
        choices: [
            { text: 'Menikmati hari tua dengan berkebun', effect: { health: 10, happiness: 10 }, outcome: 'Anda menemukan kedamaian baru dalam merawat tanaman.', newJob: null, setLivingCost: 1000000 },
            { text: 'Membuka usaha warung kelontong', requires: { money: 25000000 }, effect: { smarts: 5, health: -5, money: -25000000 }, outcome: 'Pikiran Anda tetap aktif, tapi kadang Anda lelah mengurus bisnis.', newJob: { title: 'Pengusaha Warung', salary: 3000000 } }
        ]
    },
     { 
        description: 'Anda diundang untuk ikut dalam grup senam lansia di komplek perumahan.',
        choices: [
            { text: 'Ikut dengan antusias', effect: { health: 10, happiness: 10 }, outcome: 'Tubuh Anda menjadi lebih bugar dan Anda mendapatkan banyak teman baru.' },
            { text: 'Lebih suka bersantai di rumah', effect: { health: -5 }, outcome: 'Anda merasa damai, tapi tubuh Anda mulai terasa kaku.' }
        ]
    }
];

// --- KONEKSI KE HTML (DOM Elements) ---
const creationScreen = document.getElementById('creation-screen');
const nameInput = document.getElementById('name-input');
const genderButtons = document.querySelectorAll('.gender-btn');
const startGameButton = document.getElementById('start-game-button');

const gameContainer = document.getElementById('game-container');
const playerNameEl = document.getElementById('player-name');
const ageEl = document.getElementById('age');
const moneyEl = document.getElementById('money');
const netWorthEl = document.getElementById('net-worth');
const happinessBar = document.getElementById('happiness-bar');
const healthBar = document.getElementById('health-bar');
const smartsBar = document.getElementById('smarts-bar');
const looksBar = document.getElementById('looks-bar');
const eventTextEl = document.getElementById('event-text');
const choicesContainer = document.getElementById('choices-container');
const ageUpButton = document.getElementById('age-up-button');
const restartButton = document.getElementById('restart-button');


// --- FUNGSI-FUNGSI GAME ---
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function updateUI() {
    if (!player) return; // Guard clause
    playerNameEl.textContent = `Nama: ${player.name}`;
    ageEl.textContent = `Umur: ${player.age}`;
    moneyEl.textContent = `Uang: ${formatCurrency(player.money)}`;
    netWorthEl.textContent = `Aset: ${formatCurrency(player.netWorth)}`;
    
    happinessBar.style.width = player.happiness + '%';
    healthBar.style.width = player.health + '%';
    smartsBar.style.width = player.smarts + '%';
    looksBar.style.width = player.looks + '%';

    if (!player.isAlive) {
        ageUpButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
    } else {
        ageUpButton.classList.remove('hidden');
        restartButton.classList.add('hidden');
    }
}

function meetsRequirements(req) {
    if (!req) return true;
    if (req.money && player.money < req.money) return false;
    if (req.job && !player.job) return false;
    if (req.smarts && player.smarts < req.smarts) return false;
    return true;
}

function handleChoiceEvent(event) {
    eventTextEl.textContent = event.description;
    choicesContainer.innerHTML = ''; 

    event.choices.forEach((choice) => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice-button';
        if (!meetsRequirements(choice.requires)) {
            button.disabled = true;
            let title = 'Syarat tidak terpenuhi';
            if (choice.requires.money) title = `Butuh Uang: ${formatCurrency(choice.requires.money)}`;
            else if (choice.requires.job) title = 'Anda harus punya pekerjaan';
            else if (choice.requires.smarts) title = `Butuh Kecerdasan: ${choice.requires.smarts}`;
            button.title = title;
        }
        button.onclick = () => selectChoice(event, choice);
        choicesContainer.appendChild(button);
    });
    ageUpButton.disabled = true;
}

function selectChoice(event, chosen) {
    eventTextEl.textContent = chosen.outcome;
    applyEffect(chosen.effect);
    
    if (chosen.newJob !== undefined) player.job = chosen.newJob;
    if (chosen.newLivingCost) player.livingCost += chosen.newLivingCost;
    if (chosen.setLivingCost !== undefined) player.livingCost = chosen.setLivingCost;

    choicesContainer.innerHTML = ''; 
    ageUpButton.disabled = false; 
    updateUI();
}

function applyEffect(effect) {
    if (!effect) return;
    player.happiness = Math.min(100, Math.max(0, player.happiness + (effect.happiness || 0)));
    player.health = Math.min(100, Math.max(0, player.health + (effect.health || 0)));
    player.smarts = Math.min(100, Math.max(0, player.smarts + (effect.smarts || 0)));
    player.looks = Math.min(100, Math.max(0, player.looks + (effect.looks || 0)));
    
    if (effect.money) {
        player.money += effect.money;
        player.netWorth += effect.money;
    }
    if (effect.netWorth) {
        player.netWorth += effect.netWorth;
    }
}

function triggerRandomEvent() {
    let eventPool;
    if (player.age <= 5) eventPool = toddlerEvents;
    else if (player.age <= 12) eventPool = childhoodEvents;
    else if (player.age <= 18) eventPool = teenEvents;
    else if (player.age <= 29) eventPool = youngAdultEvents;
    else if (player.age <= 50) eventPool = adultEvents;
    else eventPool = middleAgeEvents;
    
    const availableEvents = eventPool.filter(event => !player.usedEvents.includes(event.description));
    if (availableEvents.length === 0) {
        eventTextEl.textContent = "Satu tahun ini berlalu dengan tenang...";
        choicesContainer.innerHTML = '';
        ageUpButton.disabled = false;
        return; 
    }
    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    player.usedEvents.push(randomEvent.description); 
    handleChoiceEvent(randomEvent);
}

function handleAnnualFinancials() {
    if (player.age < 6) return null;
    let report = { income: 0, expense: 0 };
    if (player.job) {
        const annualSalary = player.job.salary * 12;
        player.money += annualSalary;
        player.netWorth += annualSalary;
        report.income = annualSalary;
    }
    if (player.livingCost > 0) {
        const annualLivingCost = player.livingCost * 12;
        player.money -= annualLivingCost;
        player.netWorth -= annualLivingCost;
        report.expense = annualLivingCost;
    }
    return (report.income > 0 || report.expense > 0) ? report : null;
}

function ageUp() {
    if (!player.isAlive || ageUpButton.disabled) return;
    ageUpButton.disabled = true;
    player.age++;
    player.health = Math.max(0, player.health - 1);
    
    const financialReport = handleAnnualFinancials();
    
    if (financialReport) {
        let reportText = "Laporan Keuangan Tahunan:\n";
        if (financialReport.income > 0) reportText += `Pemasukan: ${formatCurrency(financialReport.income)}. `;
        if (financialReport.expense > 0) reportText += `Pengeluaran: ${formatCurrency(financialReport.expense)}.`;
        eventTextEl.textContent = reportText;
        choicesContainer.innerHTML = '';
        setTimeout(() => triggerEventOrEndGame(), 2500);
    } else {
        triggerEventOrEndGame();
    }
}

function triggerEventOrEndGame() {
     if (player.health <= 0) {
        player.isAlive = false;
        eventTextEl.textContent = `Pada umur ${player.age}, Anda meninggal dunia karena kesehatan yang buruk. Total aset akhir: ${formatCurrency(player.netWorth)}.`;
    } else if (player.age >= 90) { 
        player.isAlive = false;
        eventTextEl.textContent = `Anda hidup panjang dan meninggal dengan tenang pada umur ${player.age}. Total aset akhir: ${formatCurrency(player.netWorth)}.`;
    } else {
        triggerRandomEvent();
    }
    updateUI();
}

function initializeGame(name, gender) {
    player = JSON.parse(JSON.stringify(initialPlayerState)); 
    player.name = name;
    player.gender = gender;
    
    eventTextEl.textContent = `Anda baru saja lahir sebagai seorang ${gender} bernama ${name}. Klik "Tambah Umur" untuk memulai kehidupan Anda.`;
    choicesContainer.innerHTML = '';
    ageUpButton.disabled = false;
    updateUI();
}

function beginLife() {
    const name = nameInput.value.trim();
    if (name === "") {
        alert("Harap masukkan nama karakter Anda.");
        return;
    }
    if (!selectedGender) {
        alert("Harap pilih gender karakter Anda.");
        return;
    }
    
    creationScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    initializeGame(name, selectedGender);
}

function setupCreationScreen() {
    gameContainer.classList.add('hidden');
    creationScreen.classList.remove('hidden');

    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedGender = button.dataset.gender;
        });
    });

    startGameButton.addEventListener('click', beginLife);
}

// --- INISIALISASI GAME ---
// PERBAIKAN KRUSIAL: Menambahkan event listener untuk tombol utama
ageUpButton.addEventListener('click', ageUp);

restartButton.addEventListener('click', () => {
    selectedGender = null;
    genderButtons.forEach(btn => btn.classList.remove('selected'));
    nameInput.value = '';
    setupCreationScreen();
});

// Mulai dengan menampilkan layar pembuatan karakter
setupCreationScreen();