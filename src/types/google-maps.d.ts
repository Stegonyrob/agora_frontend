// Google Maps Types for TypeScript
declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: MapTypeId;
      streetViewControl?: boolean;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      zoomControl?: boolean;
    }

    enum MapTypeId {
      ROADMAP = "roadmap",
      SATELLITE = "satellite",
      HYBRID = "hybrid",
      TERRAIN = "terrain",
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      addListener(eventName: string, handler: Function): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
    }

    interface InfoWindowOptions {
      content?: string | Element;
      position?: LatLng | LatLngLiteral;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng | LatLngLiteral): void;
    }

    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (
          result: DirectionsResult | null,
          status: DirectionsStatus
        ) => void
      ): void;
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions);
      setMap(map: Map | null): void;
      setDirections(directions: DirectionsResult): void;
    }

    interface DirectionsRendererOptions {
      draggable?: boolean;
      panel?: HTMLElement;
    }

    interface DirectionsRequest {
      origin: LatLng | LatLngLiteral | string;
      destination: LatLng | LatLngLiteral | string;
      travelMode: TravelMode;
      unitSystem?: UnitSystem;
      avoidHighways?: boolean;
      avoidTolls?: boolean;
    }

    interface DirectionsResult {
      routes: DirectionsRoute[];
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[];
    }

    interface DirectionsLeg {
      start_address: string;
      end_address: string;
      distance?: {
        text: string;
        value: number;
      };
      duration?: {
        text: string;
        value: number;
      };
    }

    enum DirectionsStatus {
      OK = "OK",
      NOT_FOUND = "NOT_FOUND",
      ZERO_RESULTS = "ZERO_RESULTS",
      MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
      INVALID_REQUEST = "INVALID_REQUEST",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    enum TravelMode {
      DRIVING = "DRIVING",
      WALKING = "WALKING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
    }

    enum UnitSystem {
      METRIC = 0,
      IMPERIAL = 1,
    }
  }
}

export {};
