function ScheduleManagement() {
    try {
        const [schedules, setSchedules] = React.useState([]);
        const [filteredSchedules, setFilteredSchedules] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [selectedClass, setSelectedClass] = React.useState('');
        const [newSchedule, setNewSchedule] = React.useState({ 
            hari: '', jam: '', mataPelajaran: '', kelas: '', guru: '' 
        });

        React.useEffect(() => {
            loadSchedules();
        }, []);

        React.useEffect(() => {
            if (selectedClass) {
                setFilteredSchedules(schedules.filter(s => s.objectData.kelas === selectedClass));
            } else {
                setFilteredSchedules(schedules);
            }
        }, [selectedClass, schedules]);

        const loadSchedules = async () => {
            try {
                const scheduleList = await trickleListObjects('schedule', 100, false);
                setSchedules(scheduleList.items);
                setFilteredSchedules(scheduleList.items);
            } catch (error) {
                console.error('Load schedules error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleAddSchedule = async (e) => {
            e.preventDefault();
            try {
                await trickleCreateObject('schedule', {
                    ...newSchedule,
                    createdAt: new Date().toISOString()
                });
                
                setNewSchedule({ hari: '', jam: '', mataPelajaran: '', kelas: '', guru: '' });
                setShowAddForm(false);
                loadSchedules();
                alert('Jadwal berhasil ditambahkan');
            } catch (error) {
                console.error('Add schedule error:', error);
                alert('Gagal menambahkan jadwal');
            }
        };

        const handleDeleteSchedule = async (schedule) => {
            if (confirm(`Hapus jadwal ${schedule.objectData.mataPelajaran}?`)) {
                try {
                    await trickleDeleteObject('schedule', schedule.objectId);
                    loadSchedules();
                    alert('Jadwal berhasil dihapus');
                } catch (error) {
                    console.error('Delete schedule error:', error);
                    alert('Gagal menghapus jadwal');
                }
            }
        };

        const classes = ['X-RPL', 'XI-RPL', 'XII-RPL', 'X-TKJ', 'XI-TKJ', 'XII-TKJ', 'X-AKT', 'XI-AKT', 'XII-AKT', 'X-TBSM', 'XI-TBSM', 'XII-TBSM', 'X-TKR', 'XI-TKR', 'XII-TKR'];

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="schedule-management" data-file="components/ScheduleManagement.js" 
                 className="bg-white rounded-2xl card-shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Kelola Jadwal Pelajaran</h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Jadwal
                    </button>
                </div>

                <div className="mb-4">
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Semua Kelas</option>
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddSchedule} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={newSchedule.hari}
                                onChange={(e) => setNewSchedule({...newSchedule, hari: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            >
                                <option value="">Pilih Hari</option>
                                <option value="Senin">Senin</option>
                                <option value="Selasa">Selasa</option>
                                <option value="Rabu">Rabu</option>
                                <option value="Kamis">Kamis</option>
                                <option value="Jumat">Jumat</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Jam (08:00-09:30)"
                                value={newSchedule.jam}
                                onChange={(e) => setNewSchedule({...newSchedule, jam: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Mata Pelajaran"
                                value={newSchedule.mataPelajaran}
                                onChange={(e) => setNewSchedule({...newSchedule, mataPelajaran: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <select
                                value={newSchedule.kelas}
                                onChange={(e) => setNewSchedule({...newSchedule, kelas: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Nama Guru"
                                value={newSchedule.guru}
                                onChange={(e) => setNewSchedule({...newSchedule, guru: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                Simpan
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowAddForm(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Hari</th>
                                <th className="text-left p-3">Jam</th>
                                <th className="text-left p-3">Mata Pelajaran</th>
                                <th className="text-left p-3">Kelas</th>
                                <th className="text-left p-3">Guru</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{schedule.objectData.hari}</td>
                                    <td className="p-3">{schedule.objectData.jam}</td>
                                    <td className="p-3">{schedule.objectData.mataPelajaran}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {schedule.objectData.kelas}
                                        </span>
                                    </td>
                                    <td className="p-3">{schedule.objectData.guru}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-all"
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
        console.error('ScheduleManagement error:', error);
        reportError(error);
        return <div>Error loading schedule management</div>;
    }
}
