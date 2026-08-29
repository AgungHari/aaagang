import { Map, MapMarker, MapTileLayer } from "@/components/ui/map"
import type { LatLngExpression } from "leaflet"

const cartoApiKey =
    process.env.NEXT_PUBLIC_CARTO_BASEMAP_API_KEY ??
    process.env.CARTO_BASEMAP_API_KEY

const cartoTileUrl = (baseUrl: string) => {
    if (!cartoApiKey) return baseUrl

    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}key=${encodeURIComponent(cartoApiKey)}`
}

export function MapWithMarkers() {
    const CITIES = [
        {
            name: "Kantor",
            coordinates: [ -8.672139,115.234250] satisfies LatLngExpression,
        },
    ]

    return (
        <Map center={CITIES[0].coordinates} zoom={17} minZoom={10} className="border-zinc-900/20 rounded-xl">
            <MapTileLayer
                url={cartoTileUrl("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png")}
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {CITIES.map((city) => (
                <MapMarker key={city.name} position={city.coordinates} />
            ))}
        </Map>
    )
}
