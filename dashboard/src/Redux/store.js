import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userCreateReducer, userDeleteReducer, userListReducer, userLoginReducer } from "./Reducers/userReducers";
import { productCreateReducer, productDeleteReducer, productEditReducer, productListReducer, productUpdateReducer } from "./Reducers/ProductReducers";
import { orderAllListReducer, orderChangeStatus, orderDetailsReducer, orderListReducer } from "./Reducers/OrderReducers";
import { categoryCreateReducer, categoryDeleteReducer, categoryListReducer, categoryUpdateReducer, plantCreateReducer, plantDeleteReducer, plantListReducer, plantUpdateReducer, subcategoryCreateReducer, subcategoryDeleteReducer, subcategoryListReducer, subcategoryUpdateReducer } from "./Reducers/CategoryReducer";

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userList: userListReducer,
    userCreate: userCreateReducer,
    userDelete: userDeleteReducer,
    productList: productListReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productEdit: productEditReducer,
    productUpdate: productUpdateReducer,
    orderList: orderListReducer,
    orderALLList: orderAllListReducer,
    orderDetails: orderDetailsReducer,
    orderChange: orderChangeStatus,
    categoryList: categoryListReducer,
    categoryCreate: categoryCreateReducer,
    categoryDelete: categoryDeleteReducer,
    categoryUpdate: categoryUpdateReducer,
    plantList: plantListReducer,
    plantCreate: plantCreateReducer,
    plantDelete: plantDeleteReducer,
    plantUpdate: plantUpdateReducer,
    subcategoryList: subcategoryListReducer,
    subcategoryCreate: subcategoryCreateReducer,
    subcategoryDelete: subcategoryDeleteReducer,
    subcategoryUpdate: subcategoryUpdateReducer,
});

//Login
const userInfoFromLocalStorage = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
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