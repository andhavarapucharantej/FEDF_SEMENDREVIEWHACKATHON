import { ArrowRight, Bike, ClipboardList } from 'lucide-react';
import { money } from '../data/catalog.js';
import './MyOrdersModule.css';

export default function MyOrdersModule({ orders, orderStatus, onTrack, onExplore }) {
  return <div className="page-content my-orders-module">
    <section className="my-orders-header">
      <div>
        <div className="section-kicker">YOUR ACCOUNT</div>
        <h1>My orders</h1>
        <p>Review your recent orders and open the tracking preview.</p>
      </div>
      <span className="my-orders-count"><ClipboardList size={16}/>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
    </section>
    {orders.length === 0 ? <section className="my-orders-empty">
      <span className="my-orders-empty-icon"><ClipboardList size={24}/></span>
      <h2>No orders yet</h2>
      <p>Your orders will appear here after you place one.</p>
      <button className="primary-btn" onClick={onExplore}>Explore restaurants <ArrowRight size={15}/></button>
    </section> : <section className="my-orders-list" aria-label="Order history">
      {orders.map((order) => {
        const status = orderStatus[order.id] || order.status || 'Confirmed';
        return <article className="my-order-card" key={order.id}>
          <div className="my-order-card-top">
            <div><span className="my-order-id">#{order.id}</span><small>{order.placedAt}</small></div>
            <span className={`my-order-status ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
          </div>
          <div className="my-order-info">
            <b>{order.restaurantName}</b>
            <span>{order.itemSummary}</span>
            <span>Paid by {order.paymentMethod || 'Cash on delivery'}{order.couponCode ? ` · ${order.couponCode} saved ${money(order.discount || 0)}` : ''}</span>
          </div>
          <div className="my-order-card-bottom"><strong>{money(order.total)}</strong><button className="my-order-track" onClick={() => onTrack(order)}><Bike size={15}/> Track order</button></div>
        </article>;
      })}
    </section>}
  </div>;
}
