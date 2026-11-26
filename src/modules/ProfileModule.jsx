import { useState } from 'react';
import { LogOut, Save, UserRound } from 'lucide-react';
import './ProfileModule.css';

export default function ProfileModule({ name, email, phone, onSave, onSignOut }) {
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(draftName.trim(), draftEmail.trim(), draftPhone.trim());
    setSaved(true);
  };

  return <main className="page-content account-module">
    <header className="account-page-heading"><div className="section-kicker">YOUR ACCOUNT</div><h1>Profile</h1><p>Manage the details used for your TastyTongue account.</p></header>
    <form className="account-card profile-form" onSubmit={handleSubmit}>
      <div className="account-avatar"><UserRound size={25}/></div>
      <label htmlFor="profile-name">Full name</label>
      <input id="profile-name" type="text" value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Your name" minLength={2} required/>
      <label htmlFor="profile-email">Email address</label>
      <input id="profile-email" type="email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} required/>
      <label htmlFor="profile-phone">Mobile number</label>
      <input id="profile-phone" type="tel" value={draftPhone} onChange={(event) => setDraftPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Add a 10-digit Indian number" inputMode="numeric" pattern="[6-9][0-9]{9}"/>
      {saved && <p className="profile-saved" role="status">Profile updated for this session.</p>}
      <div className="account-actions"><button type="submit"><Save size={15}/> Save profile</button><button type="button" className="account-signout" onClick={onSignOut}><LogOut size={15}/> Sign out</button></div>
      <p className="account-demo-note">Profile changes are stored only for this browser session in the demo.</p>
    </form>
  </main>;
}
