import { polyline, marker, map as LeafletMap, tileLayer, icon, type Map, type Marker, type TileLayer, type PolylineOptions, Polyline, geoJSON } from 'leaflet';
import { ref, shallowRef, type Ref, type ShallowRef } from 'vue';

export interface MarkerDetail<T> { id: string, meta?: T };
export interface PolylineDetail<T> { id: string, meta?: T };
export interface GeoJsonDetail<T> { id: string, meta?: T };

export interface TileLayerDefinition {
    id: string;
    name: string;
    description: string;
    url: string;
    attribution: string;
    maxZoom: number;
}

export const TILE_LAYERS: Record<string, TileLayerDefinition> = {
    osm: {
        id: 'osm',
        name: 'OpenStreetMap',
        description: 'Standard OSM tiles',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
    },
    osm_hot: {
        id: 'osm_hot',
        name: 'OSM Humanitarian',
        description: 'HOT humanitarian style',
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/">HOT</a>',
        maxZoom: 19,
    },
    cartodb_light: {
        id: 'cartodb_light',
        name: 'CartoDB Light',
        description: 'Clean light-grey basemap',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
    },
    cartodb_dark: {
        id: 'cartodb_dark',
        name: 'CartoDB Dark',
        description: 'Dark matter basemap',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
    },
    esri_world: {
        id: 'esri_world',
        name: 'ESRI Satellite',
        description: 'World imagery from ESRI',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
    },
    stadia_toner: {
        id: 'stadia_toner',
        name: 'Stadia Toner',
        description: 'High-contrast black & white',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com">Stamen Design</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
    },
};

export type TileLayerId = keyof typeof TILE_LAYERS;

export interface MapUtil<
    MarkerMeta = Record<string, any>,
    PolylineMeta = Record<string, any>,
    GeoJsonMeta = Record<string, any>
> {
    map: Ref<Map | undefined>;
    markers: Ref<MarkerDetail<MarkerMeta | Record<string, any>>[]>;
    polylines: Ref<PolylineDetail<PolylineMeta | Record<string, any>>[]>;
    geoJsons: Ref<GeoJsonDetail<GeoJsonMeta | Record<string, any>>[]>;
    currentTileLayerId: Ref<TileLayerId>;
    initMap: (el: string) => void;
    changeTileLayer: (id: TileLayerId) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    addGeoJson: (geoJson: any, options?: any, meta?: Record<string, any>) => void;
    addPolyLines: (polylines: number[][][], options?: PolylineOptions, meta?: Record<string, any>) => void;
    addMarker: (latitude: number, longitude: number, options?: { icon?: 'source' | 'destination', meta?: Record<string, any> }) => Marker;
    removeMarker: (id: string) => void;
    clearMarkers: () => void;
    clearPolyLines: () => void;
    clearAllLayers: () => void;
    clearGeoJsons: () => void;
}

export default function mapUtil() {
    let map = shallowRef<Map | undefined>();
    let activeTileLayer = shallowRef<TileLayer | undefined>();
    let currentTileLayerId = ref<TileLayerId>(
        (localStorage.getItem('tile_layer') as TileLayerId) || 'osm'
    );

    let markers = ref<MarkerDetail<Record<string, any>>[]>([]);
    let polylines = ref<PolylineDetail<Record<string, any>>[]>([])
    let geoJsons = ref<GeoJsonDetail<Record<string, any>>[]>([])

    const initMap = (el: string) => {
        const m = LeafletMap(el, { zoomControl: false }).setView([9.9178343, 78.0815385], 11);
        map.value = m;
        const savedId = (localStorage.getItem('tile_layer') as TileLayerId) || 'osm';
        currentTileLayerId.value = savedId;
        const def = TILE_LAYERS[savedId]!;
        activeTileLayer.value = tileLayer(def.url, {
            maxZoom: def.maxZoom,
            attribution: def.attribution
        }).addTo(m);
    }

    const zoomIn = () => {
        map.value?.zoomIn();
    }

    const zoomOut = () => {
        map.value?.zoomOut();
    }

    const changeTileLayer = (id: TileLayerId) => {
        if (!map.value) return;
        if (activeTileLayer.value) {
            map.value.removeLayer(activeTileLayer.value);
        }
        const def = TILE_LAYERS[id]!;
        activeTileLayer.value = tileLayer(def.url, {
            maxZoom: def.maxZoom,
            attribution: def.attribution
        }).addTo(map.value);
        currentTileLayerId.value = id;
        localStorage.setItem('tile_layer', id);
    }

    const addMarker = (latitude: number, longitude: number, options?: {
        icon?: 'source' | 'destination'
        meta?: Record<string, any>
    }) => {
        /**
         * Default icon configuration for map markers.
         *
         * @remarks
         * This configuration sets the icon URL to 'marker.svg' and specifies the size and anchor point of the icon.
         *
         * @constant
         * @type {Icon}
         *
         * @property {string} iconUrl - The URL of the icon image.
         * @property {number[]} iconSize - The size of the icon in pixels. The first element is the width, and the second element is the height.
         * @property {number[]} iconAnchor - The point of the icon which will correspond to the marker's location. The first element is the x-coordinate, and the second element is the y-coordinate.
         *
         * @example
         * The iconAnchor is calculated as follows:
         * - x-coordinate: half of the icon width (32 / 2 = 16)
         * - y-coordinate: full height of the icon (32)
         */
        var sourceIcon = icon({
            iconUrl: 'marker_source.svg',
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32] // point of the icon which will correspond to marker's location
        });
        var destinationIcon = icon({
            iconUrl: 'marker_destination.svg',
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32] // point of the icon which will correspond to marker's location
        });
        var defaultIcon = icon({
            iconUrl: 'marker.svg',
            iconSize: [32, 32], // size of the icon
            iconAnchor: [16, 32] // point of the icon which will correspond to marker's location
        });

        const m = marker([latitude, longitude], {
            icon: options?.icon === 'source' ? sourceIcon : options?.icon === 'destination' ? destinationIcon : defaultIcon
        }).addTo(map.value!);

        markers.value.push({
            id: m._leaflet_id.toString(),
            meta: options?.meta
        });
    }

    const removeMarker = (id: string) => {
        map.value!.eachLayer((layer) => {
            if (layer._leaflet_id.toString() === id) {
                const layerIndex = markers.value.findIndex((marker) => marker.id === id);

                map.value!.removeLayer(layer);
                markers.value.splice(layerIndex, 1);
            }
        });
    }

    const clearMarkers = () => {
        markers.value.forEach((marker) => {
            map.value!.eachLayer((layer) => {
                if (layer._leaflet_id.toString() === marker.id) {
                    map.value!.removeLayer(layer);
                }
            });
        });

        markers.value = [];
    }

    const addPolyLines = (p: number[][][], options?: PolylineOptions, meta?: Record<string, any>) => {
        const polylineLayer = polyline(p as any, {
            color: options?.color ?? '#2563eb',
            weight: options?.weight ?? 5,
            opacity: options?.opacity ?? 0.7,
            smoothFactor: options?.smoothFactor ?? 1
        }).addTo(map.value!);

        polylines.value.push({
            id: polylineLayer._leaflet_id.toString(),
            meta: meta
        });

        map.value!.fitBounds(polylineLayer.getBounds());
    }

    const clearPolyLines = () => {
        polylines.value.forEach((polyline) => {
            map.value!.eachLayer((layer) => {
                if (layer._leaflet_id.toString() === polyline.id) {
                    map.value!.removeLayer(layer);
                }
            });
        });

        polylines.value = [];
    }

    const clearAllLayers = () => {
        clearMarkers();
        clearPolyLines();
        clearGeoJsons();
    }

    const addGeoJson = (geoJson: any, options?: any, meta?: Record<string, any>) => {
        const gJ = geoJSON(geoJson, {
            style: function (feature) {
                return {
                    color: feature?.properties.color,
                    fillColor: feature?.properties.fillColor,
                    fillOpacity: feature?.properties.fillOpacity,
                    fill: feature?.properties.fill,
                    fillRule: feature?.properties.fillRule,
                };
            }
        }).addTo(map.value!);

        geoJsons.value.push({
            id: gJ._leaflet_id.toString(),
            meta
        });

        map.value!.fitBounds(gJ.getBounds());

    }

    const clearGeoJsons = () => {
        geoJsons.value.forEach((geoJson) => {
            map.value!.eachLayer((layer) => {
                if (layer._leaflet_id.toString() === geoJson.id) {
                    map.value!.removeLayer(layer);
                }
            });
        });

        geoJsons.value = [];
    }

    return {
        map,
        markers,
        polylines,
        geoJsons,
        currentTileLayerId,
        initMap,
        changeTileLayer,
        zoomIn,
        zoomOut,
        addGeoJson,
        addMarker,
        removeMarker,
        clearMarkers,
        addPolyLines,
        clearPolyLines,
        clearGeoJsons,
        clearAllLayers,
    }
}