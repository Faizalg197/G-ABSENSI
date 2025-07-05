function StudentProfile({ user, onBack }) {
    try {
        return (
            <div data-name="student-profile" data-file="components/StudentProfile.js" 
                 className="bg-white rounded-2xl card-shadow p-6 slide-in">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Profil Akun</h3>
                    <button
                        onClick={onBack}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>Kembali
                    </button>
                </div>

                <div className="text-center mb-8">
                    {user.objectData.foto ? (
                        <img 
                            src={user.objectData.foto} 
                            alt="Foto Profil" 
                            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-100"
                        />
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-blue-100">
                            <i className="fas fa-user text-4xl text-gray-500"></i>
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{user.objectData.nama}</h2>
                    <p className="text-blue-600 font-medium">@{user.objectData.username}</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm text-gray-600 font-medium">Nama Lengkap</label>
                        <p className="text-lg text-gray-800">{user.objectData.nama}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm text-gray-600 font-medium">Username</label>
                        <p className="text-lg text-gray-800">{user.objectData.username}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm text-gray-600 font-medium">Kelas</label>
                        <p className="text-lg text-gray-800">{user.objectData.kelas}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm text-gray-600 font-medium">Role</label>
                        <p className="text-lg text-gray-800 capitalize">{user.objectData.role}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-sm text-gray-600 font-medium">Terdaftar Sejak</label>
                        <p className="text-lg text-gray-800">
                            {new Date(user.objectData.createdAt).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => {
                            AuthUtils.logout();
                            window.location.reload();
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-all"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Keluar dari Akun
                    </button>
                </div>
            </div>
        );
    } catch (error) {
        console.error('StudentProfile error:', error);
        reportError(error);
        return <div>Error loading profile</div>;
    }
}
