import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState, useEffect } from 'react';
import ToastNotification from '../components/ToastNotification';

function ShoppingCartPage() {
  const navigate = useNavigate();
  const { title, bookId } = useParams();
  const { addToCart } = useCart();
  const [price, setPrice] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Assuming the price will be fetched from an API or passed down
  useEffect(() => {
    // Just an example, replace this with your actual price fetching logic
    setPrice(20); // Replace this with actual logic to fetch the price
  }, []);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: Number(bookId),
      title: title || 'No book found',
      price: Number(price),
      quantity: Number(quantity),
    };
    addToCart(newItem);
    setShowToast(true);

    // Delay navigation slightly so the user sees the notification
    setTimeout(() => navigate('/cart'), 1500);
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {title}</h2>

      <div>
        {/* Price display */}
        <p>Price: ${price}</p>

        {/* Quantity input */}
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* Add to cart button */}
        <button className="btn btn-primary" onClick={handleAddToCart}>
          <i className="bi bi-cart"></i> Add to Cart
        </button>
      </div>

      {/* Go back button */}
      <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
        Go Back
      </button>

      {/* Toast Notification */}
      {showToast && <ToastNotification message="Book added to cart!" />}
    </>
  );
}

export default ShoppingCartPage;
