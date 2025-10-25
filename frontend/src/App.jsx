import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
          <Navbar 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
            user={user} 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <Routes>
            <Route path="/" element={<ProductList addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
