import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import './ui/App.css'
import Layout from './widgets/layout/Layout';
import Home from './pages/home/Home';
import Category from './pages/category/Category';
import AppContext from '../features/context/AppContext';
import Base64 from '../shared/base64/Base64';
import Product from './pages/product/Product';
import Cart from './pages/cart/Cart';
import OrdersHistory from './pages/orders/OrdersHistory';



const tokenKey = "asp-p32-token";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null); 

  useEffect(() => {
    const savedToken = localStorage.getItem(tokenKey);
    if(savedToken) {
      const payload = Base64.jwtDecodePayload(savedToken);
      const exp = payload['exp'];
      console.log(exp);
      setToken(savedToken);
    }
  }, []);

  const backUrl = "https://localhost:7085";

  const request = (url, conf) => new Promise((resolve, reject) => 
  {
    if(url.startsWith('/'))
    {
      url = backUrl + url;

      if(token)
      {
        if(typeof conf == 'undefined')
        {
          conf = {};
        }
        if(typeof conf.headers == 'undefined')
        {
          conf.headers = {};
        }
        if(typeof conf.headers['Authorization'] == 'undefined')
        {
          conf.headers['Authorization'] = 'Bearer ' + token;
        }
      }
    }
    fetch(url, conf)
      .then(r => r.json())
      .then(j => {
        if (j.status.isOK) {
          resolve(j.data);
        } else {
          reject(j);
        }
      })
      .catch(error => reject(error)); 
  });

  const updateCart = () => {

    setCart(null); 

    if (token) {
      request("/api/cart")
        .then(data => {

            setCart(data || { cartItems: [] }); 
        })
        .catch(error => {

          setCart({ cartItems: [] }); 

          console.error("Помилка завантаження кошика:", error);

        });
    } else {

      setCart({ cartItems: [] });
    }
};


  useEffect(() => {
    if(token) {
      setUser( Base64.jwtDecodePayload(token) );
      localStorage.setItem(tokenKey, token);
    } else {
      setUser(null);
      localStorage.removeItem(tokenKey);
    }

    updateCart();
  }, [token]);


  return <AppContext.Provider value={{cart, updateCart, request, backUrl, user, setToken}}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cart/" element={<Cart/>} />
          <Route path="order/" element={<OrdersHistory/>}/>
          <Route path="category/:slug" element={<Category />} />
          <Route path="product/:slug" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AppContext.Provider>;
}

export default App