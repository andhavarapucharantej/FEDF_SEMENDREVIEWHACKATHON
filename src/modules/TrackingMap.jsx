import React, { useEffect, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Polyline, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { Bike, Clock3, RotateCcw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './TrackingMap.css';

const INDIA_CENTER = [22.9734, 78.6569];

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;
    const zoom = location.source === 'gps' ? 16 : 13;
    map.flyTo([location.latitude, location.longitude], zoom, { duration: 0.8 });
  }, [location?.latitude, location?.longitude, location?.source, map]);

  return null;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TrackingMap({
  location,
  startedAt,
  durationMs,
  onRestartSimulation,
  onRequestLocation,
  onStopLocation,
  locating,
  trackingLocation,
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const simulationDuration = durationMs || 120_000;
  const elapsed = Math.max(0, now - (startedAt || now));
  const progress = Math.min(elapsed / simulationDuration, 1);
  const remainingMs = Math.max(0, simulationDuration - elapsed);
  const completed = progress >= 1;
  const routeStage = completed
    ? 'Demo delivery complete'
    : progress >= 0.82
      ? 'Courier approaching drop-off'
      : 'Courier on the way';
  const center = location ? [location.latitude, location.longitude] : INDIA_CENTER;
  const pickup = location ? [location.latitude + 0.009, location.longitude - 0.009] : null;
  const demoCourier = location
    ? [
      pickup[0] + (center[0] - pickup[0]) * progress,
      pickup[1] + (center[1] - pickup[1]) * progress,
    ]
    : null;

  return <section className="tracking-map" aria-label="Interactive delivery tracking map">
    <div className="tracking-map-heading">
      <div><small>ORDER ROUTE</small><b>{location?.source === 'city' ? `Delivery area · ${location.cityName}` : 'Delivery location and route'}</b></div>
      <span className="tracking-map-provider">LIVE MAP · OPENSTREETMAP</span>
    </div>
    <div className="tracking-eta" aria-live="polite">
      <span className="tracking-eta-icon">{completed ? <Bike size={17}/> : <Clock3 size={17}/>}</span>
      <div className="tracking-eta-copy">
        <small>DEMO DELIVERY TIMER</small>
        <b>{completed ? routeStage : `${routeStage} · ETA ${formatTime(remainingMs)}`}</b>
        <span className="tracking-eta-bar" role="progressbar" aria-label="Demo delivery progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress * 100)}>
          <i style={{ width: `${progress * 100}%` }}/>
        </span>
      </div>
      <strong className="tracking-eta-percent">{Math.round(progress * 100)}%</strong>
    </div>
    <div className="tracking-map-canvas">
      <MapContainer center={center} zoom={location ? (location.source === 'gps' ? 16 : 13) : 5} scrollWheelZoom zoomControl={false} className="tracking-leaflet">
        <RecenterMap location={location}/>
        <ZoomControl position="topright"/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        {location && <>
          <Polyline positions={[pickup, center]} pathOptions={{ color: '#b28b4d', weight: 4, dashArray: '8 8', opacity: 0.9 }}/>
          {progress > 0 && <Polyline positions={[pickup, demoCourier]} pathOptions={{ color: '#315b43', weight: 5, opacity: 0.9 }}/>}
          <CircleMarker center={pickup} radius={8} pathOptions={{ color: '#fffefa', fillColor: '#315b43', fillOpacity: 1, weight: 3 }}>
            <Popup>Demo pickup point — actual restaurant coordinates are not connected.</Popup>
          </CircleMarker>
          {location.source === 'gps' && location.accuracy > 0 && <Circle center={center} radius={location.accuracy} pathOptions={{ color: '#426f91', fillColor: '#72a9c5', fillOpacity: 0.12, weight: 1 }}/>}
          <CircleMarker center={center} radius={9} pathOptions={{ color: '#fffefa', fillColor: '#bb554b', fillOpacity: 1, weight: 3 }}>
            <Popup>{location.source === 'city' ? `${location.cityName} city-centre estimate` : 'Your current GPS location'}</Popup>
          </CircleMarker>
          <CircleMarker center={demoCourier} radius={8} pathOptions={{ color: '#fffefa', fillColor: '#c58a43', fillOpacity: 1, weight: 3 }}>
            <Popup>Demo courier · {Math.round(progress * 100)}% of simulated route. This is not a live driver location.</Popup>
          </CircleMarker>
        </>}
      </MapContainer>
      {!location && <div className="tracking-map-empty">
        <b>Choose a city or use GPS</b>
        <span>The map will centre on your selected delivery area.</span>
      </div>}
    </div>
    <div className="tracking-map-footer">
      <span>{location
        ? location.source === 'city'
          ? `${location.cityName} · city-centre estimate`
          : `Live GPS · ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)} ±${location.accuracy} m`
        : 'No delivery location selected'}</span>
      <button
        type="button"
        onClick={trackingLocation ? onStopLocation : onRequestLocation}
        disabled={locating && !trackingLocation}
        aria-label={trackingLocation ? 'Stop live GPS updates' : 'Use live GPS'}
      >
        {locating ? 'Finding location…' : trackingLocation ? 'Stop live GPS' : 'Use live GPS'}
      </button>
      {completed && <button className="tracking-replay" type="button" onClick={onRestartSimulation}><RotateCcw size={13}/> Replay demo</button>}
    </div>
    <p className="tracking-map-disclaimer">Courier movement and the {formatTime(simulationDuration)} timer are an accelerated demo, not a real delivery ETA or driver location. Connect a courier GPS feed for live tracking. Map requests may reveal the approximate map area to OpenStreetMap.</p>
  </section>;
}
