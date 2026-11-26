import { useState } from 'react';
import { ArrowLeft, Banknote, Check, CreditCard, Gift, QrCode, Smartphone, Tag, X } from 'lucide-react';
import { money } from '../data/catalog.js';
import './PaymentModule.css';

const offers = [
  { code: 'WELCOME50', title: 'Welcome treat', detail: '₹50 off orders of ₹249 or more', min: 249, type: 'flat', value: 50 },
  { code: 'TASTY10', title: 'Tasty savings', detail: '10% off up to ₹100 on orders of ₹499+', min: 499, type: 'percent', value: 10, max: 100 },
  { code: 'BIRTHDAY15', title: 'Birthday treat', detail: '15% off up to ₹150 on orders of ₹399+', min: 399, type: 'percent', value: 15, max: 150 },
];

const paymentMethods = [
  { id: 'cod', title: 'Cash on delivery', detail: 'Pay when your order arrives', Icon: Banknote },
  { id: 'upi', title: 'UPI apps', detail: 'PhonePe, Google Pay, Paytm and more', Icon: Smartphone },
  { id: 'qr', title: 'Scan a QR code', detail: 'Demo option · payment QR not connected', Icon: QrCode },
  { id: 'card', title: 'Credit or debit card', detail: 'Gateway required · no card details collected', Icon: CreditCard },
];

export default function PaymentModule({ subtotal, count, onClose, onPlaceOrder }) {
  const [method, setMethod] = useState('cod');
  const [upiProvider, setUpiProvider] = useState('Google Pay');
  const [couponInput, setCouponInput] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [error, setError] = useState('');

  const applyCoupon = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    const offer = offers.find((item) => item.code === code);
    if (!offer) {
      setError('That coupon code is not available.');
      return;
    }
    if (subtotal < offer.min) {
      setError(`Add items worth ${money(offer.min - subtotal)} more to use ${offer.code}.`);
      return;
    }

    const savings = offer.type === 'flat'
      ? offer.value
      : Math.min(Math.round(subtotal * offer.value / 100), offer.max);
    setAppliedOffer({ ...offer, savings });
    setCouponInput(offer.code);
    setError('');
  };

  const discount = appliedOffer?.savings || 0;
  const payable = Math.max(0, subtotal - discount);
  const submitOrder = () => onPlaceOrder({
    paymentMethod: method === 'cod'
      ? 'Cash on delivery'
      : method === 'upi'
        ? `${upiProvider} (demo)`
        : method === 'qr'
          ? 'QR scan (demo)'
          : 'Card (demo)',
    couponCode: appliedOffer?.code || '',
    discount,
    subtotal,
    total: payable,
  });

  return <div className="modal-backdrop payment-backdrop" onClick={onClose}>
    <section className="payment-dialog" role="dialog" aria-modal="true" aria-labelledby="payment-title" onClick={(event) => event.stopPropagation()}>
      <header className="payment-header">
        <div><small>SECURE CHECKOUT · DEMO</small><h2 id="payment-title">Payment & offers</h2><p>{count} {count === 1 ? 'item' : 'items'} in your order</p></div>
        <button type="button" className="close-btn" onClick={onClose} aria-label="Close checkout"><X size={19}/></button>
      </header>

      <div className="payment-scroll">
        <section className="payment-methods" aria-label="Choose a payment method">
          <h3>Choose how to pay</h3>
          {paymentMethods.map(({ id, title, detail, Icon }) => <button
            type="button"
            className={`payment-method ${method === id ? 'selected' : ''}`}
            key={id}
            aria-pressed={method === id}
            onClick={() => setMethod(id)}
          >
            <span className="payment-method-icon"><Icon size={17}/></span>
            <span className="payment-method-copy"><b>{title}</b><small>{detail}</small></span>
            <span className="payment-method-check">{method === id && <Check size={14}/>}</span>
          </button>)}
          {method === 'upi' && <div className="upi-provider-picker" role="group" aria-label="Choose a UPI app">
            {['PhonePe', 'Google Pay', 'Paytm', 'Other UPI'].map((provider) => <button type="button" className={upiProvider === provider ? 'selected' : ''} aria-pressed={upiProvider === provider} key={provider} onClick={() => setUpiProvider(provider)}>{provider}</button>)}
            <p>Demo selection only; no UPI app is opened and no payment is sent.</p>
          </div>}
          {method === 'qr' && <div className="qr-preview">
            <QrCode size={34}/>
            <b>QR checkout preview</b>
            <span>A scannable payment QR needs a merchant UPI ID and a connected gateway.</span>
            <small>NOT A REAL PAYMENT QR</small>
          </div>}
          {method !== 'cod' && <p className="payment-demo-note">Demo only: no money is charged. Connect a payment gateway to accept real payments. Never enter real card or UPI details here.</p>}
        </section>

        <section className="payment-offers">
          <h3><Tag size={16}/> Offers & coupons</h3>
          <form className="coupon-form" onSubmit={(event) => { event.preventDefault(); applyCoupon(couponInput); }}>
            <input aria-label="Coupon code" value={couponInput} onChange={(event) => { setCouponInput(event.target.value); setAppliedOffer(null); setError(''); }} placeholder="Enter coupon code"/>
            {appliedOffer
              ? <button type="button" onClick={() => { setAppliedOffer(null); setCouponInput(''); setError(''); }}>Remove</button>
              : <button type="submit">Apply</button>}
          </form>
          {error && <p className="coupon-error" role="alert">{error}</p>}
          {appliedOffer && <p className="coupon-applied" role="status"><Check size={13}/> {appliedOffer.code} applied — saving {money(discount)}</p>}
          <div className="available-offers">
            {offers.map((offer) => <article className="available-offer" key={offer.code}>
              <span className="offer-icon"><Gift size={15}/></span>
              <span><b>{offer.title}</b><small>{offer.detail}{offer.code === 'BIRTHDAY15' ? ' · Demo, not birthday-verified' : ''}</small></span>
              <button type="button" onClick={() => applyCoupon(offer.code)} aria-label={`Apply ${offer.code}`}>{appliedOffer?.code === offer.code ? 'Applied' : 'Apply'}</button>
            </article>)}
          </div>
        </section>

        <section className="payment-summary">
          <h3>Bill summary</h3>
          <div><span>Item subtotal</span><b>{money(subtotal)}</b></div>
          <div><span>Delivery</span><b>Free</b></div>
          {discount > 0 && <div className="payment-discount"><span>{appliedOffer.code} discount</span><b>−{money(discount)}</b></div>}
          <div className="payment-total"><span>To pay</span><b>{money(payable)}</b></div>
        </section>
      </div>

      <footer className="payment-footer">
        <p>Prototype checkout only. Online payments and birthday eligibility are not verified.</p>
        <button type="button" className="payment-place-order" onClick={submitOrder}>
          {method === 'cod' ? 'Place cash-on-delivery order' : method === 'qr' ? 'Continue with demo QR' : 'Place demo order'} · {money(payable)}
        </button>
        <button type="button" className="payment-back" onClick={onClose}><ArrowLeft size={14}/> Back to menu</button>
      </footer>
    </section>
  </div>;
}
