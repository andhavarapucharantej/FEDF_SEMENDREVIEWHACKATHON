export const restaurants = [
  { id: 1, name: 'Tandoori Junction', cuisine: 'North Indian', detail: 'North Indian · Tandoor', rating: '4.9', time: '20–30', fee: 'Free delivery', image: 'photo-1603894584373-5ac82b2ae398', tag: 'LOCAL FAVOURITE', color: 'sage' },
  { id: 2, name: 'Dilli Chaat Corner', cuisine: 'Street Food', detail: 'Delhi chaat · Snacks', rating: '4.8', time: '25–35', fee: '₹39 delivery', image: 'photo-1631452180519-c014fe946bc7', tag: 'FRESH PICK', color: 'butter' },
  { id: 3, name: 'Madras Tiffin House', cuisine: 'South Indian', detail: 'Dosa · Idli · Filter coffee', rating: '4.9', time: '15–25', fee: 'Free delivery', image: 'photo-1601050690597-df0568f70950', tag: 'BREAKFAST FAVOURITE', color: 'peach' },
  { id: 4, name: 'Nizam’s Dum Kitchen', cuisine: 'Hyderabadi', detail: 'Hyderabadi · Dum biryani', rating: '4.7', time: '30–40', fee: 'Free delivery', image: 'photo-1589302168068-964664d93dc0', tag: 'DUM COOKED', color: 'lavender' },
  { id: 5, name: 'Bombay Tiffin Co.', cuisine: 'Maharashtrian', detail: 'Mumbai · Vada pav · Misal', rating: '4.8', time: '20–30', fee: '₹29 delivery', image: 'photo-1565557623262-b51c2513a641', tag: '', color: 'blue' },
  { id: 6, name: 'Gujarati Thali Ghar', cuisine: 'Gujarati', detail: 'Gujarati · Homestyle thali', rating: '4.8', time: '15–25', fee: 'Free delivery', image: 'photo-1631452180519-c014fe946bc7', tag: 'FEEL-GOOD FOOD', color: 'mint' },
];

export const categories = [
  { name: 'All', emoji: '✳', count: 'All local spots' },
  { name: 'North Indian', emoji: '🍛', count: '12 spots' },
  { name: 'Street Food', emoji: '🥙', count: '8 spots' },
  { name: 'South Indian', emoji: '🥞', count: '10 spots' },
  { name: 'Hyderabadi', emoji: '🍚', count: '6 spots' },
  { name: 'Maharashtrian', emoji: '🍲', count: '9 spots' },
  { name: 'Gujarati', emoji: '🥘', count: '14 spots' },
];

export const menu = [
  { id: 101, name: 'Hyderabadi chicken biryani', desc: 'Dum-cooked basmati, fragrant spices, mint, fried onion and raita.', price: 329, image: 'photo-1589302168068-964664d93dc0', badge: 'Most loved', foodType: 'nonveg' },
  { id: 102, name: 'Butter naan', desc: 'Tandoor-baked naan brushed with warm desi butter.', price: 49, image: 'photo-1601050690597-df0568f70950', badge: 'Baked fresh', foodType: 'veg' },
  { id: 103, name: 'Paneer tikka', desc: 'Tandoor-grilled paneer, peppers, house spices and mint chutney.', price: 229, image: 'photo-1565557623262-b51c2513a641', badge: 'Vegetarian favourite', foodType: 'veg' },
  { id: 104, name: 'Dal makhani', desc: 'Slow-simmered black lentils finished with cream and butter.', price: 249, image: 'photo-1565557623262-b51c2513a641', badge: 'Slow cooked', foodType: 'veg' },
  { id: 105, name: 'Masala dosa', desc: 'Crisp rice crepe with spiced potato, sambar and coconut chutney.', price: 179, image: 'photo-1601050690597-df0568f70950', badge: 'South Indian classic', foodType: 'veg' },
  { id: 106, name: 'Vegetable biryani', desc: 'Fragrant basmati layered with seasonal vegetables and herbs.', price: 269, image: 'photo-1589302168068-964664d93dc0', badge: 'Garden fresh', foodType: 'veg' },
  { id: 107, name: 'Chole bhature', desc: 'Punjabi chickpea curry served with fluffy fried bhature.', price: 199, image: 'photo-1631452180519-c014fe946bc7', badge: 'Street favourite', foodType: 'veg' },
  { id: 108, name: 'Butter chicken', desc: 'Tandoor chicken in a silky tomato, butter and cream gravy.', price: 349, image: 'photo-1603894584373-5ac82b2ae398', badge: 'Chef favourite', foodType: 'nonveg' },
  { id: 109, name: 'Chicken 65', desc: 'Crisp, spice-tossed chicken bites with curry leaves and chilli.', price: 279, image: 'photo-1565557623262-b51c2513a641', badge: 'Spicy bite', foodType: 'nonveg' },
  { id: 110, name: 'Tandoori chicken', desc: 'Yogurt-marinated chicken roasted with smoky tandoor spices.', price: 389, image: 'photo-1603894584373-5ac82b2ae398', badge: 'From the tandoor', foodType: 'nonveg' },
  { id: 111, name: 'Coastal fish curry', desc: 'Tender fish simmered in a tangy coconut and tamarind gravy.', price: 359, image: 'photo-1589302168068-964664d93dc0', badge: 'Coastal special', foodType: 'nonveg' },
  { id: 112, name: 'Homestyle egg curry', desc: 'Boiled eggs in a comforting onion, tomato and spice gravy.', price: 229, image: 'photo-1631452180519-c014fe946bc7', badge: 'Homestyle', foodType: 'nonveg' },
  { id: 113, name: 'Gulab jamun', desc: 'Warm milk-solid dumplings soaked in fragrant sugar syrup.', price: 99, image: 'photo-1571115177098-24ec42ed204d', badge: 'Sweet classic', foodType: 'dessert' },
  { id: 114, name: 'Rasmalai', desc: 'Soft chenna patties in chilled saffron and cardamom milk.', price: 129, image: 'photo-1488477181946-6428a0291777', badge: 'Chilled favourite', foodType: 'dessert' },
  { id: 115, name: 'Malai kulfi', desc: 'Traditional slow-frozen cream kulfi with pistachio.', price: 89, image: 'photo-1488900128323-21503983a07e', badge: 'Frozen treat', foodType: 'dessert' },
  { id: 116, name: 'Gajar halwa', desc: 'Warm carrot halwa slow-cooked with milk, ghee and nuts.', price: 119, image: 'photo-1488477181946-6428a0291777', badge: 'Made in-house', foodType: 'dessert' },
  { id: 117, name: 'Kesar phirni', desc: 'Creamy ground-rice pudding with saffron and pistachio.', price: 109, image: 'photo-1571115177098-24ec42ed204d', badge: 'Saffron delight', foodType: 'dessert' },
  { id: 118, name: 'Crisp jalebi', desc: 'Golden spirals, fried crisp and dipped in warm syrup.', price: 89, image: 'photo-1606313564200-e75d5e30476c', badge: 'Freshly fried', foodType: 'dessert' },
];

export const photo = (id, width = 760) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const money = (rupees) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(rupees);
