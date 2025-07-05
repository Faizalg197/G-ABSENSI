function LoginForm({ onLogin, onSwitchToRegister }) {
    try {
        const [formData, setFormData] = React.useState({ username: '', password: '' });
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState('');
        const [showPassword, setShowPassword] = React.useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            const result = await AuthUtils.login(formData.username, formData.password);
            
            if (result.success) {
                onLogin(result.user);
            } else {
                setError(result.message);
            }
            setLoading(false);
        };

        return (
            <div data-name="login-form" data-file="components/LoginForm.js" 
                 className="min-h-screen tkj-gradient tech-pattern flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl card-shadow p-8 w-full max-w-md fade-in">
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 network-icon">
                                <i className="fas fa-laptop-code text-3xl text-white"></i>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">SMK NEGERI 2 PAGUYAMAN</h1>
                        <h2 className="text-xl font-semibold text-indigo-600 mb-2">E-ABSENSI TKJ</h2>
                        <p className="text-gray-600">Masuk ke akun Anda</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan Username Anda"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                                    placeholder="Masukkan password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary text-white py-3 rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Masuk'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Belum punya akun?{' '}
                            <button 
                                onClick={onSwitchToRegister}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Info Registrasi
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('LoginForm error:', error);
        reportError(error);
        return <div>Error loading login form</div>;
    }
}
