const AuthUtils = {
    async login(username, password) {
        try {
            // Check for default admin
            if (username === 'admin' && password === '@admin123_') {
                const adminUser = {
                    objectId: 'admin-default',
                    objectData: {
                        username: 'admin',
                        nama: 'Administrator TKJ',
                        role: 'admin'
                    }
                };
                localStorage.setItem('currentUser', JSON.stringify(adminUser));
                return { success: true, user: adminUser };
            }

            const users = await trickleListObjects('user', 100, false);
            const user = users.items.find(u => 
                u.objectData.username === username && u.objectData.password === password
            );
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, message: 'Username atau password salah' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Terjadi kesalahan sistem' };
        }
    },

    async register(userData) {
        try {
            const existingUsers = await trickleListObjects('user', 100, false);
            const usernameExists = existingUsers.items.some(u => u.objectData.username === userData.username);
            
            if (usernameExists) {
                return { success: false, message: 'Username sudah terdaftar' };
            }

            const newUser = await trickleCreateObject('user', {
                ...userData,
                role: 'siswa',
                createdAt: new Date().toISOString()
            });
            
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Gagal mendaftar' };
        }
    },

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem('currentUser');
    }
};
