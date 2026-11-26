import { MapPin, Moon, Settings2, ShieldCheck, Sun } from 'lucide-react';
import './SettingsModule.css';

export default function SettingsModule({ preferences, onChange, location, onClearLocation, onStopLocation }) {
  return <main className="page-content settings-module">
    <header className="account-page-heading"><div className="section-kicker">MAKE IT YOURS</div><h1>Settings</h1><p>Choose how TastyTongue keeps you updated.</p></header>
    <section className="settings-card">
      <h2><Settings2 size={17}/> Preferences</h2>
      <div className="setting-row theme-setting">
        <span><b>Appearance</b><small>Choose a warm light or dark restaurant theme.</small></span>
        <div className="theme-options" role="group" aria-label="Choose day or night theme">
          <button type="button" className={preferences.theme === 'day' ? 'selected' : ''} aria-pressed={preferences.theme === 'day'} onClick={() => onChange('theme', 'day')}><Sun size={14}/> Day</button>
          <button type="button" className={preferences.theme === 'night' ? 'selected' : ''} aria-pressed={preferences.theme === 'night'} onClick={() => onChange('theme', 'night')}><Moon size={14}/> Night</button>
        </div>
      </div>
      <label className="setting-row"><span><b>Order updates</b><small>Show order status updates in the app.</small></span><input type="checkbox" checked={preferences.orderUpdates} onChange={(event) => onChange('orderUpdates', event.target.checked)}/></label>
      <label className="setting-row"><span><b>Email offers</b><small>Receive occasional menu and restaurant offers.</small></span><input type="checkbox" checked={preferences.emailOffers} onChange={(event) => onChange('emailOffers', event.target.checked)}/></label>
      <label className="setting-row"><span><b>Auto-detect location after sign-in</b><small>Ask browser permission to find your delivery area.</small></span><input type="checkbox" checked={preferences.autoDetectLocation} onChange={(event) => onChange('autoDetectLocation', event.target.checked)}/></label>
    </section>
    <section className="settings-card location-settings">
      <h2><MapPin size={17}/> Location & privacy</h2>
      <p>{location ? `Current selection: ${location.source === 'gps' ? 'GPS location' : location.cityName}.` : 'No delivery location is selected.'} Location access is optional and controlled by your browser.</p>
      <div>
        {location && <button type="button" onClick={onClearLocation}>Clear selected location</button>}
        <button type="button" onClick={onStopLocation}>Stop live GPS</button>
      </div>
      <small><ShieldCheck size={13}/> Location is used to centre the delivery map. Demo settings are kept for this session.</small>
    </section>
  </main>;
}
