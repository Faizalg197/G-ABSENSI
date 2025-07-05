function TimeManagement() {
    try {
        const [students, setStudents] = React.useState([]);
        const [timeSettings, setTimeSettings] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [newTimeSetting, setNewTimeSetting] = React.useState({
            userId: '', jamMasuk: '05:00-07:30', jamPulang: '15:00-17:00'
        });

        React.useEffect(() => {
            loadData();
        }, []);

        const loadData = async () => {
            try {
                const usersData = await trickleListObjects('user', 100, false);
                const students = usersData.items.filter(u => u.objectData.role === 'siswa');
                setStudents(students);

                const allTimeSettings = [];
                for (const student of students) {
                    const settings = await trickleListObjects(`time_settings:${student.objectId}`, 10, false);
                    if (settings.items.length > 0) {
                        allTimeSettings.push({
                            ...settings.items[0],
                            studentName: student.objectData.nama,
                            studentClass: student.objectData.kelas
                        });
                    }
                }
                setTimeSettings(allTimeSettings);
            } catch (error) {
                console.error('Load data error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleAddTimeSetting = async (e) => {
            e.preventDefault();
            try {
                await trickleCreateObject(`time_settings:${newTimeSetting.userId}`, {
                    userId: newTimeSetting.userId,
                    jamMasuk: newTimeSetting.jamMasuk,
                    jamPulang: newTimeSetting.jamPulang
                });
                
                setNewTimeSetting({ userId: '', jamMasuk: '05:00-07:30', jamPulang: '15:00-17:00' });
                setShowAddForm(false);
                loadData();
                alert('Pengaturan waktu berhasil ditambahkan');
            } catch (error) {
                console.error('Add time setting error:', error);
                alert('Gagal menambahkan pengaturan waktu');
            }
        };

        const handleDeleteTimeSetting = async (setting) => {
            if (confirm(`Hapus pengaturan waktu untuk ${setting.studentName}?`)) {
                try {
                    await trickleDeleteObject(`time_settings:${setting.objectData.userId}`, setting.objectId);
                    loadData();
                    alert('Pengaturan waktu berhasil dihapus');
                } catch (error) {
                    console.error('Delete time setting error:', error);
                    alert('Gagal menghapus pengaturan waktu');
                }
            }
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="time-management" data-file="components/TimeManagement.js" 
                 className="bg-white rounded-2xl card-shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Kelola Waktu Absensi Individual</h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        <i className="fas fa-plus mr-2"></i>Tambah Pengaturan
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddTimeSetting} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                        <select
                            value={newTimeSetting.userId}
                            onChange={(e) => setNewTimeSetting({...newTimeSetting, userId: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Pilih Siswa</option>
                            {students.map(student => (
                                <option key={student.objectId} value={student.objectId}>
                                    {student.objectData.nama} - {student.objectData.kelas}
                                </option>
                            ))}
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Jam Masuk (05:00-07:30)"
                                value={newTimeSetting.jamMasuk}
                                onChange={(e) => setNewTimeSetting({...newTimeSetting, jamMasuk: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Jam Pulang (15:00-17:00)"
                                value={newTimeSetting.jamPulang}
                                onChange={(e) => setNewTimeSetting({...newTimeSetting, jamPulang: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                Simpan
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} 
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg">
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Siswa</th>
                                <th className="text-left p-3">Jam Masuk</th>
                                <th className="text-left p-3">Jam Pulang</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeSettings.map((setting, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        {setting.studentName} ({setting.studentClass})
                                    </td>
                                    <td className="p-3">{setting.objectData.jamMasuk}</td>
                                    <td className="p-3">{setting.objectData.jamPulang}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteTimeSetting(setting)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } catch (error) {
        console.error('TimeManagement error:', error);
        return <div>Error loading time management</div>;
    }
}