import { Link } from 'react-router-dom';

export default function Navbar({ cartCount, user }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">E-Shop</Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-blue-200">Products</Link>
            <Link to="/cart" className="hover:text-blue-200 relative">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <span className="hover:text-blue-200">Hello, {user.firstName}</span>
            ) : (
              <Link to="/login" className="hover:text-blue-200">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
