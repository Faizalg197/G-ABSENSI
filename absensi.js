const AbsensiUtils = {
    async checkTimeValidation(type, userId) {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour * 60 + minute;
        
        try {
            // Get individual time settings for user
            const timeSettings = await trickleListObjects(`time_settings:${userId}`, 10, false);
            let jamMasuk = '05:00-07:30';
            let jamPulang = '15:00-17:00';
            
            if (timeSettings.items.length > 0) {
                const settings = timeSettings.items[0].objectData;
                jamMasuk = settings.jamMasuk || '05:00-07:30';
                jamPulang = settings.jamPulang || '15:00-17:00';
            }
            
            if (type === 'hadir') {
                const [startStr, endStr] = jamMasuk.split('-');
                const [startHour, startMin] = startStr.split(':').map(Number);
                const [endHour, endMin] = endStr.split(':').map(Number);
                const startTime = startHour * 60 + startMin;
                const endTime = endHour * 60 + endMin;
                
                if (currentTime >= startTime && currentTime <= endTime) {
                    return 'hadir';
                } else if (currentTime > endTime) {
                    return 'terlambat';
                }
            } else if (type === 'pulang') {
                const [startStr, endStr] = jamPulang.split('-');
                const [startHour, startMin] = startStr.split(':').map(Number);
                const [endHour, endMin] = endStr.split(':').map(Number);
                const startTime = startHour * 60 + startMin;
                const endTime = endHour * 60 + endMin;
                return currentTime >= startTime && currentTime <= endTime ? 'hadir' : 'terlambat';
            }
        } catch (error) {
            console.error('Time validation error:', error);
        }
        return 'invalid';
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    async checkLocationValidation(userId, currentLat, currentLon) {
        try {
            const locations = await trickleListObjects('student_locations', 100, false);
            const userLocation = locations.items.find(loc => loc.objectData.userId === userId);
            
            if (!userLocation) {
                return { valid: false, message: 'Lokasi absensi belum diatur oleh admin' };
            }
            
            const distance = this.calculateDistance(
                currentLat, currentLon,
                userLocation.objectData.latitude, userLocation.objectData.longitude
            );
            
            const allowedRadius = userLocation.objectData.radius || 200;
            
            if (distance <= allowedRadius) {
                return { valid: true, location: userLocation.objectData.locationName, distance: Math.round(distance) };
            } else {
                return { 
                    valid: false, 
                    message: `Anda berada ${Math.round(distance)}m dari lokasi yang diizinkan. Maksimal jarak ${allowedRadius}m`,
                    distance: Math.round(distance)
                };
            }
        } catch (error) {
            console.error('Location validation error:', error);
            return { valid: false, message: 'Gagal memvalidasi lokasi' };
        }
    },

    async submitAbsensi(userId, type, currentLat, currentLon, helperUserId = null, photo = null) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Check location first
            const locationCheck = await this.checkLocationValidation(userId, currentLat, currentLon);
            if (!locationCheck.valid) {
                return { success: false, message: locationCheck.message };
            }
            
            // Check time
            const status = await this.checkTimeValidation(type, userId);
            if (status === 'invalid') {
                return { success: false, message: 'Waktu absensi tidak valid' };
            }

            const absensiData = {
                userId,
                type,
                date: today,
                timestamp: new Date().toISOString(),
                status,
                locationName: locationCheck.location,
                latitude: currentLat,
                longitude: currentLon,
                distance: locationCheck.distance,
                helperUserId: helperUserId || null,
                photo: photo || null
            };

            const absensi = await trickleCreateObject(`absensi:${userId}`, absensiData);
            
            // Get user data for Google Sheets
            const user = await trickleGetObject('user', userId);
            
            // Sync to Google Sheets with complete data
            try {
                await SettingsUtils.syncToGoogleSheets({
                    nama: user.objectData.nama,
                    kelas: user.objectData.kelas,
                    username: user.objectData.username,
                    type: absensiData.type,
                    date: absensiData.date,
                    timestamp: absensiData.timestamp,
                    status: absensiData.status,
                    locationName: absensiData.locationName,
                    latitude: absensiData.latitude,
                    longitude: absensiData.longitude,
                    distance: absensiData.distance,
                    photo: absensiData.photo
                });
            } catch (error) {
                console.log('Google Sheets sync failed:', error);
            }
            
            return { success: true, absensi, status };
        } catch (error) {
            console.error('Absensi error:', error);
            return { success: false, message: 'Gagal menyimpan absensi' };
        }
    },

    async submitIzin(userId, type, reason, date) {
        try {
            const izinData = {
                userId,
                type, // 'sakit' atau 'izin'
                reason,
                date,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            const izin = await trickleCreateObject(`izin:${userId}`, izinData);
            return { success: true, izin };
        } catch (error) {
            console.error('Izin error:', error);
            return { success: false, message: 'Gagal mengajukan izin' };
        }
    },

    async getAbsensiHistory(userId, limit = 10) {
        try {
            const absensiList = await trickleListObjects(`absensi:${userId}`, limit, true);
            return absensiList.items;
        } catch (error) {
            console.error('Get absensi history error:', error);
            return [];
        }
    },

    async getTodayAbsensi(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const absensiList = await trickleListObjects(`absensi:${userId}`, 50, true);
            
            return absensiList.items.filter(item => 
                item.objectData.date === today
            );
        } catch (error) {
            console.error('Get today absensi error:', error);
            return [];
        }
    },

    async getUserLocation(userId) {
        try {
            const locations = await trickleListObjects('student_locations', 100, false);
            const userLocation = locations.items.find(loc => loc.objectData.userId === userId);
            return userLocation ? userLocation.objectData : null;
        } catch (error) {
            console.error('Get user location error:', error);
            return null;
        }
    }
};
