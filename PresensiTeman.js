function PresensiTeman({ currentUser, onSuccess, onCancel }) {
    try {
        const [students, setStudents] = React.useState([]);
        const [selectedStudent, setSelectedStudent] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        const [submitting, setSubmitting] = React.useState(false);
        const [activeMode, setActiveMode] = React.useState('absen');
        const [absensiHistory, setAbsensiHistory] = React.useState([]);
        const [izinForm, setIzinForm] = React.useState({ type: 'izin', reason: '', date: new Date().toISOString().split('T')[0] });
        const [showCamera, setShowCamera] = React.useState(false);
        const [photo, setPhoto] = React.useState(null);
        const [currentPosition, setCurrentPosition] = React.useState(null);
        const [absenType, setAbsenType] = React.useState('');

        React.useEffect(() => {
            loadStudents();
            getLocation();
        }, []);

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.log('Location error:', error);
                    }
                );
            }
        };

        const loadStudents = async () => {
            try {
                const users = await trickleListObjects('user', 100, false);
                const studentList = users.items.filter(u => 
                    u.objectData.role === 'siswa' && 
                    u.objectData.kelas === currentUser.objectData.kelas &&
                    u.objectId !== currentUser.objectId
                );
                setStudents(studentList);
            } catch (error) {
                console.error('Load students error:', error);
            } finally {
                setLoading(false);
            }
        };

        const loadAbsensiHistory = async (studentId) => {
            try {
                const history = await AbsensiUtils.getAbsensiHistory(studentId, 10);
                setAbsensiHistory(history);
            } catch (error) {
                console.error('Load absensi history error:', error);
            }
        };

        const handleStudentSelect = (student) => {
            setSelectedStudent(student);
            if (student && activeMode === 'lihat') {
                loadAbsensiHistory(student.objectId);
            }
        };

        const handleCameraCapture = (photoData) => {
            setPhoto(photoData);
            setShowCamera(false);
        };

        const handleSubmitPresensi = async () => {
            if (!selectedStudent) {
                alert('Pilih teman yang akan diabsen');
                return;
            }

            if (!photo) {
                alert('Silakan ambil foto terlebih dahulu');
                return;
            }

            if (!currentPosition) {
                alert('Lokasi belum tersedia');
                return;
            }

            setSubmitting(true);
            const result = await AbsensiUtils.submitAbsensi(
                selectedStudent.objectId, 
                absenType, 
                currentPosition.latitude,
                currentPosition.longitude,
                currentUser.objectId,
                photo
            );

            if (result.success) {
                alert(`Presensi ${absenType} untuk ${selectedStudent.objectData.nama} berhasil`);
                setPhoto(null);
                setAbsenType('');
                onSuccess();
            } else {
                alert(result.message);
            }
            setSubmitting(false);
        };

        const handleSubmitIzin = async () => {
            if (!selectedStudent) {
                alert('Pilih teman yang akan diajukan izin');
                return;
            }

            setSubmitting(true);
            const result = await AbsensiUtils.submitIzin(
                selectedStudent.objectId,
                izinForm.type,
                `Diajukan oleh ${currentUser.objectData.nama}: ${izinForm.reason}`,
                izinForm.date
            );

            if (result.success) {
                alert(`Pengajuan ${izinForm.type} untuk ${selectedStudent.objectData.nama} berhasil`);
                onSuccess();
            } else {
                alert(result.message);
            }
            setSubmitting(false);
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="presensi-teman" data-file="components/PresensiTeman.js" 
                 className="bg-white rounded-2xl card-shadow p-6 slide-in">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Presensi Teman</h3>
                    <p className="text-gray-600">Bantu teman sekelas untuk absensi</p>
                </div>

                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => setActiveMode('absen')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium ${activeMode === 'absen' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Absen
                    </button>
                    <button
                        onClick={() => setActiveMode('izin')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium ${activeMode === 'izin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Ajukan Izin
                    </button>
                    <button
                        onClick={() => setActiveMode('lihat')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium ${activeMode === 'lihat' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Lihat Absensi
                    </button>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Pilih Teman</label>
                    <select
                        value={selectedStudent?.objectId || ''}
                        onChange={(e) => {
                            const student = students.find(s => s.objectId === e.target.value);
                            handleStudentSelect(student);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Pilih Teman --</option>
                        {students.map((student) => (
                            <option key={student.objectId} value={student.objectId}>
                                {student.objectData.nama} - {student.objectData.username}
                            </option>
                        ))}
                    </select>
                </div>

                {activeMode === 'absen' && selectedStudent && (
                    <div>
                        {photo ? (
                            <div className="mb-4 text-center">
                                <img src={photo} alt="Foto Absensi" className="w-32 h-32 object-cover rounded-lg mx-auto mb-2" />
                                <button onClick={() => setPhoto(null)} className="text-sm text-blue-600">Ambil ulang foto</button>
                            </div>
                        ) : (
                            <div className="mb-4 text-center">
                                <p className="text-gray-600 mb-2">Ambil foto untuk absensi teman</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setAbsenType('hadir');
                                            setShowCamera(true);
                                        }}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                                    >
                                        Foto Hadir
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAbsenType('pulang');
                                            setShowCamera(true);
                                        }}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                                    >
                                        Foto Pulang
                                    </button>
                                </div>
                            </div>
                        )}

                        {photo && (
                            <div className="flex space-x-4">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmitPresensi}
                                    disabled={submitting}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                                >
                                    {submitting ? <LoadingSpinner size="sm" /> : `Konfirmasi ${absenType}`}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeMode === 'izin' && selectedStudent && (
                    <div className="space-y-4">
                        <select
                            value={izinForm.type}
                            onChange={(e) => setIzinForm({...izinForm, type: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg"
                        >
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                        </select>
                        <input
                            type="date"
                            value={izinForm.date}
                            onChange={(e) => setIzinForm({...izinForm, date: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                        <textarea
                            value={izinForm.reason}
                            onChange={(e) => setIzinForm({...izinForm, reason: e.target.value})}
                            className="w-full px-4 py-3 border rounded-lg"
                            rows="3"
                            placeholder="Alasan izin/sakit"
                        />
                        <div className="flex space-x-4">
                            <button onClick={onCancel} className="flex-1 bg-gray-300 py-3 rounded-lg">Batal</button>
                            <button onClick={handleSubmitIzin} disabled={submitting} className="flex-1 bg-orange-600 text-white py-3 rounded-lg">
                                {submitting ? <LoadingSpinner size="sm" /> : 'Ajukan Izin'}
                            </button>
                        </div>
                    </div>
                )}

                {activeMode === 'lihat' && selectedStudent && (
                    <div className="max-h-64 overflow-y-auto">
                        {absensiHistory.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                                <div>
                                    <p className="font-medium">{item.objectData.type}</p>
                                    <p className="text-sm text-gray-600">{item.objectData.date}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs ${
                                    item.objectData.status === 'hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {item.objectData.status}
                                </span>
                            </div>
                        ))}
                        <button onClick={onCancel} className="w-full bg-gray-300 py-3 rounded-lg mt-4">Tutup</button>
                    </div>
                )}

                {showCamera && (
                    <CameraCapture 
                        onCapture={handleCameraCapture}
                        onCancel={() => setShowCamera(false)}
                    />
                )}
            </div>
        );
    } catch (error) {
        console.error('PresensiTeman error:', error);
        reportError(error);
        return <div>Error loading presensi teman</div>;
    }
}
