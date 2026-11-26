import { useEffect, useState } from 'react';
import { ArrowRight, Check, Clock3, Heart, Search, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react';
import { categories, photo } from '../data/catalog.js';
import OrderTelemetryModule from './OrderTelemetryModule.jsx';
import './UserModule.css';

const heroSlides = [
  {
    image: 'photo-1565557623262-b51c2513a641',
    alt: 'A richly spiced Indian curry served fresh',
    title: <>A little taste<br/>of <i>India.</i></>,
    description: 'From tandoor favourites to street-side chaat, find your next craving.',
  },
  {
    image: 'photo-1589302168068-964664d93dc0',
    alt: 'Aromatic Hyderabadi biryani with fresh herbs',
    title: <>Made with<br/><i>tradition.</i></>,
    description: 'Discover slow-cooked biryani and regional recipes from local kitchens.',
  },
  {
    image: 'photo-1601050690597-df0568f70950',
    alt: 'Freshly prepared South Indian favourites',
    title: <>A fresh plate<br/>of <i>comfort.</i></>,
    description: 'Find crisp, comforting South Indian favourites made close to home.',
  },
];

export default function UserModule({
  category,
  setCategory,
  search,
  setSearch,
  favorites,
  toggleFavorite,
  visibleRestaurants,
  openRestaurant,
  sort,
  setSort,
  sortBy,
  setSortBy,
  favoritesOnly = false,
  onBrowseRestaurants,
  orders = [],
  orderStatus = {},
  onOpenOrders,
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timerId);
  }, []);

  const moveSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };
  const slide = heroSlides[activeSlide];

  return <div className="page-content user-module">
    {!favoritesOnly && <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot"></span> {new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).format(new Date()).toUpperCase()}</div>
          <h1>Good food, <em>good mood.</em></h1>
          <p>Regional favourites and local kitchens, closer to home.</p>
        </div>
        <div className="weather-pill"><span>☀️</span><span>Freshly made <small>Right around you</small></span></div>
      </section>
      <section className="hero-card" aria-roledescription="carousel" aria-label="Featured Indian dishes">
        <img className="hero-image" key={slide.image} src={photo(slide.image, 1500)} alt={slide.alt}/>
        <div className="hero-shade"></div>
        <div className="hero-copy">
          <div className="hero-kicker"><Sparkles size={13}/> THE TASTYTONGUE EDIT</div>
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
          <button className="hero-cta" onClick={() => { setCategory('All'); document.querySelector('#restaurants')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore local favourites <ArrowRight size={16}/></button>
        </div>
        <div className="hero-counter"><span>{String(activeSlide + 1).padStart(2, '0')}</span><i></i><span>{String(heroSlides.length).padStart(2, '0')}</span></div>
        <div className="hero-arrows">
          <button type="button" aria-label="Previous featured dish" onClick={() => moveSlide(-1)}><ArrowRight size={16}/></button>
          <button type="button" aria-label="Next featured dish" onClick={() => moveSlide(1)}><ArrowRight size={16}/></button>
        </div>
      </section>
      <OrderTelemetryModule orders={orders} orderStatus={orderStatus} onTrackOrders={onOpenOrders}/>
      <section className="category-section">
        <div className="section-heading">
          <div><div className="section-kicker">FOLLOW YOUR CRAVING</div><h2>What sounds good?</h2></div>
          <button className="text-link" onClick={() => setCategory('All')}>See all cuisines <ArrowRight size={15}/></button>
        </div>
        <div className="category-strip">{categories.map((item) => <button key={item.name} onClick={() => setCategory(item.name)} className={`category-card ${category === item.name ? 'selected' : ''}`}>
          <span className={`category-symbol ${item.name === 'All' ? 'all-symbol' : ''}`}>{item.emoji}</span>
          <span className="category-name">{item.name === 'All' ? 'Surprise me' : item.name}</span>
          <span className="category-count">{item.count}</span>
        </button>)}</div>
      </section>
    </>}
    <section className="restaurant-section" id="restaurants">
      <div className="section-heading restaurant-heading">
        <div><div className="section-kicker">{favoritesOnly ? 'SAVED FOR LATER' : 'MADE AROUND THE CORNER'}</div><h2>{favoritesOnly ? 'Your favourites' : <>On the menu <span className="heading-spark">✳</span></>}</h2></div>
        <div className="restaurant-controls">
          <div className="search-box"><Search size={17}/><input aria-label="Search restaurants and dishes" placeholder="Restaurants, dishes..." value={search} onChange={(event) => setSearch(event.target.value)}/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14}/></button>}</div>
          <div className="sort-wrap">
            <button className={`filter-btn ${sort ? 'filter-on' : ''}`} onClick={() => setSort(!sort)}><SlidersHorizontal size={16}/><span>{sortBy === 'Recommended' ? 'Filters' : sortBy}</span><span aria-hidden="true">⌄</span></button>
            {sort && <div className="sort-menu">{['Recommended', 'Top rated', 'Fastest delivery'].map((option) => <button key={option} onClick={() => { setSortBy(option); setSort(false); }}>{option}{sortBy === option && <Check size={15}/>}</button>)}</div>}
          </div>
        </div>
      </div>
      {visibleRestaurants.length ? <div className="restaurant-grid">{visibleRestaurants.map((restaurant) => <article className="restaurant-card" key={restaurant.id} onClick={() => openRestaurant(restaurant)}>
        <div className="restaurant-photo-wrap">
          <img className="restaurant-photo" src={photo(restaurant.image, 760)} alt={restaurant.name} loading="lazy"/>
          <div className="photo-overlay"></div>
          {restaurant.tag && <span className={`restaurant-tag ${restaurant.color}`}>{restaurant.tag}</span>}
          <button className={`favorite-btn ${favorites.includes(restaurant.id) ? 'favorited' : ''}`} aria-label={`${favorites.includes(restaurant.id) ? 'Remove' : 'Add'} ${restaurant.name} ${favorites.includes(restaurant.id) ? 'from' : 'to'} favorites`} onClick={(event) => { event.stopPropagation(); toggleFavorite(restaurant.id); }}>
            <Heart size={17} fill={favorites.includes(restaurant.id) ? 'currentColor' : 'none'}/>
          </button>
          <span className="time-pill"><Clock3 size={12}/>{restaurant.time} min</span>
        </div>
        <div className="restaurant-info">
          <div className="restaurant-title-row"><h3>{restaurant.name}</h3><span className="rating"><Star size={13} fill="currentColor"/>{restaurant.rating}</span></div>
          <div className="restaurant-description">{restaurant.detail}</div>
          <div className="restaurant-meta"><span>{restaurant.fee}</span><span className="meta-dot">·</span><span>₹₹</span></div>
        </div>
      </article>)}</div> : <div className="empty-state"><span>{favoritesOnly ? '♡' : '🍽️'}</span><h3>{favoritesOnly ? 'No favourites saved yet' : 'No spots on the menu yet'}</h3><p>{favoritesOnly ? 'Tap the heart on a restaurant to save it here.' : 'Try another cuisine or search for something else.'}</p><button onClick={favoritesOnly ? onBrowseRestaurants : () => { setCategory('All'); setSearch(''); }}>{favoritesOnly ? 'Explore restaurants' : 'Clear filters'}</button></div>}
      {favoritesOnly
        ? <button className="more-btn" onClick={onBrowseRestaurants}>Discover more restaurants <ArrowRight size={15}/></button>
        : <button className="more-btn" onClick={() => { setCategory('All'); setSearch(''); }}>See all local spots <ArrowRight size={15}/></button>}
    </section>
    <footer className="footer"><span>Made with <b>♥</b> for India</span><span>© 2026 TastyTongue <span className="footer-dot">·</span> All prices in ₹</span></footer>
  </div>;
}
