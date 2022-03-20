import { configureStore }  from '@reduxjs/toolkit';
import productsReducers from './productSlice';
import cartReducers from './cartSlice';
import authReducers from './authSlice';
import orderReducers from './orderSlice'
import adminReducer from './adminSlice'

let  cartItemsFromLocalStorage = [];

let userData = {}

let shippingAddress = {}

let payment = ''


if(localStorage.getItem('cartItems') !== 'undefined') {
    cartItemsFromLocalStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
}

if(localStorage.getItem('userData') !== 'undefined') {
    userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
}

if(localStorage.getItem('shippingAddress') !== 'undefined') {
    shippingAddress = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {};
}

if(localStorage.getItem('payment') !== 'undefined') {
    payment = localStorage.getItem('payment') ? JSON.parse(localStorage.getItem('payment')) : '';
}



const initalState = {
    cartItems: cartItemsFromLocalStorage,
    shippingAddress,
    payment
}

const store = configureStore({
    reducer:{
        productsReducers, cartReducers, authReducers, orderReducers, adminReducer
    },
    preloadedState: {
        cartReducers: initalState,
        authReducers: {
            userData
        }
    }
});

export default store;