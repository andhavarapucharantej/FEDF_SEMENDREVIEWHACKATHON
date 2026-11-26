import { useRef, useState } from 'react';
import { ArrowRight, Box, Rotate3D } from 'lucide-react';
import './OrderTelemetryModule.css';

export default function OrderTelemetryModule({ orders = [], orderStatus = {}, onTrackOrders, adminView = false }) {
  const [rotation, setRotation] = useState({ x: -18, y: -34 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);

  const totalOrders = orders.length;
  const activeOrders = orders.filter((order) => {
    const status = orderStatus[order.statusKey || order.id] || order.status || 'New';
    return status !== 'Completed' && status !== 'Cancelled';
  }).length;
  const preparingOrders = orders.filter((order) => {
    const status = orderStatus[order.statusKey || order.id] || order.status || 'New';
    return status === 'Preparing' || status === 'Ready for pickup';
  }).length;

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      rotateX: rotation.x,
      rotateY: rotation.y,
    };
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragStart.current) return;
    setRotation({
      x: dragStart.current.rotateX - (event.clientY - dragStart.current.y) * 0.7,
      y: dragStart.current.rotateY + (event.clientX - dragStart.current.x) * 0.7,
    });
  };

  const handlePointerUp = () => {
    dragStart.current = null;
    setDragging(false);
  };

  const handleKeyDown = (event) => {
    const step = event.shiftKey ? 20 : 10;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setRotation((current) => ({ ...current, y: current.y + (event.key === 'ArrowRight' ? step : -step) }));
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      setRotation((current) => ({ ...current, x: current.x + (event.key === 'ArrowDown' ? step : -step) }));
    }
  };

  return <section className={`order-telemetry ${adminView ? 'admin-telemetry' : ''}`} aria-label="Order telemetry cube">
    <div className="telemetry-copy">
      <span className="telemetry-kicker"><Rotate3D size={13}/> INTERACTIVE ORDER VIEW · DEMO DATA</span>
      <h2>{adminView ? 'Order telemetry cube' : 'Your orders, in motion.'}</h2>
      <p>Drag the cube or use arrow keys to explore order activity. Counts update from this session’s order data.</p>
      <div className="telemetry-actions">
        <button type="button" className="telemetry-track-button" onClick={onTrackOrders}>Track {adminView ? 'orders' : 'my orders'} <ArrowRight size={15}/></button>
        <span className="telemetry-demo-tag"><i/> Demo view</span>
      </div>
      <div className="telemetry-stats" aria-label="Order counts">
        <div><small>{adminView ? 'ALL ORDERS' : 'MY ORDERS'}</small><b>{totalOrders}</b></div>
        <div><small>IN PROGRESS</small><b>{activeOrders}</b></div>
        <div><small>PREPARING</small><b>{preparingOrders}</b></div>
      </div>
    </div>
    <div className="telemetry-scene">
      <div
        className={`telemetry-cube ${dragging ? 'is-dragging' : ''}`}
        role="group"
        aria-label="Interactive order telemetry cube. Drag to rotate or use arrow keys."
        tabIndex="0"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
      >
        <div className="telemetry-face telemetry-front">
          <span className="cube-mark"><Box size={25}/></span>
          <b>TastyTongue</b><small>Local food fleet</small>
          <em>{activeOrders} active</em>
        </div>
        <div className="telemetry-face telemetry-back"><b>SESSION ORDERS</b><strong>{totalOrders}</strong><small>Order count</small></div>
        <div className="telemetry-face telemetry-right"><b>PREPARING</b><strong>{preparingOrders}</strong><small>Kitchen activity</small></div>
        <div className="telemetry-face telemetry-left"><b>IN PROGRESS</b><strong>{activeOrders}</strong><small>Current orders</small></div>
        <div className="telemetry-face telemetry-top"><span>TT</span><b>ORDER DATA</b></div>
        <div className="telemetry-face telemetry-bottom"><span>INDIA · LOCAL DEMO</span></div>
      </div>
      <span className="telemetry-floor"/>
      <small className="telemetry-hint">Drag to rotate · arrow keys also work</small>
    </div>
  </section>;
}
