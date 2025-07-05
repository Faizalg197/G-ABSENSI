function AttendanceChart({ studentsByClass }) {
    try {
        const [chartData, setChartData] = React.useState([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            if (studentsByClass) {
                generateChartData();
            }
        }, [studentsByClass]);

        const generateChartData = async () => {
            try {
                const data = [];
                const today = new Date().toISOString().split('T')[0];

                for (const [kelas, students] of Object.entries(studentsByClass)) {
                    let hadir = 0, terlambat = 0, alpha = 0;

                    for (const student of students) {
                        const absensi = await trickleListObjects(`absensi:${student.objectId}`, 10, true);
                        const todayAbsensi = absensi.items.filter(a => a.objectData.date === today);
                        
                        if (todayAbsensi.length > 0) {
                            const hasHadir = todayAbsensi.some(a => a.objectData.status === 'hadir');
                            const hasTerlambat = todayAbsensi.some(a => a.objectData.status === 'terlambat');
                            
                            if (hasHadir) hadir++;
                            else if (hasTerlambat) terlambat++;
                            else alpha++;
                        } else {
                            alpha++;
                        }
                    }

                    data.push({
                        kelas,
                        hadir,
                        terlambat,
                        alpha,
                        total: students.length
                    });
                }

                setChartData(data);
            } catch (error) {
                console.error('Generate chart data error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="attendance-chart" data-file="components/AttendanceChart.js" 
                 className="bg-white rounded-xl card-shadow p-6">
                <h3 className="text-lg font-semibold mb-6">Grafik Kehadiran Per Kelas</h3>
                
                <div className="space-y-4">
                    {chartData.map((data, index) => (
                        <div key={index} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{data.kelas}</h4>
                                <span className="text-sm text-gray-600">Total: {data.total} siswa</span>
                            </div>
                            
                            <div className="flex space-x-4 text-sm mb-2">
                                <span className="text-green-600">Hadir: {data.hadir}</span>
                                <span className="text-yellow-600">Terlambat: {data.terlambat}</span>
                                <span className="text-red-600">Alpha: {data.alpha}</span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
                                <div 
                                    className="bg-green-500 h-full" 
                                    style={{ width: `${(data.hadir / data.total) * 100}%` }}
                                ></div>
                                <div 
                                    className="bg-yellow-500 h-full" 
                                    style={{ width: `${(data.terlambat / data.total) * 100}%` }}
                                ></div>
                                <div 
                                    className="bg-red-500 h-full" 
                                    style={{ width: `${(data.alpha / data.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('AttendanceChart error:', error);
        reportError(error);
        return <div>Error loading attendance chart</div>;
    }
}
