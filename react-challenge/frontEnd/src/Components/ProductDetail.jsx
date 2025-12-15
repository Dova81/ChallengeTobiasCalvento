import { useState } from 'react';
import { useProducts } from '../context/ProductsContext';

function ProductDetail({ product }) {
  const { addReview, submitting } = useProducts();
  const [reviewer, setReviewer] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const isSubmitting = Boolean(submitting[product.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reviewer.trim() || !comment.trim()) {
      setError('Reviewer and comment are required.');
      return;
    }

    try {
      await addReview(product.id, { reviewer: reviewer.trim(), rating: Number(rating), comment: comment.trim() });
      setReviewer('');
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit review');
    }
  };

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <p className="eyebrow">Product #{product.id}</p>
          <h2>{product.name}</h2>
        </div>
      </header>

      <div className="reviews">
        {product.reviews.length === 0 ? (
          <p className="muted">No reviews yet. Be the first!</p>
        ) : (
          product.reviews.map((review, index) => (
            <article key={index} className="review">
              <div className="review-top">
                <strong>{review.reviewer}</strong>
                <span className="pill">{review.rating} / 5</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))
        )}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Reviewer
            <input
              type="text"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              placeholder="Your name"
              disabled={isSubmitting}
            />
          </label>
          <label>
            Rating
            <select value={rating} onChange={(e) => setRating(e.target.value)} disabled={isSubmitting}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Comment
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts"
            rows={3}
            disabled={isSubmitting}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Add Review'}
        </button>
      </form>
    </section>
  );
}

export default ProductDetail;