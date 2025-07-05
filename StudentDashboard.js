function StudentDashboard({ user, onLogout }) {
    try {
        const [todayAbsensi, setTodayAbsensi] = React.useState([]);
        const [schedules, setSchedules] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [activeTab, setActiveTab] = React.useState('home');
        const [activeView, setActiveView] = React.useState('dashboard');

        React.useEffect(() => {
            loadData();
        }, []);

        const loadData = async () => {
            try {
                const today = await AbsensiUtils.getTodayAbsensi(user.objectId);
                const allSchedules = await trickleListObjects('schedule', 100, false);
                const userSchedules = allSchedules.items.filter(s => s.objectData.kelas === user.objectData.kelas);
                
                setTodayAbsensi(today);
                setSchedules(userSchedules);
            } catch (error) {
                console.error('Load data error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleNavigate = (view) => {
            setActiveView(view);
        };

        const handleBack = () => {
            setActiveView('dashboard');
        };

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-blue-500">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        return (
            <div data-name="student-dashboard" data-file="components/StudentDashboard.js" 
                 className="min-h-screen tkj-gradient tech-pattern">
                <div className="bg-blue-600 text-white p-4 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {user.objectData.foto ? (
                                <img 
                                    src={user.objectData.foto} 
                                    alt="Foto Profil" 
                                    className="w-12 h-12 object-cover rounded-full border-2 border-blue-200"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center border-2 border-blue-200">
                                    <i className="fas fa-user text-white"></i>
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold">{user.objectData.nama}</h1>
                                <p className="text-blue-200 text-sm">@{user.objectData.username}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {activeView === 'dashboard' && (
                    <div>
                        <div className="flex bg-blue-600 px-4">
                            <button
                                onClick={() => setActiveTab('home')}
                                className={`flex-1 py-3 text-center font-medium transition-all ${
                                    activeTab === 'home' 
                                        ? 'text-white border-b-2 border-white' 
                                        : 'text-blue-200 hover:text-white'
                                }`}
                            >
                                <i className="fas fa-home mr-2"></i>Home
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-3 text-center font-medium transition-all ${
                                    activeTab === 'profile' 
                                        ? 'text-white border-b-2 border-white' 
                                        : 'text-blue-200 hover:text-white'
                                }`}
                            >
                                <i className="fas fa-user mr-2"></i>Akun
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'home' && (
                                <StudentHome 
                                    user={user}
                                    todayAbsensi={todayAbsensi}
                                    schedules={schedules}
                                    onNavigate={handleNavigate}
                                />
                            )}

                            {activeTab === 'profile' && (
                                <StudentProfile 
                                    user={user}
                                    onBack={() => setActiveTab('home')}
                                />
                            )}
                        </div>
                    </div>
                )}

                {activeView.startsWith('absen-') && (
                    <div className="p-6">
                        <AbsensiForm 
                            user={user}
                            type={activeView.split('-')[1]}
                            onSuccess={() => {
                                handleBack();
                                loadData();
                            }}
                            onCancel={handleBack}
                        />
                    </div>
                )}

                {activeView === 'presensi-teman' && (
                    <div className="p-6">
                        <PresensiTeman 
                            currentUser={user}
                            onSuccess={handleBack}
                            onCancel={handleBack}
                        />
                    </div>
                )}

                {activeView === 'izin' && (
                    <div className="p-6">
                        <IzinForm 
                            user={user}
                            onSuccess={handleBack}
                            onCancel={handleBack}
                        />
                    </div>
                )}

                {activeView === 'riwayat' && (
                    <div className="p-6">
                        <AbsensiHistory 
                            user={user}
                            onCancel={handleBack}
                        />
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('StudentDashboard error:', error);
        reportError(error);
        return <div>Error loading dashboard</div>;
    }
}
