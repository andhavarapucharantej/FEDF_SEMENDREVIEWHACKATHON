import { useState } from 'react';
import { Star } from 'lucide-react';
import './RatingModule.css';

const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export default function RatingModule({ restaurantName, averageRating, reviews, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!rating || submitted) return;

    onSubmit({ rating, comment: comment.trim(), submittedAt: Date.now() });
    setSubmitted(true);
  };

  return <section className="rating-module" aria-labelledby="rating-title">
    <div className="rating-heading">
      <div>
        <div className="section-kicker">YOUR TASTE, YOUR TAKE</div>
        <h3 id="rating-title">Rate {restaurantName}</h3>
      </div>
      <div className="rating-summary" aria-label={`${averageRating} out of 5, ${reviews.length} customer reviews`}>
        <span><Star size={16} fill="currentColor"/>{averageRating}</span>
        <small>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</small>
      </div>
    </div>

    {submitted ? <p className="rating-thanks" role="status">Thanks for sharing your rating!</p> : <form onSubmit={handleSubmit}>
      <fieldset className="rating-stars">
        <legend>Your rating</legend>
        {ratingLabels.map((label, index) => {
          const value = index + 1;
          return <button
            type="button"
            key={label}
            className={value <= rating ? 'star-selected' : ''}
            aria-label={`${value} star${value === 1 ? '' : 's'}: ${label}`}
            aria-pressed={rating === value}
            onClick={() => setRating(value)}
          ><Star size={25} fill={value <= rating ? 'currentColor' : 'none'}/></button>;
        })}
        <span className="rating-label">{rating ? ratingLabels[rating - 1] : 'Choose stars'}</span>
      </fieldset>
      <label className="rating-comment">
        <span>Share a note <small>· optional</small></span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={250}
          rows={3}
          placeholder="What did you enjoy?"
        />
        <small className="rating-char-count">{comment.length}/250</small>
      </label>
      <button className="rating-submit" type="submit" disabled={!rating}>Submit rating</button>
    </form>}

    {reviews.length > 0 && <div className="rating-reviews" aria-label="Recent customer reviews">
      {reviews.slice(-3).reverse().map((review) => <article className="rating-review" key={review.submittedAt}>
        <div className="rating-review-stars" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={12} fill="currentColor"/> )}
        </div>
        <p>{review.comment || 'Rated without a comment.'}</p>
      </article>)}
    </div>}
    <p className="rating-demo-note">Ratings are saved for this browser session only.</p>
  </section>;
}
