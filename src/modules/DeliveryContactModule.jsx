import { useEffect, useRef, useState } from 'react';
import { Bike, MessageCircle, Phone, Send } from 'lucide-react';
import './DeliveryContactModule.css';

function getDemoReply(message, status, order) {
  const prompt = message.toLowerCase();
  if (/payment|pay\b|upi|phonepe|google pay|gpay|paytm|card/.test(prompt)) {
    return order?.paymentMethod
      ? `Order ${order.id} is set to ${order.paymentMethod}. The checkout is a demo and does not process a real payment.`
      : 'You can choose Cash on Delivery, PhonePe, Google Pay, Paytm/other UPI, card, or QR at checkout. Online methods are demo-only.';
  }
  if (/coupon|promo|offer|discount|birthday/.test(prompt)) {
    return order?.couponCode
      ? `Coupon ${order.couponCode} is applied, saving ₹${order.discount || 0} on this demo order.`
      : 'Try WELCOME50 (₹50 off ₹249+), TASTY10 (10% off ₹499+), or BIRTHDAY15 (15% off ₹399+). Birthday eligibility is not verified in this demo.';
  }
  if (/eta|time|deliver|late|arriv|when/.test(prompt)) {
    return 'The map shows an accelerated 2-minute delivery simulation, not a real-world ETA. Live courier tracking is not connected.';
  }
  if (/driver|courier|rider|contact|call/.test(prompt)) {
    return 'A real delivery partner is not connected yet, so their name and phone number are unavailable. The contact panel is a demo.';
  }
  if (/location|address|destination|city/.test(prompt)) {
    const area = order?.deliveryLocation?.source === 'city'
      ? order.deliveryLocation.cityName
      : order?.deliveryLocation?.source === 'gps'
        ? 'your selected GPS location'
        : 'not selected for this order';
    return `The delivery area on this order is ${area}. You can change your location from the location selector.`;
  }
  if (/cancel|refund/.test(prompt)) {
    return 'I can’t cancel or refund an order in this demo. Please use My Orders or contact the restaurant when live support is connected.';
  }
  if (/status|track|confirm|where is my order|is my order/.test(prompt)) {
    return `Order ${order?.id || ''} is currently “${status}”. ${order?.restaurantName ? `It is from ${order.restaurantName}.` : ''} This is a demo status, not a live dispatch update.`;
  }
  if (/hello|hi\b|hey|good morning|good evening/.test(prompt)) {
    return 'Hello! I can help with your order status, delivery timing, location, payment methods, and available offers. What would you like to know?';
  }
  if (/menu|food|restaurant|biryani|dosa|dish/.test(prompt)) {
    return 'Browse the Discover page for local restaurants and menu items. I can also help with order status, payment choices, and coupons.';
  }
  return 'I can help with order status, ETA, your delivery area, payment methods, and coupons. Try a question like “What is my order status?”';
}

export default function DeliveryContactModule({ status, order }) {
  const [message, setMessage] = useState('');
  const chatLogRef = useRef(null);
  const [messages, setMessages] = useState([{
    id: 0,
    from: 'bot',
    text: 'Hi! I’m the TastyTongue demo assistant. Ask me about your order, delivery time or payment.',
  }]);

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: current.length, from: 'you', text: trimmed },
      { id: current.length + 1, from: 'bot', text: getDemoReply(trimmed, status, order) },
    ]);
    setMessage('');
  };

  return <section className="delivery-contact" aria-label="Delivery partner contact and order messages">
    <div className="delivery-contact-head">
      <span className="delivery-contact-icon"><Bike size={18}/></span>
      <div><small>DELIVERY PARTNER · DEMO</small><b>Courier contact</b></div>
      <span className="delivery-contact-status">{status}</span>
    </div>
    <div className="delivery-contact-details">
      <div><b>Partner details appear after dispatch</b><span>Driver name and phone are not connected in this demo.</span></div>
      <button type="button" onClick={() => sendMessage('Can I call my delivery partner?')} title="Ask the demo assistant about courier contact"><Phone size={15}/> Ask about courier</button>
    </div>
    <div className="delivery-chat-heading"><MessageCircle size={15}/><b>TastyTongue AI assistant</b><span>DEMO AI</span></div>
    <div className="delivery-chat-log" ref={chatLogRef} role="log" aria-live="polite">
      {messages.map((item) => <p className={`delivery-chat-message ${item.from}`} key={item.id}>{item.text}</p>)}
    </div>
    <div className="delivery-quick-questions">
      <button className="delivery-status-request" type="button" onClick={() => sendMessage('Please confirm my order status.')}>Order status</button>
      <button className="delivery-status-request" type="button" onClick={() => sendMessage('What is the delivery ETA?')}>ETA</button>
      <button className="delivery-status-request" type="button" onClick={() => sendMessage('What payment methods are available?')}>Payments</button>
      <button className="delivery-status-request" type="button" onClick={() => sendMessage('What coupons or offers can I use?')}>Coupons</button>
    </div>
    <form className="delivery-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage(message); }}>
      <label className="sr-only" htmlFor="delivery-message">Message about this order</label>
      <input id="delivery-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about status, ETA, or offers…" maxLength={240}/>
      <button type="submit" disabled={!message.trim()} aria-label="Send message"><Send size={15}/></button>
    </form>
    <p className="delivery-contact-note">Demo AI replies are generated locally; no real courier or AI service is contacted.</p>
  </section>;
}
