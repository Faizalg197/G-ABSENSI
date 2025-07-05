function IzinForm({ user, onSuccess, onCancel }) {
    try {
        const [formData, setFormData] = React.useState({
            type: 'izin',
            reason: '',
            date: new Date().toISOString().split('T')[0]
        });
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            const result = await AbsensiUtils.submitIzin(
                user.objectId,
                formData.type,
                formData.reason,
                formData.date
            );

            if (result.success) {
                alert('Pengajuan izin berhasil dikirim');
                onSuccess();
            } else {
                alert(result.message);
            }
            setLoading(false);
        };

        return (
            <div data-name="izin-form" data-file="components/IzinForm.js" 
                 className="bg-white rounded-xl card-shadow p-6 slide-in">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pengajuan Izin</h3>
                    <p className="text-gray-600">Ajukan izin atau sakit</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Jenis</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="izin">Izin</option>
                            <option value="sakit">Sakit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Tanggal</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Alasan</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Jelaskan alasan izin/sakit"
                            required
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary text-white py-3 rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? <LoadingSpinner size="sm" /> : 'Kirim Pengajuan'}
                        </button>
                    </div>
                </form>
            </div>
        );
    } catch (error) {
        console.error('IzinForm error:', error);
        reportError(error);
        return <div>Error loading izin form</div>;
    }
}
