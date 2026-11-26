import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Phone, ShieldCheck, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import { photo } from '../data/catalog.js';
import FoodMascots from './FoodMascots.jsx';
import './LoginModule.css';

const registeredEmailsKey = 'tastytongue-demo-registered-emails';

const readRegisteredEmails = () => {
  const savedEmails = window.sessionStorage.getItem(registeredEmailsKey);
  if (!savedEmails) return [];

  const emails = JSON.parse(savedEmails);
  if (!Array.isArray(emails) || emails.some((savedEmail) => typeof savedEmail !== 'string')) {
    throw new Error('Invalid saved registration data.');
  }
  return emails;
};

export default function LoginModule({
  onLogin,
  onRegister,
  onPasswordReset,
  demoCredential,
  autoDetectLocation = true,
  theme = 'night',
}) {
  const [mode, setMode] = useState('login');
  const [loginRole, setLoginRole] = useState('customer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [resetOtp, setResetOtp] = useState('');
  const [generatedResetOtp, setGeneratedResetOtp] = useState('');
  const [resetOtpExpiresAt, setResetOtpExpiresAt] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [autoLocate, setAutoLocate] = useState(autoDetectLocation);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter an email and password to continue.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (demoCredential?.email === normalizedEmail && demoCredential.password !== password) {
      setError(`Incorrect password for ${normalizedEmail}. An email security alert was not sent because this demo has no email service. Use Forgot password? to reset it.`);
      return;
    }

    setError('');
    onLogin(email.trim(), loginRole, autoLocate);
  };

  const generateOtp = () => {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    setGeneratedOtp(String(values[0] % 1_000_000).padStart(6, '0'));
    setOtpExpiresAt(Date.now() + 5 * 60 * 1000);
    setOtp('');
    setError('');
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    let registeredEmails;
    try {
      registeredEmails = readRegisteredEmails();
    } catch {
      setError('Could not check registration in this browser tab. Please enable session storage and try again.');
      return;
    }

    if (registeredEmails.includes(normalizedEmail) || demoCredential?.email === normalizedEmail) {
      setError('This email is already registered. Please sign in instead.');
      setNotice('');
      return;
    }

    if (!generatedOtp) {
      generateOtp();
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (Date.now() > otpExpiresAt) {
      setError('That demo OTP has expired. Generate a new one.');
      setGeneratedOtp('');
      setOtp('');
      return;
    }
    if (otp !== generatedOtp) {
      setError('Enter the six-digit demo OTP shown below.');
      return;
    }

    try {
      const latestRegisteredEmails = readRegisteredEmails();
      if (latestRegisteredEmails.includes(normalizedEmail)) {
        setError('This email is already registered. Please sign in instead.');
        return;
      }
      window.sessionStorage.setItem(registeredEmailsKey, JSON.stringify([...latestRegisteredEmails, normalizedEmail]));
    } catch {
      setError('Could not save this registration in the browser tab. Please enable session storage and try again.');
      return;
    }

    onRegister(normalizedEmail, password, autoLocate, name.trim(), phone);
  };

  const generateResetOtp = () => {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    setGeneratedResetOtp(String(values[0] % 1_000_000).padStart(6, '0'));
    setResetOtpExpiresAt(Date.now() + 5 * 60 * 1000);
    setResetOtp('');
    setError('');
  };

  const handlePasswordReset = (event) => {
    event.preventDefault();
    if (!generatedResetOtp) {
      generateResetOtp();
      return;
    }
    if (Date.now() > resetOtpExpiresAt) {
      setError('That demo OTP has expired. Generate another one.');
      setGeneratedResetOtp('');
      setResetOtp('');
      return;
    }
    if (resetOtp !== generatedResetOtp) {
      setError('Enter the six-digit demo OTP shown below.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Use at least eight characters for your new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('The new passwords do not match.');
      return;
    }

    onPasswordReset(email.trim(), newPassword);
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setGeneratedResetOtp('');
    setResetOtp('');
    setMode('login');
    setError('');
    setNotice('Demo password updated. Sign in with your new password. No email was sent.');
  };

  return <div className={`login-page login-module luxury-theme theme-${theme}`}>
    <FoodMascots/>
    <section className="login-visual" aria-label="TastyTongue welcome">
      <div className="login-brand"><span className="brand-mark">t<span>·</span></span><span>TastyTongue</span></div>
      <img src={photo('photo-1565557623262-b51c2513a641', 1400)} alt="Indian curry and freshly prepared food"/>
      <div className="login-visual-shade"/>
      <div className="login-visual-copy">
        <div className="hero-kicker"><Sparkles size={13}/> GOOD FOOD, CLOSE TO HOME</div>
        <h1>India’s flavours,<br/><em>at your doorstep.</em></h1>
        <p>Find beloved Indian kitchens, regional favourites, and comforting meals nearby.</p>
      </div>
      <div className="login-visual-stat"><b>248</b><span>orders delivered today</span></div>
    </section>
    <main className="login-panel">
      <div className="login-card">
        <div className="login-heading">
          <div className="section-kicker">WELCOME TO TASTYTONGUE</div>
          <h2>{mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create your account' : 'Reset password'}</h2>
          <p>{mode === 'login' ? 'Sign in to discover Indian food around you.' : mode === 'register' ? 'Join TastyTongue to save favourites and order locally.' : 'Verify your demo code, then choose a new password.'}</p>
        </div>
        {mode === 'login' && <div className="login-role-tabs" role="tablist" aria-label="Login account type">
          <button type="button" role="tab" aria-selected={loginRole === 'customer'} className={loginRole === 'customer' ? 'active' : ''} onClick={() => setLoginRole('customer')}>
            <ShoppingBag size={16}/><span><b>Customer</b><small>Order local Indian food</small></span>
          </button>
          <button type="button" role="tab" aria-selected={loginRole === 'admin'} className={loginRole === 'admin' ? 'active' : ''} onClick={() => setLoginRole('admin')}>
            <ShieldCheck size={16}/><span><b>Admin</b><small>Manage the food marketplace</small></span>
          </button>
        </div>}
        <form className="login-form" onSubmit={mode === 'login' ? handleSubmit : mode === 'register' ? handleRegister : handlePasswordReset}>
          {mode !== 'forgot' && mode === 'register' && <>
            <label htmlFor="register-name">Full name</label>
            <div className="login-input"><UserRound size={16}/><input id="register-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" minLength={2} required/></div>
            <label htmlFor="register-phone">Indian mobile number</label>
            <div className="login-input"><Phone size={16}/><input id="register-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" autoComplete="tel-national" inputMode="numeric" pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number" required/></div>
          </>}
          {mode === 'forgot' && <>
            <label htmlFor="reset-email">Email address</label>
            <div className="login-input"><Mail size={16}/><input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required/></div>
            {generatedResetOtp && <div className="register-otp">
              <b>Demo email OTP: {generatedResetOtp}</b>
              <span>Displayed here for testing only; this prototype cannot send email. Code expires in five minutes.</span>
              <label htmlFor="reset-otp">Enter 6-digit OTP</label>
              <input id="reset-otp" type="text" value={resetOtp} onChange={(event) => setResetOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required/>
              <label htmlFor="reset-new-password">New password</label>
              <input id="reset-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={8} required/>
              <label htmlFor="reset-confirm-password">Confirm new password</label>
              <input id="reset-confirm-password" type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} autoComplete="new-password" minLength={8} required/>
              <button type="button" className="otp-resend" onClick={generateResetOtp}>Generate another OTP</button>
            </div>}
          </>}
          {mode !== 'forgot' && <>
            <label htmlFor="login-email">Email address</label>
            <div className="login-input"><Mail size={16}/><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={loginRole === 'admin' ? 'admin@tastytongue.in' : 'you@example.com'} autoComplete="email" required/></div>
            <label htmlFor="login-password">Password</label>
            <div className="login-input"><LockKeyhole size={16}/><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} required/></div>
          </>}
          {mode === 'register' && <>
            <label htmlFor="register-confirm-password">Confirm password</label>
            <div className="login-input"><LockKeyhole size={16}/><input id="register-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" autoComplete="new-password" minLength={8} required/></div>
          </>}
          {mode === 'login' && <div className="login-options"><label><input type="checkbox"/> <span>Remember me</span></label><button type="button" onClick={() => { setMode('forgot'); setError(''); setNotice(''); setGeneratedResetOtp(''); }}>Forgot password?</button></div>}
          {mode !== 'forgot' && (mode === 'register' || loginRole === 'customer') && <label className="login-auto-location"><input type="checkbox" checked={autoLocate} onChange={(event) => setAutoLocate(event.target.checked)}/><span>Auto-detect my delivery location after sign-in <small>Browser location permission will be requested.</small></span></label>}
          {mode === 'register' && generatedOtp && <div className="register-otp">
            <b>Demo OTP: {generatedOtp}</b>
            <span>For this prototype only. No SMS or email is sent. Expires in five minutes.</span>
            <label htmlFor="register-otp">Enter 6-digit OTP</label>
            <input id="register-otp" type="text" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" required/>
            <button type="button" className="otp-resend" onClick={generateOtp}>Generate another OTP</button>
          </div>}
          {error && <div className="login-error" role="alert">{error}</div>}
          {notice && <div className="login-success" role="status">{notice}</div>}
          <button className="login-submit" type="submit">{mode === 'login' ? `Sign in as ${loginRole === 'admin' ? 'admin' : 'customer'}` : mode === 'register' ? generatedOtp ? 'Verify OTP & create account' : 'Generate demo OTP' : generatedResetOtp ? 'Verify OTP & reset password' : 'Generate demo OTP'} <ArrowRight size={16}/></button>
        </form>
        <button className="login-mode-switch" type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setNotice(''); setGeneratedOtp(''); setOtp(''); setGeneratedResetOtp(''); setResetOtp(''); }}>
          {mode === 'login' ? 'New to TastyTongue? Create an account' : <><ArrowLeft size={14}/> Back to sign in</>}
        </button>
        <p className="login-demo">{mode === 'login' ? 'Demo sign-in: any email and password unless you have reset a demo account password. GPS is optional; map tiles are provided by OpenStreetMap.' : mode === 'register' ? 'Demo registration only: OTP is generated in this browser and is not sent or verified by a server.' : 'Demo password recovery: OTP is displayed in this browser and is not emailed.'}</p>
      </div>
    </main>
  </div>;
}
