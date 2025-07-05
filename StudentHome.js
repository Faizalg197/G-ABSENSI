function StudentHome({ user, todayAbsensi, schedules, onNavigate }) {
    try {
        const hasAbsenToday = (type) => {
            return todayAbsensi.some(item => item.objectData.type === type);
        };

        const getTodaySchedules = () => {
            const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
            const dayMap = {
                'Minggu': 'Minggu',
                'Senin': 'Senin', 
                'Selasa': 'Selasa',
                'Rabu': 'Rabu',
                'Kamis': 'Kamis',
                'Jumat': 'Jumat',
                'Sabtu': 'Sabtu'
            };
            return schedules.filter(s => s.objectData.hari === dayMap[today]);
        };

        const todaySchedules = getTodaySchedules();

        return (
            <div data-name="student-home" data-file="components/StudentHome.js" className="space-y-6">
                <TKJWelcomeCard user={user} />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {!hasAbsenToday('hadir') && (
                        <button 
                            onClick={() => onNavigate('absen-hadir')}
                            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl text-sm font-medium transition-all shadow-lg"
                        >
                            <i className="fas fa-sign-in-alt mb-2 block text-lg"></i>
                            Absen Hadir
                        </button>
                    )}
                    
                    {!hasAbsenToday('pulang') && (
                        <button 
                            onClick={() => onNavigate('absen-pulang')}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl text-sm font-medium transition-all shadow-lg"
                        >
                            <i className="fas fa-sign-out-alt mb-2 block text-lg"></i>
                            Absen Pulang
                        </button>
                    )}

                    <button 
                        onClick={() => onNavigate('presensi-teman')}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl text-sm font-medium transition-all shadow-lg"
                    >
                        <i className="fas fa-users mb-2 block text-lg"></i>
                        Presensi Teman
                    </button>

                    <button 
                        onClick={() => onNavigate('izin')}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl text-sm font-medium transition-all shadow-lg"
                    >
                        <i className="fas fa-file-medical mb-2 block text-lg"></i>
                        Ajukan Izin
                    </button>

                    <button 
                        onClick={() => onNavigate('riwayat')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl text-sm font-medium transition-all shadow-lg"
                    >
                        <i className="fas fa-history mb-2 block text-lg"></i>
                        Riwayat Absensi
                    </button>
                </div>

                {todaySchedules.length > 0 && (
                    <div className="bg-white rounded-2xl card-shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
                            Jadwal Pelajaran Hari Ini
                        </h3>
                        <div className="space-y-3">
                            {todaySchedules.map((schedule, index) => (
                                <div key={index} className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div>
                                        <p className="font-semibold text-blue-800">{schedule.objectData.mataPelajaran}</p>
                                        <p className="text-sm text-blue-600">{schedule.objectData.guru}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-blue-800">{schedule.objectData.jam}</p>
                                        <p className="text-sm text-blue-600">{schedule.objectData.hari}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('StudentHome error:', error);
        reportError(error);
        return <div>Error loading home</div>;
    }
}
