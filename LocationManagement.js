function LocationManagement() {
    try {
        const [students, setStudents] = React.useState([]);
        const [locations, setLocations] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [showAddForm, setShowAddForm] = React.useState(false);
        const [newLocation, setNewLocation] = React.useState({
            userId: '', locationName: '', latitude: '', longitude: '', radius: 200
        });

        React.useEffect(() => {
            loadData();
            loadGoogleMaps();
        }, []);

        const loadGoogleMaps = () => {
            if (window.google) {
                initializeMap();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO1YbgZwzUvJpg&libraries=places&callback=initMap`;
            script.async = true;
            script.defer = true;
            window.initMap = initializeMap;
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            const defaultLocation = { lat: -6.2088, lng: 106.8456 };
            
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: defaultLocation
            });

            const marker = new google.maps.Marker({
                position: defaultLocation,
                map: map,
                draggable: true
            });

            const geocoder = new google.maps.Geocoder();
            const searchBox = new google.maps.places.SearchBox(
                document.getElementById('location-search')
            );

            const updateLocationFromCoords = (lat, lng) => {
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const address = results[0].formatted_address;
                        setNewLocation({
                            ...newLocation, 
                            latitude: lat.toString(), 
                            longitude: lng.toString(),
                            locationName: address
                        });
                    } else {
                        setNewLocation({
                            ...newLocation, 
                            latitude: lat.toString(), 
                            longitude: lng.toString()
                        });
                    }
                });
            };

            map.addListener('click', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                marker.setPosition(event.latLng);
                updateLocationFromCoords(lat, lng);
            });

            marker.addListener('dragend', (event) => {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                updateLocationFromCoords(lat, lng);
            });

            searchBox.addListener('places_changed', () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) return;

                const place = places[0];
                if (!place.geometry || !place.geometry.location) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                
                map.setCenter(place.geometry.location);
                marker.setPosition(place.geometry.location);
                setNewLocation({
                    ...newLocation, 
                    latitude: lat.toString(), 
                    longitude: lng.toString(),
                    locationName: place.formatted_address || place.name
                });
            });
        };

        const loadData = async () => {
            try {
                const [usersData, locationsData] = await Promise.all([
                    trickleListObjects('user', 100, false),
                    trickleListObjects('student_locations', 100, false)
                ]);
                
                setStudents(usersData.items.filter(u => u.objectData.role === 'siswa'));
                setLocations(locationsData.items);
            } catch (error) {
                console.error('Load data error:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleAddLocation = async (e) => {
            e.preventDefault();
            try {
                await trickleCreateObject('student_locations', {
                    ...newLocation,
                    latitude: parseFloat(newLocation.latitude),
                    longitude: parseFloat(newLocation.longitude),
                    radius: parseInt(newLocation.radius)
                });
                
                setNewLocation({ userId: '', locationName: '', latitude: '', longitude: '', radius: 200 });
                setShowAddForm(false);
                loadData();
                alert('Lokasi berhasil ditambahkan');
            } catch (error) {
                console.error('Add location error:', error);
                alert('Gagal menambahkan lokasi');
            }
        };

        const handleDeleteLocation = async (location) => {
            if (confirm(`Hapus lokasi ${location.objectData.locationName}?`)) {
                try {
                    await trickleDeleteObject('student_locations', location.objectId);
                    loadData();
                    alert('Lokasi berhasil dihapus');
                } catch (error) {
                    console.error('Delete location error:', error);
                    alert('Gagal menghapus lokasi');
                }
            }
        };

        if (loading) return <LoadingSpinner size="lg" />;

        return (
            <div data-name="location-management" data-file="components/LocationManagement.js" 
                 className="bg-white rounded-2xl card-shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Kelola Lokasi Absensi</h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        <i className="fas fa-plus mr-2"></i>Tambah Lokasi
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddLocation} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                        <select
                            value={newLocation.userId}
                            onChange={(e) => setNewLocation({...newLocation, userId: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Pilih Siswa</option>
                            {students.map(student => (
                                <option key={student.objectId} value={student.objectId}>
                                    {student.objectData.nama} - {student.objectData.kelas}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Nama Lokasi"
                            value={newLocation.locationName}
                            onChange={(e) => setNewLocation({...newLocation, locationName: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium mb-2">Pilih Lokasi dari Google Maps</label>
                            <input
                                type="text"
                                placeholder="Cari alamat atau nama tempat..."
                                className="w-full px-4 py-2 border rounded-lg mb-2"
                                id="location-search"
                            />
                            <div id="map" className="w-full h-64 border rounded-lg"></div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Koordinat: {newLocation.latitude}, {newLocation.longitude}</p>
                            </div>
                        </div>
                        <input
                            type="number"
                            placeholder="Radius (meter)"
                            value={newLocation.radius}
                            onChange={(e) => setNewLocation({...newLocation, radius: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                        <div className="flex space-x-2">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                Simpan
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} 
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg">
                                Batal
                            </button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3">Siswa</th>
                                <th className="text-left p-3">Lokasi</th>
                                <th className="text-left p-3">Koordinat</th>
                                <th className="text-left p-3">Radius</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((location, index) => {
                                const student = students.find(s => s.objectId === location.objectData.userId);
                                return (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            {student ? `${student.objectData.nama} (${student.objectData.kelas})` : 'Unknown'}
                                        </td>
                                        <td className="p-3">{location.objectData.locationName}</td>
                                        <td className="p-3">
                                            {location.objectData.latitude}, {location.objectData.longitude}
                                        </td>
                                        <td className="p-3">{location.objectData.radius}m</td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDeleteLocation(location)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } catch (error) {
        console.error('LocationManagement error:', error);
        return <div>Error loading location management</div>;
    }
}