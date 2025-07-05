function RegisterForm({ onRegister, onSwitchToLogin }) {
    try {
        return (
            <div data-name="register-form" data-file="components/RegisterForm.js" 
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
                        <p className="text-red-600 font-medium">Registrasi Ditutup</p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                            <div>
                                <p className="text-red-700 font-medium">Akun siswa hanya dapat dibuat oleh admin</p>
                                <p className="text-red-600 text-sm">Silakan hubungi admin sekolah untuk membuat akun</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            Sudah punya akun?
                        </p>
                        <button 
                            onClick={onSwitchToLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all"
                        >
                            Masuk ke Akun Anda
                        </button>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('RegisterForm error:', error);
        reportError(error);
        return <div>Error loading register form</div>;
    }
}
