import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Check,
  ChevronDown,
  ClipboardList,
  Clock3,
  Compass,
  Heart,
  Leaf,
  Minus,
  Moon,
  Plus,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  UserRound,
  X,
} from 'lucide-react';
import { categories, menu, money, photo, restaurants } from './data/catalog.js';
import { indianCities } from './data/indianCities.js';
import AdminModule from './modules/AdminModule.jsx';
import CartModule from './modules/CartModule.jsx';
import DeliveryContactModule from './modules/DeliveryContactModule.jsx';
import FoodMascots from './modules/FoodMascots.jsx';
import LoginModule from './modules/LoginModule.jsx';
import LocationMapModule from './modules/LocationMapModule.jsx';
import LocationPickerModule from './modules/LocationPickerModule.jsx';
import MyOrdersModule from './modules/MyOrdersModule.jsx';
import PaymentModule from './modules/PaymentModule.jsx';
import ProfileModule from './modules/ProfileModule.jsx';
import RatingModule from './modules/RatingModule.jsx';
import SettingsModule from './modules/SettingsModule.jsx';
import TrackingMap from './modules/TrackingMap.jsx';
import UserModule from './modules/UserModule.jsx';
import './App.css';

const themeForLocalTime = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [activeView, setActiveView] = useState('discover');
  const [location, setLocation] = useState(null);
  const [trackedLocation, setTrackedLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const [trackingLocation, setTrackingLocation] = useState(false);
  const gpsWatchId = useRef(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [restaurantReviews, setRestaurantReviews] = useState({});
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [selected, setSelected] = useState(null);
  const [menuMode, setMenuMode] = useState('veg');
  const [schedule, setSchedule] = useState(false);
  const [scheduled, setScheduled] = useState('ASAP');
  const [tracking, setTracking] = useState(false);
  const [sort, setSort] = useState(false);
  const [sortBy, setSortBy] = useState('Recommended');
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [restaurantAvailability, setRestaurantAvailability] = useState(
    () => Object.fromEntries(restaurants.map(({ id }) => [id, true])),
  );
  const [menuPrices, setMenuPrices] = useState(
    () => Object.fromEntries(menu.map(({ id, price }) => [id, price])),
  );
  const [available, setAvailable] = useState(() => Object.fromEntries(menu.map(({ id }) => [id, true])));
  const [currentOrder, setCurrentOrder] = useState(null);
  const [demoCredential, setDemoCredential] = useState(null);
  const [preferences, setPreferences] = useState(() => ({
    orderUpdates: true,
    emailOffers: false,
    autoDetectLocation: true,
    theme: themeForLocalTime(),
  }));

  const count = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const menuItems = useMemo(() => menu.map((item) => ({
    ...item,
    price: menuPrices[item.id] ?? item.price,
  })), [menuPrices]);
  const subtotal = Object.entries(cart).reduce((total, [id, quantity]) => (
    total + (menuItems.find((item) => item.id === Number(id))?.price || 0) * quantity
  ), 0);
  const ratedRestaurants = useMemo(() => restaurants.map((restaurant) => {
    const reviews = restaurantReviews[restaurant.id] || [];
    const reviewTotal = reviews.reduce((total, review) => total + review.rating, Number(restaurant.rating));
    return {
      ...restaurant,
      rating: (reviewTotal / (reviews.length + 1)).toFixed(1),
      reviewCount: reviews.length,
    };
  }), [restaurantReviews]);
  const visibleRestaurants = useMemo(() => {
    let visible = ratedRestaurants.filter((restaurant) => (
      restaurantAvailability[restaurant.id]
      && (category === 'All' || restaurant.cuisine === category)
      && `${restaurant.name} ${restaurant.cuisine} ${restaurant.detail}`.toLowerCase().includes(search.toLowerCase())
    ));
    if (sortBy === 'Top rated') visible = [...visible].sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sortBy === 'Fastest delivery') visible = [...visible].sort((a, b) => Number(a.time.split('–')[0]) - Number(b.time.split('–')[0]));
    if (activeView === 'favorites') visible = visible.filter((restaurant) => favorites.includes(restaurant.id));
    return visible;
  }, [activeView, category, favorites, ratedRestaurants, restaurantAvailability, search, sortBy]);

  const submitRestaurantReview = (restaurantId, review) => {
    setRestaurantReviews((current) => ({
      ...current,
      [restaurantId]: [...(current[restaurantId] || []), review],
    }));
  };

  useEffect(() => () => {
    if (gpsWatchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
    }
  }, []);

  const autoLocateLocation = () => {
    if (!window.isSecureContext) {
      setLocationError('GPS location requires localhost or a secure HTTPS connection.');
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('GPS location is not available in this browser.');
      return;
    }

    if (gpsWatchId.current !== null) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
      gpsWatchId.current = null;
    }
    setTrackingLocation(false);
    setLocationError('');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: Math.round(coords.accuracy),
          source: 'gps',
          cityId: '',
          cityName: '',
        });
        setTrackingLocation(false);
        setLocating(false);
      },
      (error) => {
        setLocationError(error.code === 1
          ? 'Location permission was denied. Allow location access in your browser and try again.'
          : 'Could not get your location. Check device location settings and try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const handleLogin = (userEmail, userRole, shouldAutoLocate = false, userName = '', userPhone = '') => {
    setEmail(userEmail);
    setDisplayName(userName);
    setPhone(userPhone);
    setRole(userRole);
    setActiveView('discover');
    setAuthenticated(true);
    if (userRole === 'customer' && shouldAutoLocate) autoLocateLocation();
  };

  const handleRegister = (userEmail, password, shouldAutoLocate, userName, userPhone) => {
    setDemoCredential({ email: userEmail.trim().toLowerCase(), password });
    handleLogin(userEmail, 'customer', shouldAutoLocate, userName, userPhone);
  };

  const handlePasswordReset = (userEmail, password) => {
    setDemoCredential({ email: userEmail.trim().toLowerCase(), password });
  };

  const stopLocationWatch = () => {
    if (gpsWatchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
      gpsWatchId.current = null;
    }
    setTrackingLocation(false);
    setLocating(false);
  };

  const requestLocation = () => {
    if (!window.isSecureContext) {
      setLocationError('GPS location requires localhost or a secure HTTPS connection.');
      return;
    }
    if (!navigator.geolocation) {
      setLocationError('GPS location is not available in this browser.');
      return;
    }

    setLocationError('');
    setLocating(true);
    if (gpsWatchId.current !== null) navigator.geolocation.clearWatch(gpsWatchId.current);
    gpsWatchId.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const nextLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: Math.round(coords.accuracy),
          source: 'gps',
          cityId: '',
          cityName: '',
        };
        setLocation(nextLocation);
        if (selected && tracking) setTrackedLocation(nextLocation);
        setLocating(false);
        setTrackingLocation(true);
      },
      (error) => {
        setLocationError(error.code === 1
          ? 'Location permission was denied. Allow location access in your browser and try again.'
          : 'Could not get your location. Check device location settings and try again.');
        setLocating(false);
        setTrackingLocation(false);
        if (gpsWatchId.current !== null) {
          navigator.geolocation.clearWatch(gpsWatchId.current);
          gpsWatchId.current = null;
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );
    setTrackingLocation(true);
  };

  const selectCity = (cityId) => {
    if (gpsWatchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchId.current);
      gpsWatchId.current = null;
    }
    setTrackingLocation(false);
    setLocating(false);
    setLocationError('');

    if (!cityId) {
      setLocation(null);
      if (selected && tracking) setTrackedLocation(null);
      return;
    }

    const city = indianCities.find((item) => item.id === cityId);
    if (!city) return;
    const cityLocation = {
      latitude: city.latitude,
      longitude: city.longitude,
      accuracy: null,
      source: 'city',
      cityId: city.id,
      cityName: city.name,
    };
    setLocation(cityLocation);
    if (selected && tracking) setTrackedLocation(cityLocation);
  };

  const toggleFavorite = (id) => {
    setFavorites((current) => current.includes(id)
      ? current.filter((favorite) => favorite !== id)
      : [...current, id]);
  };

  const changeQuantity = (id, amount) => {
    if (amount > 0 && !available[id]) return;
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + amount) }));
  };

  const updateMenuPrice = (id, price) => {
    if (!Number.isFinite(price) || price < 0) return;
    setMenuPrices((current) => ({ ...current, [id]: price }));
  };

  const openRestaurant = (restaurant) => {
    setSelected(restaurant);
    setMenuMode('veg');
    setTracking(false);
    setActiveView('discover');
  };

  const openOrders = () => {
    setActiveView('orders');
    setSelected(null);
  };

  const openFavorites = () => {
    setActiveView('favorites');
    setCategory('All');
    setSearch('');
    setSelected(null);
  };

  const openPayment = () => {
    if (count === 0) return;
    if (Object.entries(cart).some(([id, quantity]) => quantity > 0 && !available[id])) return;
    setShowCart(false);
    setShowPayment(true);
  };

  const placeOrder = (payment = {}) => {
    if (count === 0) return;
    const restaurant = selected || restaurants[0];
    const simulationStartedAt = Date.now();
    const placedAt = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(new Date());
    const order = {
      id: `TT-${2481 + orders.length}`,
      email,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      subtotal: payment.subtotal ?? subtotal,
      discount: payment.discount ?? 0,
      couponCode: payment.couponCode || '',
      paymentMethod: payment.paymentMethod || 'Cash on delivery',
      total: payment.total ?? subtotal,
      deliveryLocation: location ? { ...location } : null,
      itemSummary: Object.entries(cart)
        .filter(([, quantity]) => quantity > 0)
        .map(([id, quantity]) => `${menuItems.find((item) => item.id === Number(id))?.name} × ${quantity}`)
        .join(', '),
      placedAt,
      simulationStartedAt,
      simulationDurationMs: 120_000,
      status: 'Confirmed',
    };

    setOrders((current) => [order, ...current]);
    setCurrentOrder(order);
    setTrackedLocation(order.deliveryLocation);
    setCart({});
    setShowCart(false);
    setShowPayment(false);
    setSelected(restaurant);
    setTracking(true);
    setActiveView('discover');
  };

  const trackOrder = (order) => {
    setCurrentOrder(order);
    setTrackedLocation(order.deliveryLocation || location);
    setSelected(restaurants.find((restaurant) => restaurant.id === order.restaurantId) || restaurants[0]);
    setTracking(true);
    setActiveView('discover');
  };

  const restartDeliverySimulation = () => {
    if (!currentOrder) return;
    const restartedOrder = { ...currentOrder, simulationStartedAt: Date.now() };
    setCurrentOrder(restartedOrder);
    setOrders((current) => current.map((order) => (
      order.id === restartedOrder.id ? restartedOrder : order
    )));
  };

  const updateOrderStatus = (id, status) => {
    setOrderStatus((current) => ({ ...current, [id]: status }));
  };

  const saveProfile = (name, nextEmail, nextPhone) => {
    setDisplayName(name);
    setEmail(nextEmail);
    setPhone(nextPhone);
  };

  if (!authenticated) return <LoginModule
    onLogin={handleLogin}
    onRegister={handleRegister}
    onPasswordReset={handlePasswordReset}
    demoCredential={demoCredential}
    autoDetectLocation={preferences.autoDetectLocation}
    theme={preferences.theme}
  />;

  return <div className={`app-shell luxury-theme theme-${preferences.theme}`}>
    <FoodMascots/>
    <aside className={`sidebar ${role === 'admin' ? 'admin-sidebar' : ''}`}>
      <a className="brand" href="#home" aria-label="TastyTongue home" onClick={() => setActiveView('discover')}>
        <span className="brand-mark">t<span>·</span></span><span className="brand-name">TastyTongue</span>
      </a>
      <div className="side-label">YOUR SPACE</div>
      <nav className="side-nav">
        <button className={`nav-item ${activeView === 'discover' ? 'active' : ''}`} onClick={() => setActiveView('discover')}><Compass size={18}/><span>Discover</span></button>
        {role === 'customer' && <button className={`nav-item ${activeView === 'orders' ? 'active' : ''}`} onClick={openOrders}><ClipboardList size={18}/><span>My orders</span>{orders.length > 0 && <i>{orders.length}</i>}</button>}
        {role === 'customer' && <button className={`nav-item ${activeView === 'favorites' ? 'active' : ''}`} onClick={openFavorites}><Heart size={18}/><span>Favourites</span>{favorites.length > 0 && <i>{favorites.length}</i>}</button>}
        <button className={`nav-item ${activeView === 'profile' ? 'active' : ''}`} onClick={() => setActiveView('profile')}><UserRound size={18}/><span>Profile</span></button>
        <button className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}><Settings size={18}/><span>Settings</span></button>
      </nav>
      {role === 'customer' && <>
        <div className="side-label category-label">EXPLORE BY</div>
        <nav className="side-nav cuisine-nav">
          {categories.slice(1).map((item) => <button className={`nav-item ${category === item.name ? 'active-soft' : ''}`} key={item.name} onClick={() => { setActiveView('discover'); setCategory(item.name); }}>
            <span className="cuisine-emoji">{item.emoji}</span><span>{item.name}</span>
          </button>)}
        </nav>
      </>}
      <div className="side-bottom">
        <div className="side-note"><div className="note-icon"><Leaf size={18}/></div><strong>Good food.<br/>Good people.</strong><p>Every order supports an independent Indian kitchen.</p><a href="#restaurants" onClick={() => setActiveView('discover')}>Find your local <ArrowRight size={13}/></a></div>
        <button className="profile" onClick={() => setActiveView('profile')}>
          <span className="avatar">{email.charAt(0).toUpperCase()}</span>
          <span className="profile-text"><b>{displayName || email}</b><small>{role === 'admin' ? 'Platform administrator' : email}</small></span>
          <UserRound size={16}/>
        </button>
      </div>
    </aside>

    <main className={`main-area ${role === 'admin' ? 'admin-main' : ''}`} id="home">
      <header className="topbar">
        <LocationPickerModule
          location={location}
          locationError={locationError}
          locating={locating}
          trackingLocation={trackingLocation}
          onSelectCity={selectCity}
          onAutoLocate={autoLocateLocation}
          onOpenMap={() => setShowLocationMap(true)}
          onStopGps={stopLocationWatch}
        />
        <div className="top-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${preferences.theme === 'night' ? 'day' : 'night'} mode`}
            aria-pressed={preferences.theme === 'night'}
            title={`Switch to ${preferences.theme === 'night' ? 'day' : 'night'} mode`}
            onClick={() => setPreferences((current) => ({ ...current, theme: current.theme === 'night' ? 'day' : 'night' }))}
          >
            {preferences.theme === 'night' ? <Sun size={15}/> : <Moon size={15}/>}
            <span>{preferences.theme === 'night' ? 'Day' : 'Night'}</span>
          </button>
          <label className="role-select-label"><span>VIEW AS</span><select aria-label="Choose workspace" value={role} onChange={(event) => { setRole(event.target.value); setActiveView('discover'); }}>
            <option value="customer">Customer</option><option value="admin">Admin dashboard</option>
          </select><ChevronDown size={12}/></label>
          {role === 'customer' && <>
            <button className="schedule-btn" onClick={() => setSchedule(true)}><Clock3 size={16}/><span>{scheduled === 'ASAP' ? 'Deliver now' : scheduled}</span><ChevronDown size={14}/></button>
            <button className="cart-btn" onClick={() => setShowCart(true)}><ShoppingBag size={18}/><span>Cart</span><b>{count}</b></button>
          </>}
        </div>
      </header>

      {activeView === 'profile'
        ? <ProfileModule
          name={displayName}
          email={email}
          phone={phone}
          onSave={saveProfile}
          onSignOut={() => setAuthenticated(false)}
        />
        : activeView === 'settings'
          ? <SettingsModule
            preferences={preferences}
            onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))}
            location={location}
            onClearLocation={() => selectCity('')}
            onStopLocation={stopLocationWatch}
          />
          : role === 'admin'
        ? <AdminModule
          userEmail={email}
          orders={orders}
          orderStatus={orderStatus}
          onOrderStatusChange={updateOrderStatus}
          restaurants={ratedRestaurants}
          restaurantReviews={restaurantReviews}
          restaurantAvailability={restaurantAvailability}
          setRestaurantAvailability={setRestaurantAvailability}
          menuItems={menuItems}
          onMenuPriceChange={updateMenuPrice}
          available={available}
          setAvailable={setAvailable}
        />
        : activeView === 'orders'
          ? <MyOrdersModule
            orders={orders}
            orderStatus={orderStatus}
            onTrack={trackOrder}
            onExplore={() => setActiveView('discover')}
          />
          : <UserModule
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            visibleRestaurants={visibleRestaurants}
            openRestaurant={openRestaurant}
            sort={sort}
            setSort={setSort}
            sortBy={sortBy}
            setSortBy={setSortBy}
            favoritesOnly={activeView === 'favorites'}
            onBrowseRestaurants={() => setActiveView('discover')}
            orders={orders}
            orderStatus={orderStatus}
            onOpenOrders={openOrders}
          />}
    </main>

    {showCart && <CartModule
      cart={cart}
      count={count}
      subtotal={subtotal}
      menuItems={menuItems}
      available={available}
      onChangeQuantity={changeQuantity}
      onClose={() => setShowCart(false)}
      onCheckout={openPayment}
    />}

    {showPayment && <PaymentModule
      subtotal={subtotal}
      count={count}
      onClose={() => setShowPayment(false)}
      onPlaceOrder={placeOrder}
    />}

    {showLocationMap && <LocationMapModule
      location={location}
      locating={locating}
      locationError={locationError}
      onRefreshLocation={autoLocateLocation}
      onClose={() => setShowLocationMap(false)}
    />}

    {schedule && <div className="modal-backdrop" onClick={() => setSchedule(false)}>
      <section className="schedule-modal" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <div><div className="section-kicker">PICK YOUR MOMENT</div><h2>When should we bring it?</h2></div>
          <button className="close-btn" onClick={() => setSchedule(false)} aria-label="Close"><X size={18}/></button>
        </div>
        <p className="modal-subtitle">A good meal is worth planning around.</p>
        <div className="schedule-options">
          <button className={scheduled === 'ASAP' ? 'chosen' : ''} onClick={() => setScheduled('ASAP')}>
            <span className="schedule-icon"><Bike size={18}/></span><span><b>As soon as possible</b><small>Usually 20–35 min</small></span>{scheduled === 'ASAP' && <Check size={17}/>}
          </button>
          <button className={scheduled === 'Today, 7:00 PM' ? 'chosen' : ''} onClick={() => setScheduled('Today, 7:00 PM')}>
            <span className="schedule-icon"><Clock3 size={18}/></span><span><b>Schedule for later</b><small>Today · 7:00 PM IST</small></span>{scheduled === 'Today, 7:00 PM' && <Check size={17}/>}
          </button>
        </div>
        <button className="primary-btn modal-done" onClick={() => setSchedule(false)}>Save delivery time <ArrowRight size={16}/></button>
      </section>
    </div>}

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}>
      <section className="restaurant-modal" onClick={(event) => event.stopPropagation()}>
        <div className="menu-hero">
          <img src={photo(selected.image, 1050)} alt={selected.name}/>
          <button className="close-btn menu-close" onClick={() => setSelected(null)} aria-label="Close"><X size={19}/></button>
          <button className="back-menu" onClick={() => setSelected(null)}><ArrowLeft size={15}/> All restaurants</button>
        </div>
        <div className="menu-content">
          <div className="menu-intro">
            <div>
              <div className="section-kicker">{selected.cuisine.toUpperCase()} · LOCAL FAVOURITE</div>
              <h2>{selected.name}</h2>
              <p>{selected.detail} · <Star size={13} fill="currentColor"/> {ratedRestaurants.find((restaurant) => restaurant.id === selected.id)?.rating || selected.rating} · <Clock3 size={13}/> {selected.time} min</p>
            </div>
            <button className="favorite-round" onClick={() => toggleFavorite(selected.id)} aria-label="Toggle favorite"><Heart size={19} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/></button>
          </div>
          {tracking ? <div className="tracking">
            <div className="tracking-top">
              <span className="tracking-icon"><Bike size={23}/></span>
              <div><small>TASTYTONGUE ORDER #{currentOrder?.id || 'DEMO'}</small><h3>Order confirmed!</h3><p>We’ll keep you updated, {email}.</p></div>
              <span className="live-pill"><i/> DEMO</span>
            </div>
            <TrackingMap
              location={trackedLocation}
              startedAt={currentOrder?.simulationStartedAt}
              durationMs={currentOrder?.simulationDurationMs}
              onRestartSimulation={restartDeliverySimulation}
              onRequestLocation={requestLocation}
              onStopLocation={stopLocationWatch}
              locating={locating}
              trackingLocation={trackingLocation}
            />
            <DeliveryContactModule
              status={orderStatus[currentOrder?.id] || currentOrder?.status || 'Confirmed'}
              order={currentOrder}
            />
            <button className="secondary-btn" onClick={() => setTracking(false)}>Back to menu</button>
          </div> : <>
            <div className="menu-note"><Sparkles size={15}/><span>Freshly prepared · {selected.fee} · {money(399)} minimum</span></div>
            <div className="menu-mode-tabs" role="group" aria-label="Filter menu by food type">
              {[
                ['veg', 'Veg'],
                ['nonveg', 'Non-Veg'],
                ['dessert', 'Desserts'],
              ].map(([mode, label]) => {
                const itemCount = menuItems.filter((item) => item.foodType === mode).length;
                return <button
                  type="button"
                  key={mode}
                  className={menuMode === mode ? 'active' : ''}
                  aria-pressed={menuMode === mode}
                  onClick={() => setMenuMode(mode)}
                >{label}<span>{itemCount}</span></button>;
              })}
            </div>
            <div className="menu-list">{menuItems.filter((item) => item.foodType === menuMode).map((item) => <article className="menu-item" key={item.id}>
              <div className="menu-item-copy"><span className="item-badge">{item.badge}</span><h3>{item.name}</h3><p>{item.desc}</p><b>{money(item.price)}</b></div>
              <div className="menu-item-art">
                <img src={photo(item.image, 240)} alt=""/>
                {!available[item.id] ? <span className="item-unavailable">Unavailable</span> : cart[item.id] > 0
                  ? <div className="qty-control menu-qty"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Remove one"><Minus size={13}/></button><span>{cart[item.id]}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Add one"><Plus size={13}/></button></div>
                  : <button className="add-item" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add ${item.name}`}><Plus size={17}/></button>}
              </div>
            </article>)}</div>
            <RatingModule
              key={selected.id}
              restaurantName={selected.name}
              averageRating={ratedRestaurants.find((restaurant) => restaurant.id === selected.id)?.rating || selected.rating}
              reviews={restaurantReviews[selected.id] || []}
              onSubmit={(review) => submitRestaurantReview(selected.id, review)}
            />
            {count > 0 && <button className="view-basket-btn" onClick={() => { setSelected(null); setShowCart(true); }}>View cart <span>{count} items · {money(subtotal)}</span><ArrowRight size={16}/></button>}
          </>}
        </div>
      </section>
    </div>}

    {role === 'customer' && <div className="mobile-bottom">
      <button className={`mobile-tab ${activeView === 'discover' ? 'active' : ''}`} onClick={() => { setActiveView('discover'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Compass size={19}/><span>Explore</span></button>
      <button className="mobile-tab" onClick={() => setShowCart(true)}><ShoppingBag size={19}/><span>Cart{count > 0 && ` (${count})`}</span></button>
      <button className={`mobile-tab ${activeView === 'orders' ? 'active' : ''}`} onClick={openOrders}><ClipboardList size={19}/><span>My orders</span></button>
    </div>}
  </div>;
}

export default App;
