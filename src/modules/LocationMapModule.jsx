import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LocateFixed, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './LocationMapModule.css';

const INDIA_CENTER = [22.9734, 78.6569];

function RecenterLocationMap({ location }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    if (location) {
      map.flyTo(
        [location.latitude, location.longitude],
        location.source === 'gps' ? 16 : 13,
        { duration: 0.6 },
      );
    }
  }, [location?.latitude, location?.longitude, location?.source, map]);

  return null;
}

export default function LocationMapModule({ location, locating, locationError, onRefreshLocation, onClose }) {
  const center = location ? [location.latitude, location.longitude] : INDIA_CENTER;

  return <div className="location-map-backdrop" onClick={onClose}>
    <section
      className="location-map-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-map-title"
      onClick={(event) => event.stopPropagation()}
    >
      <header className="location-map-header">
        <div>
          <div className="section-kicker">DELIVERY AREA</div>
          <h2 id="location-map-title">{location?.source === 'city' ? location.cityName : location?.source === 'gps' ? 'Detected GPS location' : 'Choose your location'}</h2>
          <p>{location ? 'Map centred on your selected delivery location.' : 'Use GPS to centre the map on your current location.'}</p>
        </div>
        <button className="close-btn" type="button" aria-label="Close location map" onClick={onClose}><X size={18}/></button>
      </header>
      <div className="location-map-canvas">
        <MapContainer
          center={center}
          zoom={location ? (location.source === 'gps' ? 16 : 13) : 5}
          scrollWheelZoom
          zoomControl={false}
          className="location-leaflet"
        >
          <RecenterLocationMap location={location}/>
          <ZoomControl position="topright"/>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {location && <>
            {location.source === 'gps' && location.accuracy > 0 && <Circle
              center={center}
              radius={location.accuracy}
              pathOptions={{ color: '#426f91', fillColor: '#72a9c5', fillOpacity: 0.12, weight: 1 }}
            />}
            <CircleMarker center={center} radius={9} pathOptions={{ color: '#fffefa', fillColor: '#bb554b', fillOpacity: 1, weight: 3 }}>
              <Popup>{location.source === 'city' ? `${location.cityName} city-centre estimate` : 'Your detected GPS location'}</Popup>
            </CircleMarker>
          </>}
        </MapContainer>
      </div>
      {locationError && <p className="location-map-error" role="alert">{locationError}</p>}
      <footer className="location-map-footer">
        <span>{location
          ? location.source === 'city'
            ? `${location.cityName} · city-centre estimate`
            : `GPS accuracy ±${location.accuracy} m`
          : 'No location detected yet'}</span>
        <button type="button" className="location-map-refresh" onClick={onRefreshLocation} disabled={locating}>
          <LocateFixed size={15}/>{locating ? 'Finding location…' : 'Refresh GPS'}
        </button>
      </footer>
      <p className="location-map-note">GPS requires browser permission and a secure connection (localhost or HTTPS). Map tiles are provided by OpenStreetMap.</p>
    </section>
  </div>;
}
