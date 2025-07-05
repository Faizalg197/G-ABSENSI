function WelcomeScreen({ onEnter }) {
    try {
        React.useEffect(() => {
            const timer = setTimeout(() => {
                onEnter();
            }, 3000);
            return () => clearTimeout(timer);
        }, []);

        return (
            <div data-name="welcome-screen" data-file="components/WelcomeScreen.js" 
                 className="min-h-screen tkj-gradient tech-pattern flex items-center justify-center welcome-screen">
                <div className="text-center text-white p-8">
                    <div className="mb-8">
                        <div className="mb-6">
                            <div className="w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 network-icon">
                                <i className="fas fa-laptop-code text-6xl text-white"></i>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">SMK NEGERI 2 PAGUYAMAN</h1>
                        <h2 className="text-3xl font-semibold mb-6">E-ABSENSI TKJ</h2>
                        <div className="text-xl text-blue-100 space-y-2">
                            <p>Sistem Absensi Digital</p>
                            <p className="text-lg">Teknik Komputer & Jaringan</p>
                            <div className="flex flex-wrap justify-center gap-4 mt-4">
                                <span className="bg-indigo-600 px-4 py-2 rounded-full text-sm flex items-center">
                                    <i className="fas fa-network-wired mr-2"></i>Networking
                                </span>
                                <span className="bg-purple-600 px-4 py-2 rounded-full text-sm flex items-center">
                                    <i className="fas fa-server mr-2"></i>Server
                                </span>
                                <span className="bg-green-600 px-4 py-2 rounded-full text-sm flex items-center">
                                    <i className="fas fa-code mr-2"></i>Programming
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="animate-pulse">
                        <p className="text-lg">Memuat aplikasi...</p>
                        <div className="mt-4">
                            <LoadingSpinner size="lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('WelcomeScreen error:', error);
        reportError(error);
        return <div>Loading...</div>;
    }
}
