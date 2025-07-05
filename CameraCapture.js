function CameraCapture({ onCapture, onCancel }) {
    try {
        const videoRef = React.useRef(null);
        const [stream, setStream] = React.useState(null);
        const [error, setError] = React.useState('');

        React.useEffect(() => {
            startCamera();
            return () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            };
        }, []);

        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'user' } 
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                setError('Tidak dapat mengakses kamera');
                console.error('Camera error:', err);
            }
        };

        const capturePhoto = () => {
            const canvas = document.createElement('canvas');
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            const photoData = canvas.toDataURL('image/jpeg');
            onCapture(photoData);
        };

        const handleCancel = () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            onCancel();
        };

        return (
            <div data-name="camera-capture" data-file="components/CameraCapture.js" 
                 className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4 text-center">Ambil Foto untuk Absensi</h3>
                    
                    {error ? (
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Tutup
                            </button>
                        </div>
                    ) : (
                        <div>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full rounded-lg mb-4"
                            />
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={capturePhoto}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                                >
                                    <i className="fas fa-camera mr-2"></i>
                                    Ambil Foto
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('CameraCapture error:', error);
        reportError(error);
        return <div>Error loading camera</div>;
    }
}
