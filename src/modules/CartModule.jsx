import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { money, photo } from '../data/catalog.js';
import './CartModule.css';

export default function CartModule({ cart, count, subtotal, menuItems, available, onChangeQuantity, onClose, onCheckout }) {
  const items = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => ({ item: menuItems.find((entry) => entry.id === Number(id)), quantity }))
    .filter(({ item }) => item);
  const hasUnavailableItems = items.some(({ item }) => !available[item.id]);

  return <div className="backdrop cart-module-backdrop" onClick={onClose}>
    <aside className="cart-panel cart-module" aria-label="Shopping cart" onClick={(event) => event.stopPropagation()}>
      <div className="drawer-head">
        <div><div className="section-kicker">YOUR BASKET</div><h2>Your basket <span>({count})</span></h2></div>
        <button className="close-btn" aria-label="Close basket" onClick={onClose}><X size={19}/></button>
      </div>
      {items.length === 0 ? <div className="cart-empty">
        <div className="empty-icon"><ShoppingBag size={27}/></div>
        <h3>Your basket is empty.</h3>
        <p>Add a favourite from one of our Indian kitchens.</p>
        <button className="primary-btn" onClick={onClose}>Explore restaurants <ArrowRight size={15}/></button>
      </div> : <>
        <div className="basket-items">{items.map(({ item, quantity }) => <div className="basket-item" key={item.id}>
          <img src={photo(item.image, 200)} alt=""/>
          <div className="basket-item-copy">
            <b>{item.name}</b><small>{money(item.price)} each</small>
            <div className="qty-control">
              <button onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13}/></button>
              <span>{quantity}</span>
              <button onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`} disabled={!available[item.id]}><Plus size={13}/></button>
            </div>
            {!available[item.id] && <small className="basket-unavailable">Currently unavailable — remove it to continue.</small>}
          </div>
          <strong>{money(item.price * quantity)}</strong>
        </div>)}</div>
        <div className="basket-footer">
          <button className="add-more" onClick={onClose}>+ Add something else</button>
          <div className="subtotal-line"><span>Subtotal</span><b>{money(subtotal)}</b></div>
          <div className="subtotal-line muted-line"><span>Delivery fee</span><span>On us today ✨</span></div>
          <button className="checkout-btn" onClick={onCheckout} disabled={hasUnavailableItems}>Place order <span>{money(subtotal)}</span><ArrowRight size={16}/></button>
          {hasUnavailableItems && <p className="basket-unavailable-note">Remove paused items before checkout.</p>}
          <p className="checkout-note">Taxes calculated at checkout · Your order supports local kitchens</p>
        </div>
      </>}
    </aside>
  </div>;
}
