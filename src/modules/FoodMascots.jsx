import './FoodMascots.css';

export default function FoodMascots() {
  return <div className="food-mascots" aria-hidden="true">
    <div className="food-mascot mascot-left">
      <span className="food-mascot-character">🥟</span>
      <span className="food-mascot-bubble"><i>Hi! Hungry?</i><i>Let’s find a tasty bite!</i></span>
    </div>
    <div className="food-mascot mascot-right">
      <span className="food-mascot-character">🍛</span>
      <span className="food-mascot-bubble"><i>Fresh and ready!</i><i>Made with a little spice.</i></span>
    </div>
  </div>;
}
