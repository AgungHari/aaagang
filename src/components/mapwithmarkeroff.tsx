import { Map, MapMarker, MapTileLayer } from "@/components/ui/map"
import type { LatLngExpression } from "leaflet"

export function MapWithMarkers() {
    const CITIES = [
        {
            name: "Kantor",
            coordinates: [ -6.279070,106.755809] satisfies LatLngExpression,
        },
    ]

    return (
        <Map center={CITIES[0].coordinates} zoom={17} minZoom={10} className="border-zinc-900/20 rounded-xl">
            <MapTileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {CITIES.map((city) => (
                <MapMarker key={city.name} position={city.coordinates} />
            ))}
        </Map>
    )
}
