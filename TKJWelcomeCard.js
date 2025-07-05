function TKJWelcomeCard({ user }) {
    try {
        const [settings, setSettings] = React.useState({ jam_masuk: '05:00-07:30', jam_pulang: '15:00-17:00' });
        const [userLocation, setUserLocation] = React.useState(null);

        React.useEffect(() => {
            loadSettings();
            loadUserLocation();
        }, []);

        const loadSettings = async () => {
            try {
                const settingsData = await SettingsUtils.getSettings();
                setSettings(settingsData);
            } catch (error) {
                console.error('Load settings error:', error);
            }
        };

        const loadUserLocation = async () => {
            try {
                const location = await AbsensiUtils.getUserLocation(user.objectId);
                setUserLocation(location);
            } catch (error) {
                console.error('Load user location error:', error);
            }
        };

        return (
            <div data-name="tkj-welcome-card" data-file="components/TKJWelcomeCard.js" 
                 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center network-icon">
                            <i className="fas fa-laptop-code text-2xl text-white"></i>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Selamat Datang!</h2>
                            <p className="text-blue-100">{user.objectData.nama}</p>
                            <p className="text-sm text-blue-200">Kelas: {user.objectData.kelas}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-clock text-green-300"></i>
                                <h3 className="font-semibold">Jam Masuk</h3>
                            </div>
                            <p className="text-blue-100">{settings.jam_masuk}</p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center space-x-2 mb-2">
                                <i className="fas fa-sign-out-alt text-orange-300"></i>
                                <h3 className="font-semibold">Jam Pulang</h3>
                            </div>
                            <p className="text-blue-100">{settings.jam_pulang}</p>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-2 text-sm">
                            <i className="fas fa-map-marker-alt text-green-300"></i>
                            <span className="text-blue-100">
                                {userLocation ? userLocation.locationName : 'Lokasi belum diatur'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('TKJWelcomeCard error:', error);
        reportError(error);
        return <div>Error loading welcome card</div>;
    }
}