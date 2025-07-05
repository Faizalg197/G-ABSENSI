function SettingsManagement() {
    try {
        const [settings, setSettings] = React.useState({});
        const [loading, setLoading] = React.useState(true);
        const [saving, setSaving] = React.useState(false);

        React.useEffect(() => {
            loadSettings();
        }, []);

        const loadSettings = async () => {
            try {
                const settingsData = await SettingsUtils.getSettings();
                setSettings(settingsData);
            } catch (error) {
                console.error('Load settings error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleSaveSetting = async (key, value) => {
            setSaving(true);
            const result = await SettingsUtils.updateSetting(key, value);
            if (result.success) {
                setSettings({...settings, [key]: value});
                alert('Pengaturan berhasil disimpan');
            } else {
                alert(result.message);
            }
            setSaving(false);
        };

        const handleTestGoogleSheets = async () => {
            const testData = {
                nama: 'Test User TKJ',
                kelas: 'XII-TKJ-1',
                username: 'testuser',
                type: 'hadir',
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                status: 'hadir',
                locationName: 'SMK Negeri 2 Paguyaman',
                latitude: -6.2088,
                longitude: 106.8456,
                distance: 50,
                photo: null
            };
            
            const result = await SettingsUtils.syncToGoogleSheets(testData);
            alert(`Test koneksi: ${result.message}\n\nSilakan periksa console browser untuk melihat data yang akan dikirim ke Google Sheets.`);
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="settings-management" data-file="components/SettingsManagement.js" 
                 className="bg-white rounded-2xl card-shadow p-6">
                <h3 className="text-lg font-semibold mb-6">
                    <i className="fas fa-cog mr-2 text-blue-600"></i>
                    Pengaturan Sistem
                </h3>

                <div className="space-y-6">
                    <div className="border-b pb-4">
                        <h4 className="font-medium mb-3">Jam Absensi</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Jam Masuk</label>
                                <input
                                    type="text"
                                    value={settings.jam_masuk || ''}
                                    onChange={(e) => setSettings({...settings, jam_masuk: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="05:00-07:30"
                                />
                                <button
                                    onClick={() => handleSaveSetting('jam_masuk', settings.jam_masuk)}
                                    disabled={saving}
                                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Simpan
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Jam Pulang</label>
                                <input
                                    type="text"
                                    value={settings.jam_pulang || ''}
                                    onChange={(e) => setSettings({...settings, jam_pulang: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="15:00-17:00"
                                />
                                <button
                                    onClick={() => handleSaveSetting('jam_pulang', settings.jam_pulang)}
                                    disabled={saving}
                                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Integrasi Google Sheets</h4>
                        <div>
                            <label className="block text-sm font-medium mb-2">URL Google Spreadsheet</label>
                            <input
                                type="url"
                                value={settings.google_sheet_url || ''}
                                onChange={(e) => setSettings({...settings, google_sheet_url: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                            />
                            <div className="flex space-x-2 mt-2">
                                <button
                                    onClick={() => handleSaveSetting('google_sheet_url', settings.google_sheet_url)}
                                    disabled={saving}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Simpan URL
                                </button>
                                <button
                                    onClick={handleTestGoogleSheets}
                                    className="bg-orange-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Test Koneksi
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Format URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit<br/>
                                Data akan ditampilkan di console browser untuk verifikasi.
                            </p>
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                <strong>Header Tabel Otomatis:</strong><br/>
                                <div className="font-mono text-xs mt-1">
                                    Timestamp | Nama | Kelas | Username | Tipe | Tanggal | Waktu | Status | Lokasi | Latitude | Longitude | Jarak | Foto
                                </div>
                            </div>
                            <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                                <strong>Fitur Otomatis:</strong><br/>
                                • Tabel akan dibuat otomatis dengan header yang sesuai<br/>
                                • Data absensi langsung masuk ke baris baru<br/>
                                • Format waktu disesuaikan dengan zona Indonesia
                            </div>
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                                <strong>Catatan:</strong> Sistem akan tetap menyimpan data lokal meskipun sinkronisasi gagal.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('SettingsManagement error:', error);
        reportError(error);
        return <div>Error loading settings management</div>;
    }
}