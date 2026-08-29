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
            name: "Drupadi",
            coordinates: [-8.658089, 115.233043] satisfies LatLngExpression,
        },
        {
            name: "Singaraja",
            coordinates: [-8.079174,115.179648] satisfies LatLngExpression,
        },
        {
            name: "Banyuwangi",
            coordinates: [-8.209308,114.371507] satisfies LatLngExpression,
        },
        {
            name: "Cikarang",
            coordinates: [-6.263221,107.150706] satisfies LatLngExpression,
        },
        {
            name: "Kalimantan",
            coordinates: [-0.051606,109.336363] satisfies LatLngExpression,
        },
        {
            name: "Melbourne",
            coordinates: [-37.776456,144.891129] satisfies LatLngExpression,
        },
        {
            name: "Sydney",
            coordinates: [-33.900935,151.206532] satisfies LatLngExpression,
        },
        {
            name: "Perth",
            coordinates: [-32.151311,115.868287] satisfies LatLngExpression,
        },
        {
            name: "Brisbane",
            coordinates: [-27.407477,153.019803] satisfies LatLngExpression,
        },
        {
            name: "Manado",
            coordinates: [1.466545,124.836900] satisfies LatLngExpression,
        },
        {
            name: "Samarinda",
            coordinates: [-0.486861,117.151321] satisfies LatLngExpression,
        },
        {
            name: "Bandar Lampung",
            coordinates: [-5.392470,105.299036] satisfies LatLngExpression,
        },
        {
            name: "Jakpus",
            coordinates: [-6.190044,106.817013] satisfies LatLngExpression,
        },
        {
            name: "Cilegon",
            coordinates: [-6.021977,106.058305] satisfies LatLngExpression,
        },
        {
            name: "Tasikmalaya",
            coordinates: [-7.330612,108.221792] satisfies LatLngExpression,
        },
        {
            name: "Balikpapan",
            coordinates: [-1.225124,116.859097] satisfies LatLngExpression,
        },
        {
            name: "Mataram",
            coordinates: [-8.589902,116.123283] satisfies LatLngExpression,
        },
        {
            name: "Panakkukang",
            coordinates: [-5.145156,119.437162] satisfies LatLngExpression,
        },
                {
            name: "Malay",
            coordinates: [2.986362,101.784441] satisfies LatLngExpression,
        },
        {
            name: "Pakistan",
            coordinates: [30.233370,71.472216] satisfies LatLngExpression,
        },
        {
            name: "Pakist",
            coordinates: [24.930350,66.978543] satisfies LatLngExpression,
        },
        {
            name: "Sri Lanka",
            coordinates: [7.480226,80.377308] satisfies LatLngExpression,
        },
        {
            name: "Thailand",
            coordinates: [13.738102,100.580908] satisfies LatLngExpression,
        },
        {
            name: "Papua",
            coordinates: [-0.885851,131.291848] satisfies LatLngExpression,
        },
                {
            name: "Timor",
            coordinates: [-8.555975,125.544594] satisfies LatLngExpression,
        },
        {
            name: "Ambon",
            coordinates: [-3.700735,128.187471] satisfies LatLngExpression,
        },
        {
            name: "Aceh",
            coordinates: [5.566920,95.319362] satisfies LatLngExpression,
        },
        {
            name: "Magelang",
            coordinates: [-7.486331,110.226508] satisfies LatLngExpression,
        },
        {
            name: "Pekalongan",
            coordinates: [-6.894039,109.669459] satisfies LatLngExpression,
        },
        {
            name: "Surabaya",
            coordinates: [-7.272978,112.783792] satisfies LatLngExpression,
        },
        {
            name: "Bengkulu",
            coordinates: [-3.803575,102.271914] satisfies LatLngExpression,
        },
        
    ]

    return (
        <Map center={CITIES[1].coordinates} zoom={3} minZoom={2} className="border-zinc-900/20 rounded-xl">
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
