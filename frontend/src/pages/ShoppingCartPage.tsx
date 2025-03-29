import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import WelcomeBand from '../components/WelcomeBand';
import ToastNotification from '../components/ToastNotification';

// Inside ShoppingCartPage component
function ShoppingCartPage() {
  const navigate = useNavigate();
  const { title, bookId } = useParams();
  const location = useLocation();

  const { addToCart } = useCart();
  const [price, setPrice] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Use state passed from the BookList
  const bookData = location.state;

  useEffect(() => {
    if (bookData) {
      setPrice(bookData.price); // Set price from passed state
    }
  }, [bookData]);

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookId: bookData?.bookId ?? Number(bookId),
      title: bookData?.title || title || 'No book found',
      price: bookData?.price ?? 0,
      quantity: quantity,
    };
    addToCart(newItem);
    setShowToast(true);

    // Delay navigation slightly so the user sees the notification
    setTimeout(() => navigate('/cart'), 1500);
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase {bookData?.title || title}</h2>

      <div>
        {/* Price display */}
        <p>Price: ${bookData?.price || price}</p>

        {/* Quantity input */}
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            readOnly
          />
        </div>
        <br />
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
