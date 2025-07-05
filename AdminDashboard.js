function AdminDashboard({ user, onLogout }) {
    try {
        const [activeTab, setActiveTab] = React.useState('dashboard');
        const [todayStats, setTodayStats] = React.useState({ hadir: 0, terlambat: 0, alpha: 0 });
        const [studentsByClass, setStudentsByClass] = React.useState({});
        const [recentAbsensi, setRecentAbsensi] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [selectedAbsensi, setSelectedAbsensi] = React.useState(null);

        React.useEffect(() => {
            loadAdminData();
            const interval = setInterval(loadAdminData, 30000);
            return () => clearInterval(interval);
        }, []);

        const loadAdminData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const allUsers = await trickleListObjects('user', 100, false);
                const students = allUsers.items.filter(u => u.objectData.role === 'siswa');
                
                const grouped = {};
                students.forEach(student => {
                    const kelas = student.objectData.kelas;
                    if (!grouped[kelas]) grouped[kelas] = [];
                    grouped[kelas].push(student);
                });
                setStudentsByClass(grouped);

                let hadirCount = 0, terlambatCount = 0;
                const recentData = [];

                for (const student of students) {
                    const absensi = await trickleListObjects(`absensi:${student.objectId}`, 10, true);
                    const todayAbsensi = absensi.items.filter(a => a.objectData.date === today);
                    
                    todayAbsensi.forEach(abs => {
                        if (abs.objectData.status === 'hadir') hadirCount++;
                        if (abs.objectData.status === 'terlambat') terlambatCount++;
                        
                                        recentData.push({
                                            ...abs,
                                            studentName: student.objectData.nama,
                                            studentClass: student.objectData.kelas,
                                            studentPhoto: student.objectData.foto
                                        });
                    });
                }

                setTodayStats({
                    hadir: hadirCount,
                    terlambat: terlambatCount,
                    alpha: Math.max(0, students.length - hadirCount - terlambatCount)
                });
                
                setRecentAbsensi(recentData
                    .sort((a, b) => new Date(b.objectData.timestamp) - new Date(a.objectData.timestamp))
                    .slice(0, 15)
                );
            } catch (error) {
                console.error('Load admin data error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleViewAbsensi = (absensi) => {
            setSelectedAbsensi(absensi);
        };

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-blue-500">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        return (
            <div data-name="admin-dashboard" data-file="components/AdminDashboard.js" 
                 className="min-h-screen bg-blue-500">
                <div className="bg-blue-600 text-white p-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard Admin TKJ</h1>
                            <p className="text-blue-100 text-lg">{user.objectData.nama}</p>
                            <div className="text-xs text-blue-200 mt-1">
                                <i className="fas fa-sync-alt mr-1"></i>
                                Data diperbarui otomatis
                            </div>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="bg-white bg-opacity-20 px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-300"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Keluar
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-lg">Hadir Hari Ini</p>
                                    <p className="text-4xl font-bold">{todayStats.hadir}</p>
                                </div>
                                <i className="fas fa-check-circle text-5xl text-green-200"></i>
                            </div>
                        </div>
                        
                        <div className="bg-yellow-500 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-lg">Terlambat</p>
                                    <p className="text-4xl font-bold">{todayStats.terlambat}</p>
                                </div>
                                <i className="fas fa-clock text-5xl text-yellow-200"></i>
                            </div>
                        </div>
                        
                        <div className="bg-red-600 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-lg">Alpha</p>
                                    <p className="text-4xl font-bold">{todayStats.alpha}</p>
                                </div>
                                <i className="fas fa-times-circle text-5xl text-red-200"></i>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-chart-bar mr-2"></i>Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-users mr-2"></i>Kelola Siswa
                        </button>
                        <button
                            onClick={() => setActiveTab('schedules')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'schedules' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-calendar mr-2"></i>Kelola Jadwal
                        </button>
                        <button
                            onClick={() => setActiveTab('izin')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'izin' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-file-medical mr-2"></i>Kelola Izin
                        </button>
                        <button
                            onClick={() => setActiveTab('locations')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'locations' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-map-marker-alt mr-2"></i>Lokasi
                        </button>
                        <button
                            onClick={() => setActiveTab('times')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'times' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-clock mr-2"></i>Waktu
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            <i className="fas fa-cog mr-2"></i>Pengaturan
                        </button>
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AttendanceChart studentsByClass={studentsByClass} />
                            <div className="bg-white rounded-2xl card-shadow p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    <i className="fas fa-clock mr-2 text-blue-600"></i>
                                    Absensi Terbaru (Real-time)
                                </h3>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {recentAbsensi.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {item.studentPhoto ? (
                                                    <img 
                                                        src={item.studentPhoto} 
                                                        alt="Foto" 
                                                        className="w-10 h-10 object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <i className="fas fa-user text-gray-500 text-sm"></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.studentName}</p>
                                                    <p className="text-sm text-gray-600">{item.studentClass} - {item.objectData.type}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(item.objectData.timestamp).toLocaleString('id-ID')}
                                                    </p>
                                                    {item.objectData.helperUserId && (
                                                        <p className="text-xs text-purple-600">Dibantu teman</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    item.objectData.status === 'hadir' ? 'bg-green-100 text-green-800' : 
                                                    item.objectData.status === 'terlambat' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.objectData.status}
                                                </span>
                                                {(item.objectData.photo || item.objectData.locationName) && (
                                                    <button
                                                        onClick={() => handleViewAbsensi(item)}
                                                        className="block text-xs text-blue-600 mt-1 hover:underline"
                                                    >
                                                        <i className="fas fa-eye mr-1"></i>Detail
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {recentAbsensi.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">Belum ada absensi hari ini</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'students' && <StudentManagement onDataChange={loadAdminData} />}
                    {activeTab === 'schedules' && <ScheduleManagement />}
                    {activeTab === 'izin' && <IzinManagement />}
                    {activeTab === 'locations' && <LocationManagement />}
                    {activeTab === 'times' && <TimeManagement />}
                    {activeTab === 'settings' && <SettingsManagement />}
                </div>

                {selectedAbsensi && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-lg font-semibold mb-4">Detail Absensi</h3>
                            <div className="space-y-3">
                                <p><strong>Nama:</strong> {selectedAbsensi.studentName}</p>
                                <p><strong>Kelas:</strong> {selectedAbsensi.studentClass}</p>
                                <p><strong>Type:</strong> {selectedAbsensi.objectData.type}</p>
                                <p><strong>Status:</strong> {selectedAbsensi.objectData.status}</p>
                                <p><strong>Waktu:</strong> {new Date(selectedAbsensi.objectData.timestamp).toLocaleString('id-ID')}</p>
                                {selectedAbsensi.objectData.locationName && (
                                    <p><strong>Lokasi:</strong> {selectedAbsensi.objectData.locationName}</p>
                                )}
                                {selectedAbsensi.objectData.latitude && (
                                    <p><strong>Koordinat:</strong> {selectedAbsensi.objectData.latitude}, {selectedAbsensi.objectData.longitude}</p>
                                )}
                                {selectedAbsensi.objectData.distance && (
                                    <p><strong>Jarak:</strong> {selectedAbsensi.objectData.distance}m</p>
                                )}
                                {selectedAbsensi.objectData.photo && (
                                    <div>
                                        <strong>Foto:</strong>
                                        <img src={selectedAbsensi.objectData.photo} alt="Foto Absensi" className="w-full h-48 object-cover rounded mt-2" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedAbsensi(null)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('AdminDashboard error:', error);
        reportError(error);
        return <div>Error loading admin dashboard</div>;
    }
}
