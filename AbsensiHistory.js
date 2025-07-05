function AbsensiHistory({ user, onCancel }) {
    try {
        const [absensiHistory, setAbsensiHistory] = React.useState([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            loadAbsensiHistory();
        }, []);

        const loadAbsensiHistory = async () => {
            try {
                const history = await AbsensiUtils.getAbsensiHistory(user.objectId, 30);
                setAbsensiHistory(history);
            } catch (error) {
                console.error('Load absensi history error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="absensi-history" data-file="components/AbsensiHistory.js" 
                 className="bg-white rounded-2xl card-shadow p-6 slide-in">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Riwayat Absensi</h3>
                    <p className="text-gray-600">Lihat riwayat absensi Anda</p>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-3">
                    {absensiHistory.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium capitalize">{item.objectData.type}</p>
                                <p className="text-sm text-gray-600">{item.objectData.date}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(item.objectData.timestamp).toLocaleTimeString('id-ID')}
                                </p>
                                {item.objectData.photo && (
                                    <img 
                                        src={item.objectData.photo} 
                                        alt="Foto Absensi" 
                                        className="w-12 h-12 object-cover rounded mt-2"
                                    />
                                )}
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    item.objectData.status === 'hadir' ? 'bg-green-100 text-green-800' :
                                    item.objectData.status === 'terlambat' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {item.objectData.status}
                                </span>
                                {item.objectData.helperUserId && (
                                    <p className="text-xs text-purple-600 mt-1">Dibantu teman</p>
                                )}
                                {item.objectData.location && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        <i className="fas fa-map-marker-alt mr-1"></i>
                                        Lokasi tersimpan
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {absensiHistory.length === 0 && (
                        <div className="text-center py-8">
                            <i className="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                            <p className="text-gray-500">Belum ada riwayat absensi</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onCancel}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium mt-6 transition-all"
                >
                    Tutup
                </button>
            </div>
        );
    } catch (error) {
        console.error('AbsensiHistory error:', error);
        reportError(error);
        return <div>Error loading absensi history</div>;
    }
}
