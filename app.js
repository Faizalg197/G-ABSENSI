class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
                        <p className="text-gray-600">Silakan refresh halaman</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    try {
        const [currentUser, setCurrentUser] = React.useState(null);
        const [currentView, setCurrentView] = React.useState('welcome');
        const [loading, setLoading] = React.useState(false);

        React.useEffect(() => {
            if (currentView === 'login') {
                checkAuthStatus();
            }
        }, [currentView]);

        const checkAuthStatus = () => {
            const user = AuthUtils.getCurrentUser();
            if (user) {
                setCurrentUser(user);
                setCurrentView(user.objectData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
            }
        };

        const handleLogin = (user) => {
            setCurrentUser(user);
            setCurrentView(user.objectData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
        };

        const handleRegister = (user) => {
            setCurrentUser(user);
            setCurrentView('student-dashboard');
        };

        const handleLogout = () => {
            AuthUtils.logout();
            setCurrentUser(null);
            setCurrentView('login');
        };

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center gradient-bg">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        return (
            <ErrorBoundary>
                <div data-name="app" data-file="app.js" className="App">
                {currentView === 'welcome' && (
                    <WelcomeScreen onEnter={() => setCurrentView('login')} />
                )}

                {currentView === 'login' && (
                    <LoginForm 
                        onLogin={handleLogin}
                        onSwitchToRegister={() => setCurrentView('register')}
                    />
                )}
                
                {currentView === 'register' && (
                    <RegisterForm 
                        onRegister={handleRegister}
                        onSwitchToLogin={() => setCurrentView('login')}
                    />
                )}
                
                {currentView === 'student-dashboard' && currentUser && (
                    <StudentDashboard 
                        user={currentUser}
                        onLogout={handleLogout}
                    />
                )}
                
                {currentView === 'admin-dashboard' && currentUser && (
                    <AdminDashboard 
                        user={currentUser}
                        onLogout={handleLogout}
                    />
                )}
                </div>
            </ErrorBoundary>
        );
    } catch (error) {
        console.error('App error:', error);
        reportError(error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h1>
                    <p className="text-gray-600">Silakan refresh halaman</p>
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
