// src/components/discover/MapView.tsx
import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import type { Deal } from '../../types';

interface DiscoverStats {
  averageDiscount: number;
  storeCount: number;
  total: number;
}

interface MapViewProps {
  deals: Deal[];
  highlightedDealId?: string | null;
  onHoverDeal?: (dealId: string | null) => void;
  onShowFilters?: () => void;
  activeFiltersCount?: number;
  stats?: DiscoverStats | null;
}

const MAP_CENTER: LatLngExpression = [22.28552, 114.15769];

export const MapView: React.FC<MapViewProps> = ({
  deals,
  highlightedDealId,
  onHoverDeal,
  onShowFilters,
  activeFiltersCount = 0,
  stats,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const navigate = useNavigate();

  const dealLocations = useMemo(() => {
    return deals
      .map((deal) => {
        const location = deal.store?.location;
        if (!location) {
          return null;
        }
        const { lat } = location;
        const lng = 'lng' in location ? location.lng : 'lon' in location ? (location as { lon: number }).lon : undefined;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null;
        }
        return { lat, lng };
      })
      .filter((location): location is { lat: number; lng: number } => Boolean(location));
  }, [deals]);

  useEffect(() => {
    if (!mapRef.current || !dealLocations.length) {
      return;
    }
    const bounds = L.latLngBounds(dealLocations.map(({ lat, lng }) => [lat, lng] as [number, number]));
    window.requestAnimationFrame(() => {
      mapRef.current?.flyToBounds(bounds, { padding: [56, 56], maxZoom: 15, duration: 0.6 });
    });
  }, [dealLocations]);

  return (
    <div className="map-view">
      {stats ? (
        <div className="map-overlay" aria-live="polite">
          <div className="map-overlay__card">
            <p className="eyebrow">Live map insights</p>
            <h3>{stats.total} nearby finds</h3>
            <div className="map-overlay__meta">
              <span>{stats.storeCount} partner stores</span>
              <span>Avg. {stats.averageDiscount}% off</span>
            </div>
            <button type="button" className="map-overlay__filters" onClick={onShowFilters}>
              Adjust filters {activeFiltersCount ? <span className="badge badge-soft">{activeFiltersCount}</span> : null}
            </button>
          </div>
        </div>
      ) : null}

      <MapContainer
        center={MAP_CENTER}
        zoom={13}
        scrollWheelZoom
        className="map-canvas"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        />

        {deals.map((deal) => {
          const location = deal.store?.location;
          if (!location) {
            return null;
          }
          const { lat } = location;
          const lng = 'lng' in location ? location.lng : 'lon' in location ? (location as { lon: number }).lon : undefined;
          if (typeof lat !== 'number' || typeof lng !== 'number') {
            return null;
          }
          const isHighlighted = highlightedDealId === deal.dealId;
          const radius = isHighlighted ? 14 : 9;
          const fillOpacity = isHighlighted ? 0.88 : 0.55;
          const color = isHighlighted ? '#1d4ed8' : '#2563eb';

          return (
            <CircleMarker
              key={deal.dealId}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: isHighlighted ? '#60a5fa' : '#3b82f6',
                weight: isHighlighted ? 3 : 1.5,
                fillOpacity,
              }}
              eventHandlers={{
                mouseover: () => onHoverDeal?.(deal.dealId),
                mouseout: () => onHoverDeal?.(null),
                click: () => navigate(`/deal/${deal.dealId}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1} className="map-tooltip">
                <div className="map-tooltip__inner">
                  {deal.item?.images?.[0] && (
                    <img src={deal.item.images[0]} alt={deal.item?.name ?? 'Deal'} className="map-tooltip__image" />
                  )}
                  <div className="map-tooltip__body">
                    <strong>{deal.item?.name ?? 'Featured markdown'}</strong>
                    <p>{deal.store?.brand ?? deal.store?.name ?? 'Partner store'}</p>
                    <span className="map-tooltip__price">HK${deal.discountedPrice}</span>
                  </div>
                </div>
              </Tooltip>
              <Popup>
                <strong>{deal.item?.name}</strong>
                <br />
                {deal.store?.brand} · {deal.store?.name}
                <br />
                HK${deal.discountedPrice} · {deal.distanceKm ? `${deal.distanceKm.toFixed(1)} km away` : 'Nearby'}
                <br />
                <button
                  type="button"
                  className="secondary"
                  onClick={() => navigate(`/deal/${deal.dealId}`)}
                  style={{ marginTop: '6px' }}
                >
                  View details
                </button>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};
