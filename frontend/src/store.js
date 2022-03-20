import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {product_reducer, product_details_reducer} from './reducers/product_reducer'

const reducer = combineReducers({
    productList:product_reducer,
    productDetail:product_details_reducer
});

const middleware = [thunk];

const initialState = {};

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;