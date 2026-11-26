import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ClipboardList,
  LayoutDashboard,
  Search,
  Star,
  Store,
  TrendingUp,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { money, photo } from '../data/catalog.js';
import OrderTelemetryModule from './OrderTelemetryModule.jsx';
import './AdminModule.css';

const demoOrders = [
  { id: 'TT-2481', customer: 'riya@example.in', restaurant: 'Tandoori Junction', total: 849, time: '2 min ago', key: 1, paymentMethod: 'Cash on delivery' },
  { id: 'TT-2482', customer: 'Priya Sharma', restaurant: 'Dilli Chaat Corner', total: 599, time: '6 min ago', key: 2, paymentMethod: 'UPI (demo)' },
  { id: 'TT-2483', customer: 'Aarav Patel', restaurant: 'Madras Tiffin House', total: 499, time: '12 min ago', key: 3, paymentMethod: 'Card (demo)' },
  { id: 'TT-2484', customer: 'Ananya Rao', restaurant: 'Nizam’s Dum Kitchen', total: 750, time: '18 min ago', key: 4, paymentMethod: 'Cash on delivery' },
];

const demoRestaurantContacts = {
  1: { owner: 'Aditi Mehra', phone: '+91 00000 00001', email: 'owner01@example.invalid' },
  2: { owner: 'Kabir Sethi', phone: '+91 00000 00002', email: 'owner02@example.invalid' },
  3: { owner: 'Meera Iyer', phone: '+91 00000 00003', email: 'owner03@example.invalid' },
  4: { owner: 'Zoya Khan', phone: '+91 00000 00004', email: 'owner04@example.invalid' },
  5: { owner: 'Rohan Desai', phone: '+91 00000 00005', email: 'owner05@example.invalid' },
  6: { owner: 'Nisha Shah', phone: '+91 00000 00006', email: 'owner06@example.invalid' },
};

export default function AdminModule({
  userEmail,
  orders,
  orderStatus,
  onOrderStatusChange,
  restaurants,
  restaurantReviews,
  restaurantAvailability,
  setRestaurantAvailability,
  menuItems,
  onMenuPriceChange,
  available,
  setAvailable,
}) {
  const [tab, setTab] = useState('Overview');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);
  const displayOrders = useMemo(() => orders.length
    ? orders.map((order) => ({
      ...order,
      customer: order.email,
      restaurant: order.restaurantName,
      time: order.time || 'Just now',
      statusKey: order.id,
    }))
    : demoOrders.map((order) => ({ ...order, statusKey: order.key })), [orders]);
  const matches = (value) => value.toLowerCase().includes(query.toLowerCase());
  const filteredOrders = displayOrders.filter((order) => matches(`${order.id} ${order.customer} ${order.restaurant}`));

  return <div className="page-content role-page admin-page admin-module">
    <div className="admin-welcome">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot"/> PLATFORM CONTROL CENTRE</div>
        <h1>Welcome, <em>{userEmail}</em></h1>
        <p>Here’s what’s happening across our Indian kitchens today.</p>
      </div>
      <div className="admin-date"><span className="online-dot"/> ALL SYSTEMS OPERATIONAL</div>
    </div>

    <div className="admin-stats">
      <article><span className="stat-icon green"><ClipboardList size={17}/></span><small>TODAY’S ORDERS</small><b>{248 + orders.length} <i>+12.8%</i></b><span>vs. yesterday</span><TrendingUp className="stat-trend" size={16}/></article>
      <article><span className="stat-icon amber"><Store size={17}/></span><small>ACTIVE RESTAURANTS</small><b>{Object.values(restaurantAvailability).filter(Boolean).length} <i>of {restaurants.length}</i></b><span>partner kitchens online</span></article>
      <article><span className="stat-icon peach"><Users size={17}/></span><small>ACTIVE CUSTOMERS</small><b>1,842 <i>+8.4%</i></b><span>this week</span></article>
      <article><span className="stat-icon lavender"><TrendingUp size={17}/></span><small>GROSS SALES</small><b>{money(184750 + orders.reduce((sum, order) => sum + order.total, 0))} <i>+15.2%</i></b><span>today across the platform</span></article>
    </div>

    <OrderTelemetryModule
      orders={displayOrders}
      orderStatus={orderStatus}
      adminView
      onTrackOrders={() => setTab('Orders')}
    />

    <div className="admin-tabs" role="tablist" aria-label="Admin sections">
      {[
        ['Overview', LayoutDashboard],
        ['Orders', ClipboardList],
        ['Restaurants', Store],
        ['Menu items', UtensilsCrossed],
      ].map(([label, Icon]) => <button key={label} role="tab" aria-selected={tab === label} className={tab === label ? 'active' : ''} onClick={() => { setTab(label); setSaved(false); }}>
        <Icon size={15}/>{label}{label === 'Orders' && <span className="tab-count">{displayOrders.length}</span>}
      </button>)}
    </div>

    {tab === 'Overview' && <div className="admin-overview-grid">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><div className="section-kicker">LIVE OPERATIONS</div><h2>Recent orders</h2></div>
          <button className="text-link" onClick={() => setTab('Orders')}>View all <ArrowRight size={14}/></button>
        </div>
        <div className="admin-order-list">{displayOrders.slice(0, 4).map((order) => {
          const status = orderStatus[order.statusKey] || order.status || 'New';
          return <div className="admin-order-row" key={order.id}>
            <span className="order-avatar">{(order.customer || 'C')[0].toUpperCase()}</span>
            <div className="admin-order-main"><b>{order.customer}</b><small>{order.restaurant} · {order.time}</small></div>
            <strong>{money(order.total)}</strong>
            <span className={`status-chip ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
          </div>;
        })}</div>
      </section>
      <section className="admin-panel quick-panel">
        <div className="section-kicker">QUICK ACCESS</div><h2>Manage your marketplace</h2><p>Jump into the tools you use most.</p>
        <button onClick={() => setTab('Restaurants')}><span className="quick-icon"><Store size={16}/></span><span><b>Restaurant partners</b><small>Review listings and availability</small></span><ArrowRight size={15}/></button>
        <button onClick={() => setTab('Menu items')}><span className="quick-icon"><UtensilsCrossed size={16}/></span><span><b>Menu catalog</b><small>Update items and pricing</small></span><ArrowRight size={15}/></button>
      </section>
    </div>}

    {tab === 'Orders' && <section className="admin-panel admin-table-panel">
      <div className="admin-panel-heading">
        <div><div className="section-kicker">ORDER MANAGEMENT</div><h2>All incoming orders</h2></div>
        <div className="search-box admin-search"><Search size={15}/><input aria-label="Search orders" placeholder="Search by order or customer" value={query} onChange={(event) => setQuery(event.target.value)}/></div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>RESTAURANT</th><th>PLACED</th><th>PAYMENT</th><th>TOTAL</th><th>STATUS</th></tr></thead>
          <tbody>{filteredOrders.map((order) => <tr key={order.id}>
            <td><b>#{order.id}</b></td><td>{order.customer}</td><td>{order.restaurant}</td><td>{order.time}</td><td>{order.paymentMethod || 'Cash on delivery'}</td><td><b>{money(order.total)}</b></td>
            <td><select aria-label={`Update order ${order.id}`} value={orderStatus[order.statusKey] || order.status || 'New'} onChange={(event) => onOrderStatusChange(order.statusKey, event.target.value)}>
              <option>New</option><option>Confirmed</option><option>Preparing</option><option>Ready for pickup</option><option>Completed</option><option>Cancelled</option>
            </select></td>
          </tr>)}</tbody>
        </table>
        {filteredOrders.length === 0 && <div className="admin-empty">No orders match that search.</div>}
      </div>
    </section>}

    {tab === 'Restaurants' && <section className="admin-panel admin-table-panel">
      <div className="admin-panel-heading">
        <div><div className="section-kicker">PARTNER DIRECTORY</div><h2>Restaurant partners</h2></div>
        <div className="search-box admin-search"><Search size={15}/><input aria-label="Search restaurants" placeholder="Search restaurants" value={query} onChange={(event) => setQuery(event.target.value)}/></div>
      </div>
      <p className="partner-demo-note">Owner and contact information below is fictional demo data; phone numbers do not connect to real people.</p>
      <div className="partner-list">{restaurants.filter((restaurant) => matches(`${restaurant.name} ${restaurant.cuisine}`)).map((restaurant) => {
        const reviews = restaurantReviews[restaurant.id] || [];
        const contact = demoRestaurantContacts[restaurant.id];
        return <div className="partner-row" key={restaurant.id}>
        <img src={photo(restaurant.image, 180)} alt=""/>
        <div className="partner-main">
          <b>{restaurant.name}</b>
          <small>{restaurant.cuisine} · {restaurant.detail}</small>
          <span className="partner-contact-details">
            <span>Owner: {contact.owner}</span>
            <span>Phone: {contact.phone} · {contact.email}</span>
          </span>
          {reviews.length > 0 && <small className="partner-review-note">{reviews.length} customer {reviews.length === 1 ? 'review' : 'reviews'} · Latest: {reviews[reviews.length - 1].comment || `${reviews[reviews.length - 1].rating} stars, no comment`}</small>}
        </div>
        <span className="partner-rating"><Star size={13} fill="currentColor"/>{restaurant.rating}<small>{restaurant.reviewCount || 0}</small></span>
        <span className={`partner-state ${restaurantAvailability[restaurant.id] ? 'online' : 'paused'}`}><i/>{restaurantAvailability[restaurant.id] ? 'Active' : 'Paused'}</span>
        <button className={`availability-toggle ${restaurantAvailability[restaurant.id] ? 'is-available' : ''}`} onClick={() => setRestaurantAvailability((state) => ({ ...state, [restaurant.id]: !state[restaurant.id] }))}>
          {restaurantAvailability[restaurant.id] ? 'Pause listing' : 'Activate listing'}
        </button>
      </div>;
      })}</div>
    </section>}

    {tab === 'Menu items' && <section className="admin-panel admin-table-panel">
      <div className="admin-panel-heading">
        <div><div className="section-kicker">MENU CATALOG</div><h2>Items and pricing</h2></div>
        <div className="search-box admin-search"><Search size={15}/><input aria-label="Search menu items" placeholder="Search menu items" value={query} onChange={(event) => setQuery(event.target.value)}/></div>
      </div>
      <div className="partner-list">{menuItems.filter((item) => matches(`${item.name} ${item.desc}`)).map((item) => <div className="partner-row menu-admin-row" key={item.id}>
        <img src={photo(item.image, 180)} alt=""/>
        <div className="partner-main"><b>{item.name}</b><small>{item.desc}</small></div>
        <label className="price-editor">₹<input aria-label={`Price in rupees for ${item.name}`} type="number" min="0" step="1" value={item.price} onChange={(event) => { onMenuPriceChange(item.id, Number(event.target.value)); setSaved(false); }}/></label>
        <button className={`availability-toggle ${available[item.id] ? 'is-available' : ''}`} onClick={() => setAvailable((state) => ({ ...state, [item.id]: !state[item.id] }))}><i/>{available[item.id] ? 'Available' : 'Paused'}</button>
      </div>)}</div>
      <div className="admin-save-row"><span>{saved ? 'Changes confirmed for this session.' : 'Customer listings update immediately; save to confirm your changes.'}</span><button className="primary-btn" onClick={() => setSaved(true)}>{saved ? <><Check size={14}/> Saved</> : 'Save changes'}</button></div>
    </section>}

    <footer className="footer"><span>Made with <b>♥</b> for India</span><span>All prices in ₹ <span className="footer-dot">·</span> TASTYTONGUE ADMIN preview</span></footer>
  </div>;
}