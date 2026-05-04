// ============================================================
// LDK AL UMM - DATABASE (localStorage-based)
// ============================================================

const DB = {
  // ---- INIT ----
  init() {
    if (!localStorage.getItem('ldk_initialized')) {
      this.seed();
      localStorage.setItem('ldk_initialized', 'true');
    }
  },

  reset() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('ldk_'));
    keys.forEach(k => localStorage.removeItem(k));
    this.seed();
    localStorage.setItem('ldk_initialized', 'true');
  },

  seed() {
    // USERS
    const users = [
      { id: 1, name: 'Admin LDK', email: 'admin@ldkalumm.com', password: 'password', role: 'admin', divisi_id: null, no_hp: '081234567890', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 2, name: 'Muhammad Taufiqul Rohman', email: 'taufiq@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 1, no_hp: '082111111111', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 3, name: 'Anisa Agustina', email: 'anisa@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 2, no_hp: '082222222222', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 4, name: 'Muhamad Gilang El-Fatta', email: 'gilang@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 3, no_hp: '082333333333', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 5, name: 'Jeantly Alham Taqwana', email: 'jeantly@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 4, no_hp: '082444444444', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 6, name: 'Susilawati', email: 'susi@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 5, no_hp: '082555555555', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 7, name: 'Abdul Mujib Muhaimin', email: 'mujib@ldkalumm.com', password: 'password', role: 'ketua', divisi_id: 6, no_hp: '082666666666', status_verifikasi: 'terverifikasi', created_at: '2024-01-01' },
      { id: 8, name: 'Anggota Umum', email: 'anggota@ldkalumm.com', password: 'password', role: 'anggota', divisi_id: 1, no_hp: '081999999999', status_verifikasi: 'terverifikasi', created_at: '2024-01-15' },
      { id: 9, name: 'Pendaftar Baru', email: 'baru@example.com', password: 'password', role: 'anggota', divisi_id: 2, no_hp: '089888888888', status_verifikasi: 'pending', created_at: '2024-03-10' },
    ];
    this.set('users', users);

    // DIVISIONS
    const divisions = [
      {
        id: 1, name: 'Bidang DKM', icon: '🕌',
        description: 'Dewan Kemakmuran Masjid (DKM) adalah bidang yang berfokus pada kemakmuran dan pengelolaan masjid kampus serta kegiatan keislaman yang berkaitan dengan masjid.',
        tugas_wewenang: 'Mengelola dan memakmurkan masjid kampus, menyelenggarakan kegiatan keislaman, membina jamaah masjid, mengkoordinasikan program-program dakwah berbasis masjid, serta menjalin kerjasama dengan berbagai pihak untuk kemakmuran masjid.'
      },
      {
        id: 2, name: 'Bidang Kewirausahaan', icon: '💼',
        description: 'Bidang yang berfokus pada pengembangan jiwa wirausaha Islami di kalangan mahasiswa melalui berbagai program ekonomi kreatif.',
        tugas_wewenang: 'Mengembangkan program kewirausahaan berbasis syariah, memfasilitasi anggota dalam berwirausaha, mengelola unit usaha LDK, serta memberdayakan potensi ekonomi anggota dan mahasiswa muslim.'
      },
      {
        id: 3, name: 'Bidang Media', icon: '📸',
        description: 'Bidang yang bertanggung jawab atas pengelolaan media dakwah digital dan konvensional LDK Al Umm.',
        tugas_wewenang: 'Mengelola media sosial LDK, memproduksi konten dakwah berkualitas, mendokumentasikan kegiatan, memproduksi buletin dan materi dakwah cetak, serta meningkatkan kapasitas anggota dalam bidang media.'
      },
      {
        id: 4, name: 'Divisi Syiar', icon: '📢',
        description: 'Divisi yang berfokus pada penyebaran dakwah Islam melalui berbagai kegiatan syiar di kampus dan lingkungan sekitarnya.',
        tugas_wewenang: 'Menyelenggarakan kegiatan syiar Islam, mengadakan lomba-lomba Islami, menyelenggarakan tabligh akbar, melaksanakan bakti sosial, serta membina kemampuan dakwah anggota.'
      },
      {
        id: 5, name: 'Bidang Kemuslimahan', icon: '🌸',
        description: 'Bidang yang fokus pada pembinaan muslimah kampus melalui kajian dan program pengembangan diri Islami.',
        tugas_wewenang: 'Menyelenggarakan kajian kemuslimahan, membina mahasiswi muslim, mengadakan seminar dan bedah buku keislaman khusus muslimah, serta mengembangkan potensi muslimah kampus.'
      },
      {
        id: 6, name: 'Bidang Humas', icon: '🤝',
        description: 'Bidang yang mengelola hubungan eksternal LDK dengan berbagai organisasi dan lembaga dakwah kampus lainnya.',
        tugas_wewenang: 'Menjalin dan menjaga hubungan dengan LDK lain dan organisasi keislaman, membangun jaringan dakwah kampus, mengelola komunikasi eksternal LDK, serta mengkoordinasikan kegiatan lintas organisasi.'
      },
    ];
    this.set('divisions', divisions);

    // DIVISION BOARDS
    const boards = [
      // DKM
      { id: 1, division_id: 1, position: 'Ketua', name: 'Muhammad Taufiqul Rohman' },
      { id: 2, division_id: 1, position: 'Sekretaris', name: 'Melati' },
      { id: 3, division_id: 1, position: 'Anggota', name: 'Nasywa' },
      { id: 4, division_id: 1, position: 'Anggota', name: 'Nashwa' },
      { id: 5, division_id: 1, position: 'Anggota', name: 'Muhamad Fauzan' },
      { id: 6, division_id: 1, position: 'Anggota', name: 'Mugni' },
      // Kewirausahaan
      { id: 7, division_id: 2, position: 'Ketua', name: 'Anisa Agustina' },
      { id: 8, division_id: 2, position: 'Sekretaris', name: 'Isni Syahidah' },
      { id: 9, division_id: 2, position: 'Anggota', name: 'Dewa' },
      { id: 10, division_id: 2, position: 'Anggota', name: 'Elgar' },
      { id: 11, division_id: 2, position: 'Anggota', name: 'Salsa' },
      { id: 12, division_id: 2, position: 'Anggota', name: 'Silmi' },
      // Media
      { id: 13, division_id: 3, position: 'Ketua', name: 'Muhamad Gilang El-Fatta' },
      { id: 14, division_id: 3, position: 'Sekretaris', name: 'Bella Puspita' },
      { id: 15, division_id: 3, position: 'Anggota', name: 'Adiwijaya' },
      { id: 16, division_id: 3, position: 'Anggota', name: 'Putri' },
      { id: 17, division_id: 3, position: 'Anggota', name: 'Haipa' },
      { id: 18, division_id: 3, position: 'Anggota', name: 'Lulum' },
      { id: 19, division_id: 3, position: 'Anggota', name: 'Maryam' },
      // Syiar
      { id: 20, division_id: 4, position: 'Ketua', name: 'Jeantly Alham Taqwana' },
      { id: 21, division_id: 4, position: 'Sekretaris', name: 'Siti Sarah' },
      { id: 22, division_id: 4, position: 'Anggota', name: 'Liri' },
      { id: 23, division_id: 4, position: 'Anggota', name: 'Encep' },
      // Kemuslimahan
      { id: 24, division_id: 5, position: 'Ketua', name: 'Susilawati' },
      { id: 25, division_id: 5, position: 'Sekretaris', name: 'Fadilla Irani' },
      { id: 26, division_id: 5, position: 'Anggota', name: 'Windasari' },
      { id: 27, division_id: 5, position: 'Anggota', name: 'Ilest' },
      { id: 28, division_id: 5, position: 'Anggota', name: 'Salma' },
      // Humas
      { id: 29, division_id: 6, position: 'Ketua', name: 'Abdul Mujib Muhaimin' },
      { id: 30, division_id: 6, position: 'Sekretaris', name: 'Eliya Mutakin' },
      { id: 31, division_id: 6, position: 'Anggota', name: 'Astrid' },
      { id: 32, division_id: 6, position: 'Anggota', name: 'Sabilly' },
    ];
    this.set('division_boards', boards);

    // WORK PROGRAMS
    const programs = [
      // DKM
      { id:1, division_id:1, name:'HIKMAH', description:'Program halaqah, kajian, dan konten edukatif untuk memakmurkan masjid dan meningkatkan pemahaman Islam anggota.', dasar:'QS. Ali Imran: 104', tujuan:'Meningkatkan pemahaman Islam dan kemakmuran masjid kampus', sasaran:'Mahasiswa muslim kampus UMMI', waktu:'Sepanjang tahun 2024', tempat:'Masjid Kampus UMMI', anggaran_optimis:5000000, anggaran_realistis:3500000, penanggung_jawab:'Muhammad Taufiqul Rohman', indikator_kualitatif:'Meningkatnya kualitas bacaan Al-Quran dan pemahaman Islam anggota', indikator_kuantitatif:'Min. 30 peserta per halaqah, 12 kajian per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:2, division_id:1, name:'NONGKI (Kajian Bulanan)', description:'Kajian bulanan yang mempertemukan anggota dan umum dalam forum keilmuan Islami yang santai namun berkualitas.', dasar:'QS. Az-Zumar: 9', tujuan:'Menyediakan forum kajian rutin bulanan yang informatif', sasaran:'Seluruh mahasiswa dan civitas akademika UMMI', waktu:'Setiap bulan, minggu ke-3', tempat:'Aula/Masjid Kampus UMMI', anggaran_optimis:1500000, anggaran_realistis:1000000, penanggung_jawab:'Melati', indikator_kualitatif:'Kajian berlangsung kondusif dan materi tersampaikan', indikator_kuantitatif:'Min. 50 peserta per kajian, 12 kajian per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:3, division_id:1, name:'MARHAMAH (Event Ramadhan)', description:'Rangkaian kegiatan Ramadhan meliputi lomba, donasi, takjil, buka bersama, sanlat, dan sahur bersama.', dasar:'QS. Al-Baqarah: 185', tujuan:'Mengoptimalkan bulan Ramadhan sebagai momentum dakwah dan pembinaan', sasaran:'Mahasiswa UMMI dan masyarakat sekitar kampus', waktu:'Bulan Ramadhan 1446 H', tempat:'Masjid dan lingkungan kampus UMMI', anggaran_optimis:15000000, anggaran_realistis:10000000, penanggung_jawab:'Muhammad Taufiqul Rohman', indikator_kualitatif:'Terciptanya suasana Ramadhan yang islami di kampus', indikator_kuantitatif:'Min. 200 peserta sanlat, 500 porsi takjil, 5 jenis lomba', status:'aktif', created_at:'2024-01-10' },
      { id:4, division_id:1, name:'LDK Berqurban', description:'Program penggalangan dana qurban dengan program inovatif "geser seribu rupiah" untuk memudahkan partisipasi mahasiswa.', dasar:'QS. Al-Kautsar: 2', tujuan:'Memfasilitasi mahasiswa muslim untuk berqurban bersama', sasaran:'Mahasiswa dan civitas akademika UMMI', waktu:'Bulan Dzulhijjah 1445 H', tempat:'Kampus UMMI', anggaran_optimis:30000000, anggaran_realistis:20000000, penanggung_jawab:'Mugni', indikator_kualitatif:'Terlaksananya penyembelihan hewan qurban secara syar\'i', indikator_kuantitatif:'Min. 2 ekor sapi, 500 donatur geser seribu', status:'aktif', created_at:'2024-01-10' },
      // Kewirausahaan
      { id:5, division_id:2, name:'Al Umm Jasket', description:'Program penjualan jaket resmi LDK Al Umm sebagai merchandise dan sarana fundraising, dilaksanakan dalam 2 sesi.', dasar:'QS. Al-Jumu\'ah: 10', tujuan:'Meningkatkan kemandirian finansial LDK melalui penjualan produk', sasaran:'Anggota LDK dan mahasiswa UMMI', waktu:'Semester 1 dan 2 tahun 2024', tempat:'Kampus UMMI dan online', anggaran_optimis:8000000, anggaran_realistis:6000000, penanggung_jawab:'Anisa Agustina', indikator_kualitatif:'Produk berkualitas dan meningkatkan identitas LDK', indikator_kuantitatif:'Min. 50 unit terjual per sesi, profit min. 25%', status:'aktif', created_at:'2024-01-10' },
      { id:6, division_id:2, name:'LDK Preneur', description:'Program kewirausahaan dengan sistem titip produk dan pemasaran rutin untuk mengembangkan jiwa entrepreneur anggota.', dasar:'Hadits: "Sembilan dari sepuluh pintu rezeki ada di perdagangan"', tujuan:'Menumbuhkan jiwa wirausaha Islami pada anggota LDK', sasaran:'Anggota LDK Al Umm', waktu:'Sepanjang tahun 2024', tempat:'Kampus UMMI dan media sosial', anggaran_optimis:3000000, anggaran_realistis:2000000, penanggung_jawab:'Isni Syahidah', indikator_kualitatif:'Anggota memiliki pengalaman wirausaha nyata', indikator_kuantitatif:'Min. 10 produk aktif dipasarkan, omzet min. Rp 5 juta/bulan', status:'aktif', created_at:'2024-01-10' },
      // Media
      { id:7, division_id:3, name:'Manajemen Media Sosial', description:'Pengelolaan akun media sosial resmi LDK Al Umm secara profesional dan konsisten untuk dakwah digital.', dasar:'QS. An-Nahl: 125', tujuan:'Memperluas jangkauan dakwah LDK melalui media sosial', sasaran:'Pengguna media sosial, mahasiswa, dan masyarakat umum', waktu:'Sepanjang tahun 2024', tempat:'Media sosial (Instagram, Twitter, TikTok, YouTube)', anggaran_optimis:2000000, anggaran_realistis:1500000, penanggung_jawab:'Muhamad Gilang El-Fatta', indikator_kualitatif:'Konten dakwah yang relevan dan berkualitas tinggi', indikator_kuantitatif:'Min. 3 konten/minggu, follower naik 20%/semester', status:'aktif', created_at:'2024-01-10' },
      { id:8, division_id:3, name:'Video Dokumenter', description:'Produksi video dokumenter kegiatan LDK Al Umm untuk arsip dan konten dakwah visual.', dasar:'QS. Al-Alaq: 1', tujuan:'Mendokumentasikan kegiatan LDK secara profesional', sasaran:'Seluruh kegiatan LDK Al Umm', waktu:'Mengikuti jadwal kegiatan LDK', tempat:'Kampus UMMI dan lokasi kegiatan', anggaran_optimis:4000000, anggaran_realistis:3000000, penanggung_jawab:'Bella Puspita', indikator_kualitatif:'Video berkualitas sinematik dan informatif', indikator_kuantitatif:'Min. 12 video dokumenter per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:9, division_id:3, name:'MLD (Media Lembaga Dakwah)', description:'Penerbitan buletin dakwah dan produksi konten media lembaga secara berkala.', dasar:'QS. Al-Qalam: 1', tujuan:'Menyebarkan informasi dan konten dakwah melalui media cetak dan digital', sasaran:'Mahasiswa dan civitas akademika UMMI', waktu:'Bulanan', tempat:'Kampus UMMI', anggaran_optimis:3000000, anggaran_realistis:2500000, penanggung_jawab:'Adiwijaya', indikator_kualitatif:'Buletin informatif dan diminati pembaca', indikator_kuantitatif:'Min. 10 edisi buletin/tahun, 500 eksemplar/edisi', status:'aktif', created_at:'2024-01-10' },
      { id:10, division_id:3, name:'Pelatihan Editing', description:'Pelatihan desain grafis dan editing video untuk meningkatkan kapasitas anggota bidang media.', dasar:'Meningkatkan kompetensi anggota', tujuan:'Meningkatkan kemampuan teknis anggota dalam produksi konten', sasaran:'Anggota Bidang Media dan LDK', waktu:'Semester 1 dan 2 tahun 2024', tempat:'Lab Komputer UMMI', anggaran_optimis:2500000, anggaran_realistis:2000000, penanggung_jawab:'Muhamad Gilang El-Fatta', indikator_kualitatif:'Anggota mampu memproduksi konten secara mandiri', indikator_kuantitatif:'Min. 2 pelatihan/semester, min. 20 peserta/pelatihan', status:'aktif', created_at:'2024-01-10' },
      // Syiar
      { id:11, division_id:4, name:'Gema Syiar Islam', description:'Kompetisi islami yang mencakup berbagai cabang lomba untuk mengasah dan menampilkan bakat Islami mahasiswa.', dasar:'QS. Al-Maidah: 2', tujuan:'Mengembangkan bakat Islami mahasiswa melalui kompetisi yang sehat', sasaran:'Mahasiswa UMMI dan umum', waktu:'Semester 2 tahun 2024', tempat:'Kampus UMMI', anggaran_optimis:12000000, anggaran_realistis:8000000, penanggung_jawab:'Jeantly Alham Taqwana', indikator_kualitatif:'Event berlangsung meriah dan bermartabat', indikator_kuantitatif:'Min. 100 peserta, 5 cabang lomba, 3 sponsor', status:'aktif', created_at:'2024-01-10' },
      { id:12, division_id:4, name:'Tabligh Akbar', description:'Acara tabligh akbar yang menghadirkan penceramah berkaliber nasional untuk syiar Islam di kampus.', dasar:'QS. Ali Imran: 104', tujuan:'Menyelenggarakan kajian besar yang berdampak luas', sasaran:'Mahasiswa, civitas akademika UMMI, dan masyarakat umum', waktu:'Semester 1 tahun 2024', tempat:'Masjid / Aula besar UMMI', anggaran_optimis:20000000, anggaran_realistis:15000000, penanggung_jawab:'Siti Sarah', indikator_kualitatif:'Acara berlangsung khidmat dan meninggalkan kesan mendalam', indikator_kuantitatif:'Min. 500 peserta hadir', status:'aktif', created_at:'2024-01-10' },
      { id:13, division_id:4, name:'Silih Asih Silih Asuh (Bakti Sosial)', description:'Program bakti sosial untuk mendekatkan LDK dengan masyarakat sekitar kampus melalui berbagai kegiatan sosial.', dasar:'QS. Al-Ma\'un: 1-7', tujuan:'Memberikan manfaat nyata kepada masyarakat sekitar kampus', sasaran:'Masyarakat dhuafa sekitar kampus UMMI', waktu:'Semester 1 dan 2 tahun 2024', tempat:'Lingkungan sekitar kampus UMMI', anggaran_optimis:7000000, anggaran_realistis:5000000, penanggung_jawab:'Liri', indikator_kualitatif:'Terciptanya hubungan baik LDK dengan masyarakat', indikator_kuantitatif:'Min. 100 penerima manfaat, 2 kali per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:14, division_id:4, name:'GEN-Q', description:'Program pembinaan komprehensif meliputi tilawah, tahfidz, dakwah, kaligrafi, dan podcast untuk regenerasi kader.', dasar:'QS. Al-Alaq: 1-5', tujuan:'Mencetak kader LDK yang berdedikasi dan berkompetensi tinggi', sasaran:'Anggota dan kader LDK Al Umm', waktu:'Sepanjang tahun 2024', tempat:'Kampus UMMI', anggaran_optimis:6000000, anggaran_realistis:4500000, penanggung_jawab:'Encep', indikator_kualitatif:'Kader memiliki kemampuan dakwah yang komprehensif', indikator_kuantitatif:'Min. 30 kader aktif, 5 program pembinaan berjalan', status:'aktif', created_at:'2024-01-10' },
      // Kemuslimahan
      { id:15, division_id:5, name:'Kajian Kemuslimahan Bulanan', description:'Kajian rutin bulanan yang membahas isu-isu kemuslimahan, fikih perempuan, dan pengembangan diri muslimah.', dasar:'QS. An-Nahl: 97', tujuan:'Meningkatkan pemahaman keislaman muslimah kampus', sasaran:'Mahasiswi UMMI dan umum', waktu:'Setiap bulan, minggu ke-2', tempat:'Masjid / Ruangan Kampus UMMI', anggaran_optimis:2000000, anggaran_realistis:1500000, penanggung_jawab:'Susilawati', indikator_kualitatif:'Muslimah semakin paham akan peran dan kewajibannya', indikator_kuantitatif:'Min. 40 peserta per kajian, 12 kajian per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:16, division_id:5, name:'Seminar Kemuslimahan', description:'Seminar berskala besar tentang topik kemuslimahan yang relevan dengan isu-isu kontemporer.', dasar:'Urgensi peningkatan pemahaman muslimah', tujuan:'Memberikan wawasan mendalam tentang isu-isu muslimah masa kini', sasaran:'Mahasiswi UMMI dan umum', waktu:'Semester 1 tahun 2024', tempat:'Aula Kampus UMMI', anggaran_optimis:8000000, anggaran_realistis:6000000, penanggung_jawab:'Fadilla Irani', indikator_kualitatif:'Peserta mendapat wawasan baru yang berdampak positif', indikator_kuantitatif:'Min. 200 peserta', status:'aktif', created_at:'2024-01-10' },
      { id:17, division_id:5, name:'Bedah Buku Islami', description:'Forum bedah buku bertema kemuslimahan dan pengembangan diri Islami untuk muslimah.', dasar:'QS. Al-Alaq: 1', tujuan:'Meningkatkan minat baca dan literasi Islami muslimah', sasaran:'Mahasiswi UMMI', waktu:'Per triwulan (4 kali setahun)', tempat:'Perpustakaan/Ruang Kampus UMMI', anggaran_optimis:2500000, anggaran_realistis:2000000, penanggung_jawab:'Windasari', indikator_kualitatif:'Meningkatnya minat baca di kalangan muslimah kampus', indikator_kuantitatif:'Min. 4 buku/tahun, min. 30 peserta/sesi', status:'aktif', created_at:'2024-01-10' },
      // Humas
      { id:18, division_id:6, name:'Forum Diskusi Antar LDK', description:'Forum diskusi dan studi banding dengan LDK dari kampus lain untuk berbagi pengalaman dan best practice.', dasar:'QS. Al-Hujurat: 10', tujuan:'Memperluas jaringan dakwah dan bertukar pengalaman dengan LDK lain', sasaran:'LDK kampus lain di Sukabumi dan sekitarnya', waktu:'Per semester', tempat:'Bergantian antara kampus', anggaran_optimis:3000000, anggaran_realistis:2000000, penanggung_jawab:'Abdul Mujib Muhaimin', indikator_kualitatif:'Terjalinnya hubungan baik dan kerjasama antar LDK', indikator_kuantitatif:'Min. 5 LDK berpartisipasi, 2 forum per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:19, division_id:6, name:'Silaturahmi KOALA & Demisioner', description:'Kegiatan silaturahmi dengan alumni (KOALA) dan demisioner LDK untuk menjaga tali persaudaraan dan mendapatkan masukan.', dasar:'Hadits tentang silaturahmi', tujuan:'Menjaga hubungan baik dengan alumni dan mendapatkan bimbingan', sasaran:'Alumni dan demisioner LDK Al Umm', waktu:'Per semester', tempat:'Kampus UMMI atau tempat yang disepakati', anggaran_optimis:2000000, anggaran_realistis:1500000, penanggung_jawab:'Eliya Mutakin', indikator_kualitatif:'Terjalinnya komunikasi yang baik dengan alumni', indikator_kuantitatif:'Min. 30 alumni hadir, 2 kali per tahun', status:'aktif', created_at:'2024-01-10' },
      { id:20, division_id:6, name:'Siniar Bulanan "Muslim Muda Bicara"', description:'Program podcast/siniar bulanan yang menampilkan diskusi inspiratif tentang isu-isu keislaman dan kepemudaan.', dasar:'Urgensi dakwah di era digital', tujuan:'Menyebarkan konten dakwah yang relevan bagi generasi muda', sasaran:'Mahasiswa dan pemuda Muslim', waktu:'Bulanan', tempat:'Studio/Online', anggaran_optimis:1500000, anggaran_realistis:1200000, penanggung_jawab:'Sabilly', indikator_kualitatif:'Konten berkualitas dan berdampak bagi pendengar', indikator_kuantitatif:'Min. 12 episode per tahun, min. 500 pendengar/episode', status:'aktif', created_at:'2024-01-10' },
    ];
    this.set('work_programs', programs);

    // EVENTS CALENDAR
    const events = [
      { id:1, work_program_id:2, title:'NONGKI - Kajian Bulanan', start_date:'2024-04-20', end_date:'2024-04-20', location:'Masjid Kampus UMMI' },
      { id:2, work_program_id:3, title:'MARHAMAH - Buka Bersama', start_date:'2024-03-25', end_date:'2024-03-25', location:'Masjid Kampus UMMI' },
      { id:3, work_program_id:3, title:'MARHAMAH - Sanlat', start_date:'2024-03-28', end_date:'2024-03-30', location:'Kampus UMMI' },
      { id:4, work_program_id:12, title:'Tabligh Akbar', start_date:'2024-05-15', end_date:'2024-05-15', location:'Aula UMMI' },
      { id:5, work_program_id:11, title:'Gema Syiar Islam', start_date:'2024-08-10', end_date:'2024-08-12', location:'Kampus UMMI' },
      { id:6, work_program_id:15, title:'Kajian Kemuslimahan', start_date:'2024-04-14', end_date:'2024-04-14', location:'Masjid Kampus UMMI' },
      { id:7, work_program_id:4, title:'LDK Berqurban', start_date:'2024-06-17', end_date:'2024-06-17', location:'Kampus UMMI' },
      { id:8, work_program_id:1, title:'HIKMAH - MABIT', start_date:'2024-04-26', end_date:'2024-04-27', location:'Masjid Kampus UMMI' },
      { id:9, work_program_id:16, title:'Seminar Kemuslimahan', start_date:'2024-05-25', end_date:'2024-05-25', location:'Aula Kampus UMMI' },
      { id:10, work_program_id:18, title:'Forum Diskusi Antar LDK', start_date:'2024-05-08', end_date:'2024-05-08', location:'Kampus UMMI' },
    ];
    this.set('events', events);

    // ANNOUNCEMENTS
    const announcements = [
      { id:1, title:'Pendaftaran Kader LDK Al Umm 2024 Dibuka!', content:'Assalamu\'alaikum! Kami membuka pendaftaran kader baru LDK Al Umm UMMI tahun 2024. Daftarkan dirimu sekarang dan jadilah bagian dari lembaga dakwah yang dinamis! Pendaftaran dibuka hingga 30 April 2024.', user_id:1, user_name:'Admin LDK', created_at:'2024-04-01', penting: true },
      { id:2, title:'Tabligh Akbar - "Pemuda Islam di Era Digital"', content:'Hadir dan saksikan Tabligh Akbar LDK Al Umm dengan tema "Pemuda Islam di Era Digital" bersama Ustadz terkemuka. Insya Allah diselenggarakan pada 15 Mei 2024 di Aula Kampus UMMI. Gratis dan terbuka untuk umum!', user_id:4, user_name:'Jeantly Alham Taqwana', created_at:'2024-04-05', penting: true },
      { id:3, title:'Kajian Rutin Bulanan NONGKI - April', content:'Insya Allah kajian bulanan NONGKI akan dilaksanakan pada Sabtu, 20 April 2024 ba\'da Ashar di Masjid Kampus UMMI. Tema: "Produktif di Bulan Syawal". Silakan hadir dan ajak teman-teman!', user_id:2, user_name:'Muhammad Taufiqul Rohman', created_at:'2024-04-10', penting: false },
      { id:4, title:'Open Recruitment Bidang Media', content:'Bidang Media LDK Al Umm membuka kesempatan bagi kamu yang memiliki passion di bidang desain grafis, fotografi, atau videografi. Daftarkan dirimu dan kembangkan potensimu!', user_id:3, user_name:'Muhamad Gilang El-Fatta', created_at:'2024-04-12', penting: false },
      { id:5, title:'Program Geser Seribu Rupiah untuk Qurban', content:'LDK Al Umm mengajak seluruh civitas akademika UMMI untuk berpartisipasi dalam program Geser Seribu Rupiah untuk memfasilitasi qurban bersama. Transfer ke rekening LDK Al Umm. Mari bersama berqurban!', user_id:1, user_name:'Admin LDK', created_at:'2024-04-15', penting: true },
    ];
    this.set('announcements', announcements);

    // BUDGET REPORTS
    const budgets = [
      { id:1, work_program_id:2, realisasi_anggaran:950000, keterangan:'Konsumsi kajian + dekorasi', created_at:'2024-03-20' },
      { id:2, work_program_id:3, realisasi_anggaran:9500000, keterangan:'Konsumsi buka bersama + sanlat', created_at:'2024-03-30' },
      { id:3, work_program_id:7, realisasi_anggaran:1200000, keterangan:'Tools desain dan domain', created_at:'2024-02-28' },
    ];
    this.set('budget_reports', budgets);

    // ACHIEVEMENT INDICATORS
    const achievements = [
      { id:1, work_program_id:2, target_kuantitatif:'50 peserta', realisasi_kuantitatif:'67 peserta', target_kualitatif:'Kajian kondusif', realisasi_kualitatif:'Tercapai, anggota aktif berdiskusi', bulan_tahun:'Maret 2024' },
      { id:2, work_program_id:3, target_kuantitatif:'200 peserta sanlat', realisasi_kuantitatif:'215 peserta', target_kualitatif:'Suasana Ramadhan islami', realisasi_kualitatif:'Tercapai dengan baik', bulan_tahun:'Maret 2024' },
      { id:3, work_program_id:7, target_kuantitatif:'3 konten/minggu', realisasi_kuantitatif:'3-4 konten/minggu', target_kualitatif:'Konten dakwah berkualitas', realisasi_kualitatif:'Engagement meningkat 35%', bulan_tahun:'Q1 2024' },
    ];
    this.set('achievement_indicators', achievements);

    // PROGRAM ACTIVITIES (Dokumentasi)
    const activities = [
      { id:1, work_program_id:2, tgl_pelaksanaan:'2024-03-17', laporan:'Kajian berjalan lancar dengan 67 peserta. Materi disampaikan oleh Ust. Ahmad tentang produktivitas muslim.', foto:null, created_at:'2024-03-17' },
      { id:2, work_program_id:3, tgl_pelaksanaan:'2024-03-25', laporan:'Buka bersama dihadiri 150 orang, suasana kekeluargaan terasa kuat. Donasi takjil terkumpul Rp 2.3 juta.', foto:null, created_at:'2024-03-25' },
    ];
    this.set('program_activities', activities);
  },

  // ---- CRUD ----
  get(key) {
    try { return JSON.parse(localStorage.getItem('ldk_' + key)) || []; }
    catch { return []; }
  },
  set(key, val) { localStorage.setItem('ldk_' + key, JSON.stringify(val)); },
  getOne(key, id) { return this.get(key).find(r => r.id == id); },
  nextId(key) { const d = this.get(key); return d.length ? Math.max(...d.map(r=>r.id)) + 1 : 1; },
  insert(key, obj) {
    const d = this.get(key);
    obj.id = this.nextId(key);
    if (!obj.created_at) obj.created_at = new Date().toISOString().split('T')[0];
    d.push(obj);
    this.set(key, d);
    return obj;
  },
  update(key, id, changes) {
    const d = this.get(key);
    const i = d.findIndex(r => r.id == id);
    if (i >= 0) { d[i] = { ...d[i], ...changes }; this.set(key, d); return d[i]; }
    return null;
  },
  delete(key, id) {
    const d = this.get(key).filter(r => r.id != id);
    this.set(key, d);
  },
  where(key, field, val) { return this.get(key).filter(r => r[field] == val); },
};

// Auth helper
const Auth = {
  current: null,
  init() {
    const saved = localStorage.getItem('ldk_session');
    if (saved) this.current = JSON.parse(saved);
  },
  login(email, password) {
    const users = DB.get('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Email atau password salah.' };
    if (user.status_verifikasi === 'pending') return { ok: false, msg: 'Akun Anda belum diverifikasi oleh admin.' };
    this.current = user;
    localStorage.setItem('ldk_session', JSON.stringify(user));
    return { ok: true };
  },
  logout() { this.current = null; localStorage.removeItem('ldk_session'); },
  register(data) {
    const users = DB.get('users');
    if (users.find(u => u.email === data.email)) return { ok: false, msg: 'Email sudah terdaftar.' };
    const user = DB.insert('users', { ...data, role: 'anggota', status_verifikasi: 'pending' });
    return { ok: true, user };
  },
  can(action) {
    if (!this.current) return false;
    const role = this.current.role;
    if (role === 'admin') return true;
    if (action === 'edit_division') return role === 'ketua';
    if (action === 'post_announcement') return role === 'ketua' || role === 'admin';
    if (action === 'input_achievement') return role === 'ketua' || role === 'pengurus';
    return false;
  }
};
