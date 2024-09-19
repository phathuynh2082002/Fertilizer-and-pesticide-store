import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { productListReducer, productDetailsReducer, productCreateReviewReducer } from "./Reducers/ProductReducers";
import { cartReducer } from "./Reducers/CartReducers";
import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer } from "./Reducers/userReducers";
import { orderCancleReducer, orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderPayReducer } from "./Reducers/OrderReducers";
import { chatbotReducer } from "./Reducers/ChatbotReducers";
import { categoryListReducer, plantListReducer, subcategoryListReducer } from "./Reducers/CategoryReducers";

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productReviewCreate: productCreateReviewReducer,
    categoryList: categoryListReducer,
    subcategoryList: subcategoryListReducer,
    plantList: plantListReducer,
    cart: cartReducer,
    userLogin: userLoginReducer, 
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderCancle: orderCancleReducer,
    chatbotSent: chatbotReducer,
});

// Cart items
const cartItemsFromLocalStorage = localStorage.getItem('cartItems')
? JSON.parse(localStorage.getItem('cartItems')) : [];

//Cart item
const cartItemFromLocalStorage = localStorage.getItem('cartItem')
? JSON.parse(localStorage.getItem('cartItem')) : {};

//Login
const userInfoFromLocalStorage = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')) : null;

// Shipping address
const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress')
? JSON.parse(localStorage.getItem('shippingAddress')) : {};

const initialState = {
    cart: {
        cartItem: cartItemFromLocalStorage,
        cartItems: cartItemsFromLocalStorage,
        shippingAddress: shippingAddressFromLocalStorage,
    },
    userLogin: {
        userInfo: userInfoFromLocalStorage,
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;