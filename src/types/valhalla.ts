export interface TraceRoutePayload {
    shape: Shape[];
    costing: string;
    shape_match: string;
}

export interface TraceRouteJson {
    locations: TraceRouteLocation[];
    costing: string;
    costing_options: CostingOptions;
    units: string;
    id: string;
}

export interface CostingOptions {
    auto: Auto;
}

export interface Auto {
    country_crossing_penalty: number;
}

export interface TraceRouteLocation {
    lat: number;
    lon: number;
}


export interface Shape {
    lat: number;
    lon: number;
    type: Type;
    original_index?: number;
}

export enum Type {
    Break = "break",
    Via = "via",
}

// Responses
export interface RouteReponse {
    trip: Trip;
    id: string;
}

export interface TraceRouteResponse {
    trip: Trip;
    alternates: Alternate[];
}

export interface Alternate {
    trip: Trip;
}

export interface Trip {
    locations: Location[];
    legs: Leg[];
    summary: Summary;
    status_message: string;
    status: number;
    units: string;
    language: string;
}

export interface Leg {
    maneuvers: Maneuver[];
    summary: Summary;
    shape: string;
}

export interface Maneuver {
    type: number;
    instruction: string;
    verbal_succinct_transition_instruction?: string;
    verbal_pre_transition_instruction: string;
    verbal_post_transition_instruction?: string;
    street_names?: string[];
    time: number;
    length: number;
    cost: number;
    begin_shape_index: number;
    end_shape_index: number;
    travel_mode: string;
    travel_type: string;
    verbal_transition_alert_instruction?: string;
}

export interface Summary {
    has_time_restrictions: boolean;
    has_toll: boolean;
    has_highway: boolean;
    has_ferry: boolean;
    min_lat: number;
    min_lon: number;
    max_lat: number;
    max_lon: number;
    time: number;
    length: number;
    cost: number;
}

export interface Location {
    type?: string;
    lat: number;
    lon: number;
    original_index?: number;
}

// Matrix API
export interface SourceToTargetPayload {
    sources: Source[];
    targets: Source[];
    costing: string;
    shape_format: string;
}

export interface SourceToTargetResponse {
    algorithm: string;
    units: string;
    sources: Source[];
    targets: Source[];
    sources_to_targets: Array<SourcesToTarget[]>;
}

export interface Source {
    lon: number;
    lat: number;
}

export interface SourcesToTarget {
    shape: string;
    distance: number;
    time: number;
    to_index: number;
    from_index: number;
}

// Locate API
export interface LocatePayload {
    verbose: boolean;
    locations: {
        lat: number;
        lon: number;
        minimum_reachability?: number;
        heading?: number;
        radius?: number;
        node_snap_tolerance?: number;
        preferred_side?: 'either' | 'same' | 'opposite';
    }[];
    costing: string;
    directions_options: DirectionsOptions;
}

export interface DirectionsOptions {
    units: string;
}

export interface LocateResponse {
    input_lon: number;
    nodes: any[];
    input_lat: number;
    edges: EdgeElement[];
}

export interface EdgeElement {
    access_restrictions: any[];
    live_speed: LiveSpeed;
    correlated_lon: number;
    side_of_street: string;
    linear_reference: string;
    percent_along: number;
    outbound_reach: number;
    distance: number;
    edge_info: EdgeInfo;
    edge: EdgeEdge;
    heading: number;
    inbound_reach: number;
    correlated_lat: number;
    edge_id: EdgeID;
    predicted_speeds: any[];
}

export interface EdgeEdge {
    bridge: boolean;
    access: { [key: string]: boolean };
    has_sign: boolean;
    deadend: boolean;
    country_crossing: boolean;
    tunnel: boolean;
    seasonal: boolean;
    end_restriction: { [key: string]: boolean };
    cycle_lane: string;
    start_restriction: { [key: string]: boolean };
    geo_attributes: GeoAttributes;
    part_of_complex_restriction: boolean;
    access_restriction: boolean;
    traffic_signal: boolean;
    toll: boolean;
    round_about: boolean;
    bike_network: boolean;
    speeds: Speeds;
    truck_route: boolean;
    end_node: EdgeID;
    not_thru: boolean;
    destination_only: boolean;
    yield_sign: boolean;
    classification: Classification;
    sac_scale: string;
    forward: boolean;
    stop_sign: boolean;
    lane_count: number;
    sidewalk_right: boolean;
    sidewalk_left: boolean;
}

export interface Classification {
    internal: boolean;
    link: boolean;
    surface: string;
    use: string;
    classification: string;
}

export interface EdgeID {
    value: number;
    id: number;
    tile_id: number;
    level: number;
}

export interface GeoAttributes {
    curvature: number;
    max_down_slope: number;
    max_up_slope: number;
    weighted_grade: number;
    length: number;
}

export interface Speeds {
    predicted: boolean;
    constrained_flow: number;
    free_flow: number;
    type: string;
    default: number;
}

export interface EdgeInfo {
    speed_limit: number;
    mean_elevation: null;
    shape: string;
    names: string[];
    bike_network: BikeNetwork;
    way_id: number;
}

export interface BikeNetwork {
    mountain: boolean;
    local: boolean;
    regional: boolean;
    national: boolean;
}

export interface LiveSpeed {
}

// Isochrone API
export interface IsochronePayload {
    locations: Location[];
    costing: string;
    contours: Contour[];
}

export interface Contour {
    time: number;
    color: string;
}