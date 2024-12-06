import { Link } from 'react-router-dom';

const Confirmation = () => {
  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Your order has been successfully completed.</p>
      <Link to="/" className="button">
        Continue Shopping
      </Link>
    </div>
  );
};

export default Confirmation;
