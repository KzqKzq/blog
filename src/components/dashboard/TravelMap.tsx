import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { visitedCities } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

// Custom marker icon
const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

export function TravelMap() {
    // Center on Asia
    const center: [number, number] = [30, 115]
    const zoom = 3

    return (
        <DashboardWidget title="旅行足迹" icon="🗺️" className="p-0 overflow-hidden">
            <div className="relative w-full h-full min-h-[140px]">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    scrollWheelZoom={false}
                    className="w-full h-full rounded-md"
                    style={{ background: 'transparent' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    {visitedCities.map((city) => (
                        <Marker
                            key={city.name}
                            position={[city.lat, city.lng]}
                            icon={customIcon}
                        >
                            <Popup>
                                <strong>{city.name}</strong>
                                <br />
                                {city.country} · {city.year}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
                <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium z-[400] shadow-sm">
                    {visitedCities.length} 个城市
                </div>
            </div>
        </DashboardWidget>
    )
}
