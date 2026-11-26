import { LocateFixed, Map, MapPin } from 'lucide-react';
import { indianCities } from '../data/indianCities.js';
import './LocationPickerModule.css';

export default function LocationPickerModule({
  location,
  locationError,
  locating,
  trackingLocation,
  onSelectCity,
  onAutoLocate,
  onOpenMap,
  onStopGps,
}) {
  const selectedCity = location?.source === 'city' ? location.cityId : location?.source === 'gps' ? 'gps' : '';
  const title = location?.source === 'gps'
    ? trackingLocation ? 'Using your live GPS location' : 'Using detected GPS location'
    : location?.source === 'city'
      ? location.cityName
      : 'Choose a city or use GPS';
  const detail = locating
    ? 'Waiting for browser location permission…'
    : location?.source === 'gps'
    ? `GPS accuracy ±${location.accuracy} m${trackingLocation ? ' · updating live' : ' · last fix'}`
    : location?.source === 'city'
      ? 'City-centre estimate · choose GPS for your precise location'
      : 'Select an Indian city or allow browser location access';

  return <div className="delivery-address location-picker">
    <span className="pin-icon"><MapPin size={16}/></span>
    <div className="location-picker-copy">
      <label htmlFor="delivery-city">
        <small>DELIVERY LOCATION</small>
        <select id="delivery-city" aria-label="Choose an Indian delivery city" value={selectedCity} onChange={(event) => {
          if (event.target.value !== 'gps') onSelectCity(event.target.value);
        }}>
          <option value="">Choose a city…</option>
          {location?.source === 'gps' && <option value="gps">Current GPS location</option>}
          {indianCities.map((city) => <option value={city.id} key={city.id}>{city.name}</option>)}
        </select>
      </label>
      <span className="location-current" aria-live="polite">{title}</span>
      <small>{detail}</small>
      {locationError && <span className="location-error" role="alert">{locationError}</span>}
    </div>
    <div className="location-picker-actions">
      <button className="location-map-open" type="button" onClick={onOpenMap} aria-label="Open location map" title="Open location map"><Map size={15}/><span>Map</span></button>
      <button className="location-request" type="button" onClick={trackingLocation ? onStopGps : onAutoLocate} disabled={locating && !trackingLocation} aria-label={trackingLocation ? 'Stop live GPS location' : 'Refresh delivery location using GPS'}>
        <LocateFixed size={15}/>{locating ? 'Finding…' : trackingLocation ? 'Stop GPS' : location?.source === 'gps' ? 'Refresh GPS' : 'Auto-detect'}
      </button>
    </div>
  </div>;
}
