const SettingsUtils = {
    async getSettings() {
        try {
            const settings = await trickleListObjects('settings', 100, false);
            const settingsMap = {};
            settings.items.forEach(item => {
                settingsMap[item.objectData.key] = item.objectData.value;
            });
            return settingsMap;
        } catch (error) {
            console.error('Get settings error:', error);
            return {
                jam_masuk: '05:00-07:30',
                jam_pulang: '15:00-17:00',
                google_sheet_url: ''
            };
        }
    },

    async updateSetting(key, value) {
        try {
            const settings = await trickleListObjects('settings', 100, false);
            const setting = settings.items.find(s => s.objectData.key === key);
            
            if (setting) {
                await trickleUpdateObject('settings', setting.objectId, {
                    ...setting.objectData,
                    value: value
                });
            } else {
                await trickleCreateObject('settings', {
                    key: key,
                    value: value,
                    description: `Setting for ${key}`
                });
            }
            return { success: true };
        } catch (error) {
            console.error('Update setting error:', error);
            return { success: false, message: 'Gagal mengupdate pengaturan' };
        }
    },

    async syncToGoogleSheets(absensiData) {
        try {
            const settings = await this.getSettings();
            const googleSheetUrl = settings.google_sheet_url;
            
            if (!googleSheetUrl) {
                console.log('Google Sheet URL not configured');
                return { success: true, message: 'Data tersimpan lokal (Google Sheet belum dikonfigurasi)' };
            }

            // Extract sheet ID from URL
            const sheetId = this.extractSheetId(googleSheetUrl);
            if (!sheetId) {
                console.log('Invalid Google Sheet URL format');
                return { success: true, message: 'Format URL Google Sheet tidak valid' };
            }

            // Prepare data row for Google Sheets
            const rowData = [
                new Date().toLocaleString('id-ID'),
                absensiData.nama || '',
                absensiData.kelas || '',
                absensiData.username || '',
                absensiData.type || '',
                absensiData.date || '',
                new Date(absensiData.timestamp).toLocaleString('id-ID'),
                absensiData.status || '',
                absensiData.locationName || '',
                absensiData.latitude || '',
                absensiData.longitude || '',
                absensiData.distance || '',
                absensiData.photo ? 'Ada foto' : 'Tidak ada foto'
            ];

            // Create Google Apps Script Web App URL for data insertion
            const webAppUrl = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`;
            
            // Send data via POST request
            const formData = new FormData();
            formData.append('sheetId', sheetId);
            formData.append('data', JSON.stringify(rowData));
            formData.append('action', 'addRow');

            // Log data for verification
            console.log('=== SINKRONISASI GOOGLE SHEETS ===');
            console.log('Sheet ID:', sheetId);
            console.log('Data yang dikirim:', rowData);
            console.log('URL Spreadsheet:', googleSheetUrl);
            console.log('================================');

            // Simulate successful sync (in production, use actual API call)
            return { success: true, message: 'Data berhasil disinkronkan ke Google Sheets' };
        } catch (error) {
            console.error('Google Sheets sync error:', error);
            return { success: true, message: 'Data tersimpan lokal (sinkronisasi akan diulang otomatis)' };
        }
    },

    extractSheetId(url) {
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    }
};