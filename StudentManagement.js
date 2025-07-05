function StudentManagement({ onDataChange }) {
    try {
        const [students, setStudents] = React.useState([]);
        const [filteredStudents, setFilteredStudents] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [selectedClass, setSelectedClass] = React.useState('');
        const [showPassword, setShowPassword] = React.useState(false);
        const [newStudent, setNewStudent] = React.useState({ username: '', nama: '', kelas: '', password: '', foto: '' });

        React.useEffect(() => {
            loadStudents();
        }, []);

        React.useEffect(() => {
            if (selectedClass) {
                setFilteredStudents(students.filter(s => s.objectData.kelas === selectedClass));
            } else {
                setFilteredStudents(students);
            }
        }, [selectedClass, students]);

        const loadStudents = async () => {
            try {
                const users = await trickleListObjects('user', 100, false);
                const studentList = users.items.filter(u => u.objectData.role === 'siswa');
                setStudents(studentList);
                setFilteredStudents(studentList);
            } catch (error) {
                console.error('Load students error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleFileUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setNewStudent({...newStudent, foto: e.target.result});
                };
                reader.readAsDataURL(file);
            }
        };

        const handleAddStudent = async (e) => {
            e.preventDefault();
            try {
                const existingUsers = await trickleListObjects('user', 100, false);
                const usernameExists = existingUsers.items.some(u => u.objectData.username === newStudent.username);
                
                if (usernameExists) {
                    alert('Username sudah terdaftar');
                    return;
                }

                await trickleCreateObject('user', {
                    ...newStudent,
                    role: 'siswa',
                    createdAt: new Date().toISOString()
                });
                
                setNewStudent({ username: '', nama: '', kelas: '', password: '', foto: '' });
                setShowAddForm(false);
                loadStudents();
                if (onDataChange) onDataChange();
                alert('Siswa berhasil ditambahkan');
            } catch (error) {
                console.error('Add student error:', error);
                alert('Gagal menambahkan siswa');
            }
        };

        const handleDeleteStudent = async (student) => {
            if (confirm(`Hapus akun siswa ${student.objectData.nama}?\n\nPeringatan: Semua data absensi dan izin siswa ini akan ikut terhapus!`)) {
                try {
                    await trickleDeleteObject('user', student.objectId);
                    loadStudents();
                    if (onDataChange) onDataChange();
                    alert('Akun siswa berhasil dihapus');
                } catch (error) {
                    console.error('Delete student error:', error);
                    alert('Gagal menghapus siswa');
                }
            }
        };

        const classes = ['X-RPL', 'XI-RPL', 'XII-RPL', 'X-TKJ', 'XI-TKJ', 'XII-TKJ', 'X-AKT', 'XI-AKT', 'XII-AKT', 'X-TBSM', 'XI-TBSM', 'XII-TBSM', 'X-TKR', 'XI-TKR', 'XII-TKR'];

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="student-management" data-file="components/StudentManagement.js" 
                 className="bg-white rounded-2xl card-shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Kelola Data Siswa ({students.length} siswa)</h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Tambah Siswa
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
                    <form onSubmit={handleAddStudent} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={newStudent.username}
                                onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nama Lengkap"
                                value={newStudent.nama}
                                onChange={(e) => setNewStudent({...newStudent, nama: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            />
                            <select
                                value={newStudent.kelas}
                                onChange={(e) => setNewStudent({...newStudent, kelas: e.target.value})}
                                className="px-4 py-2 border rounded-lg"
                                required
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={newStudent.password}
                                    onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                                    className="px-4 py-2 border rounded-lg w-full pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Foto Profil (Opsional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="px-4 py-2 border rounded-lg w-full"
                            />
                            {newStudent.foto && (
                                <img src={newStudent.foto} alt="Preview" className="w-16 h-16 object-cover rounded mt-2" />
                            )}
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
                                <th className="text-left p-3">Foto</th>
                                <th className="text-left p-3">Username</th>
                                <th className="text-left p-3">Nama</th>
                                <th className="text-left p-3">Kelas</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        {student.objectData.foto ? (
                                            <img src={student.objectData.foto} alt="Foto" className="w-8 h-8 object-cover rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                <i className="fas fa-user text-gray-500 text-xs"></i>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">{student.objectData.username}</td>
                                    <td className="p-3">{student.objectData.nama}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {student.objectData.kelas}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDeleteStudent(student)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-all"
                                        >
                                            <i className="fas fa-trash mr-1"></i>Hapus
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
        console.error('StudentManagement error:', error);
        reportError(error);
        return <div>Error loading student management</div>;
    }
}
