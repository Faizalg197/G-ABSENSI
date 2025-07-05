function IzinManagement() {
    try {
        const [izinList, setIzinList] = React.useState([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            loadIzinList();
        }, []);

        const loadIzinList = async () => {
            try {
                const allUsers = await trickleListObjects('user', 100, false);
                const students = allUsers.items.filter(u => u.objectData.role === 'siswa');
                
                const allIzin = [];
                for (const student of students) {
                    const izinData = await trickleListObjects(`izin:${student.objectId}`, 50, true);
                    izinData.items.forEach(izin => {
                        allIzin.push({
                            ...izin,
                            studentName: student.objectData.nama,
                            studentClass: student.objectData.kelas
                        });
                    });
                }
                
                setIzinList(allIzin.sort((a, b) => new Date(b.objectData.timestamp) - new Date(a.objectData.timestamp)));
            } catch (error) {
                console.error('Load izin error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleApprove = async (izin) => {
            try {
                await trickleUpdateObject(`izin:${izin.objectData.userId}`, izin.objectId, {
                    ...izin.objectData,
                    status: 'approved'
                });
                loadIzinList();
                alert('Izin disetujui');
            } catch (error) {
                console.error('Approve izin error:', error);
                alert('Gagal menyetujui izin');
            }
        };

        const handleReject = async (izin) => {
            try {
                await trickleUpdateObject(`izin:${izin.objectData.userId}`, izin.objectId, {
                    ...izin.objectData,
                    status: 'rejected'
                });
                loadIzinList();
                alert('Izin ditolak');
            } catch (error) {
                console.error('Reject izin error:', error);
                alert('Gagal menolak izin');
            }
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="izin-management" data-file="components/IzinManagement.js" 
                 className="bg-white rounded-xl card-shadow p-6">
                <h3 className="text-lg font-semibold mb-6">Kelola Pengajuan Izin</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {izinList.map((izin, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-medium">{izin.studentName}</h4>
                                    <p className="text-sm text-gray-600">{izin.studentClass}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    izin.objectData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    izin.objectData.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {izin.objectData.status}
                                </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                                <p><strong>Jenis:</strong> {izin.objectData.type}</p>
                                <p><strong>Tanggal:</strong> {izin.objectData.date}</p>
                                <p><strong>Alasan:</strong> {izin.objectData.reason}</p>
                            </div>

                            {izin.objectData.status === 'pending' && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(izin)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Setujui
                                    </button>
                                    <button
                                        onClick={() => handleReject(izin)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Tolak
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {izinList.length === 0 && (
                        <p className="text-gray-500 text-center py-8">Tidak ada pengajuan izin</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('IzinManagement error:', error);
        reportError(error);
        return <div>Error loading izin management</div>;
    }
}
