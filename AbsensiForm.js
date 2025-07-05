function AbsensiForm({ user, type, onSuccess, onCancel }) {
    try {
        const [loading, setLoading] = React.useState(false);
        const [currentPosition, setCurrentPosition] = React.useState(null);
        const [locationStatus, setLocationStatus] = React.useState('Mengambil lokasi...');
        const [showSuccess, setShowSuccess] = React.useState(false);
        const [showCamera, setShowCamera] = React.useState(false);
        const [photo, setPhoto] = React.useState(null);

        React.useEffect(() => {
            getCurrentLocation();
        }, []);

        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCurrentPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        setLocationStatus('Lokasi berhasil didapatkan');
                    },
                    (error) => {
                        console.log('Location error:', error);
                        setLocationStatus('Gagal mendapatkan lokasi');
                    }
                );
            } else {
                setLocationStatus('GPS tidak didukung');
            }
        };

        const handleCameraCapture = (photoData) => {
            setPhoto(photoData);
            setShowCamera(false);
        };

        const handleSubmit = async () => {
            if (!photo) {
                alert('Silakan ambil foto terlebih dahulu');
                return;
            }

            if (!currentPosition) {
                alert('Lokasi belum tersedia, silakan coba lagi');
                return;
            }

            setLoading(true);
            const result = await AbsensiUtils.submitAbsensi(
                user.objectId, 
                type, 
                currentPosition.latitude,
                currentPosition.longitude,
                null, 
                photo
            );
            
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                alert(result.message);
            }
            setLoading(false);
        };

        if (showSuccess) {
            return (
                <div data-name="success-animation" data-file="components/AbsensiForm.js" 
                     className="bg-white rounded-xl card-shadow p-8 text-center success-animation">
                    <div className="text-6xl text-green-500 mb-4">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h3>
                    <p className="text-gray-600">Absensi {type} Anda telah tercatat</p>
                </div>
            );
        }

        const timeInfo = type === 'hadir' ? 'Waktu Masuk' : 'Waktu Pulang';

        return (
            <div data-name="absensi-form" data-file="components/AbsensiForm.js" 
                 className="bg-white rounded-xl card-shadow p-6 slide-in">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Absensi {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <p className="text-gray-600">{timeInfo}</p>
                    
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        Status Lokasi: {locationStatus}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Nama:</p>
                        <p className="font-medium">{user.objectData.nama}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Kelas:</p>
                        <p className="font-medium">{user.objectData.kelas}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Foto Absensi:</p>
                        {photo ? (
                            <img src={photo} alt="Foto Absensi" className="w-24 h-24 object-cover rounded-lg mx-auto" />
                        ) : (
                            <button
                                onClick={() => setShowCamera(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                <i className="fas fa-camera mr-2"></i>
                                Ambil Foto
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !photo}
                        className="flex-1 btn-primary text-white py-3 rounded-lg font-medium disabled:opacity-50"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : 'Konfirmasi Absensi'}
                    </button>
                </div>

                {showCamera && (
                    <CameraCapture 
                        onCapture={handleCameraCapture}
                        onCancel={() => setShowCamera(false)}
                    />
                )}
            </div>
        );
    } catch (error) {
        console.error('AbsensiForm error:', error);
        reportError(error);
        return <div>Error loading absensi form</div>;
    }
}
