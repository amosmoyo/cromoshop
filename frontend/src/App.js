// import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceorderScreen from './screens/PlaceorderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from "./screens/UserListScreen";
import EditUserScreen from './screens/EditUserScreen';
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import CreateProductScreen from './screens/CreateProductScreen';
import AllOrdersScreen from './screens/AllOrdersScreen';
import ActivationScreen from './screens/ActivationScreen';
import ForgetPassword from './screens/Auth/ForgetPassword'
import ResetPassword from './screens/Auth/ResetPassword'
// import { BrowserRouter as Router, Route} from 'react-router-dom';
import ProductScreen from "./screens/ProductScreen";
import Cart from "./screens/Cart";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AccountActivation } from './screens/Auth/AccountActivation'

function App() {
  // const [color, setColor] = useState("red");
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setCount((count) => count + 1);
  //   }, 1000);
  // });

 

  return (
    <Router>
      <div className="App">
        <Header></Header>
        <main className="main py-3">
          <Container>
            <Routes>
              
              <Route path="/" element={<HomeScreen />} exact />
              <Route path="/search/:keyword" element={<HomeScreen />} exact />
              <Route path="/page/:pageNumber" element={<HomeScreen />} exact />
              <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} exact />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/order" element={<PlaceorderScreen />} />
              <Route path="/orderlist/:id" element={<OrderScreen />} />
              <Route path="/login" element={<LoginScreen />} />

              <Route path="/forgetpassword" element={<ForgetPassword />} />

              <Route path="/user/reset/:access_token" element={<ResetPassword />} />

              <Route path="/register" element={<RegisterScreen />} exact />
              {/* <Route path="/user/auth/activation/:id" element={<AccountActivation />} exact /> */}

              <Route path="/user/auth/activation/:activation_token" element={<ActivationScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart/:id" element={<Cart />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/userlist/:id/edit" element={<EditUserScreen />} />
              <Route path="/admin/productlist" element={<ProductListScreen />} />
              <Route path="/admin/productlist/page/:pageNumber" element={<ProductListScreen />} exact />
              <Route path="/admin/productlist/:id/edit" element={<ProductEditScreen />} exact />
              <Route path="/admin/createproduct" element={<CreateProductScreen />} />
              <Route path="/admin/orderlist" element={<AllOrdersScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
