import { 
    CATEGORY_CREATE_FAIL,
    CATEGORY_CREATE_REQUEST,
    CATEGORY_CREATE_RESET,
    CATEGORY_CREATE_SUCCESS,
    CATEGORY_DELETE_FAIL,
    CATEGORY_DELETE_REQUEST,
    CATEGORY_DELETE_SUCCESS,
    CATEGORY_LIST_FAIL,
    CATEGORY_LIST_REQUEST, 
    CATEGORY_LIST_SUCCESS,
    CATEGORY_UPDATE_FAIL,
    CATEGORY_UPDATE_REQUEST,
    CATEGORY_UPDATE_RESET,
    CATEGORY_UPDATE_SUCCESS,
    PLANT_CREATE_FAIL,
    PLANT_CREATE_REQUEST,
    PLANT_CREATE_RESET,
    PLANT_CREATE_SUCCESS,
    PLANT_DELETE_FAIL,
    PLANT_DELETE_REQUEST,
    PLANT_DELETE_SUCCESS,
    PLANT_LIST_FAIL,
    PLANT_LIST_REQUEST,
    PLANT_LIST_SUCCESS,
    PLANT_UPDATE_FAIL,
    PLANT_UPDATE_REQUEST,
    PLANT_UPDATE_RESET,
    PLANT_UPDATE_SUCCESS,
    SUBCATEGORY_CREATE_FAIL,
    SUBCATEGORY_CREATE_REQUEST,
    SUBCATEGORY_CREATE_RESET,
    SUBCATEGORY_CREATE_SUCCESS,
    SUBCATEGORY_DELETE_FAIL,
    SUBCATEGORY_DELETE_REQUEST,
    SUBCATEGORY_DELETE_SUCCESS,
    SUBCATEGORY_LIST_FAIL,
    SUBCATEGORY_LIST_REQUEST,
    SUBCATEGORY_LIST_SUCCESS,
    SUBCATEGORY_UPDATE_FAIL,
    SUBCATEGORY_UPDATE_REQUEST,
    SUBCATEGORY_UPDATE_RESET,
    SUBCATEGORY_UPDATE_SUCCESS,

} from "../Constants/CategoryConstants";


// LIST CATEGORY
export const categoryListReducer = ( state = { categorys: [] }, action ) => {
    switch (action.type) {
        case CATEGORY_LIST_REQUEST:
            return { loading: true,};
        case CATEGORY_LIST_SUCCESS:
            return {
                loading: false,
                categorys: action.payload,
            };
        case CATEGORY_LIST_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// CREATE CATOGORY
export const categoryCreateReducer = ( state = {}, action ) => {
    switch (action.type) {
        case CATEGORY_CREATE_REQUEST:
            return { loading: true };
        case CATEGORY_CREATE_SUCCESS:
            return { loading: false, success: true, category: action.payload };
        case CATEGORY_CREATE_FAIL:
            return { loading: false, error: action.payload };    
        case CATEGORY_CREATE_RESET:
            return {};    
        default:
            return state;
    }
};

// DELETE CATEGORY
export const categoryDeleteReducer = ( state = {}, action ) => {
    switch (action.type) {
        case CATEGORY_DELETE_REQUEST:
            return { loading: true};
        case CATEGORY_DELETE_SUCCESS:
            return { loading: false, success: true } ;
        case CATEGORY_DELETE_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// UPDATE CATEGORY
export const categoryUpdateReducer = ( state = { category: {} }, action ) => {
    switch (action.type) {
        case CATEGORY_UPDATE_REQUEST:
            return { loading: true };
        case CATEGORY_UPDATE_SUCCESS:
            return { loading: false, success: true, category: action.payload };
        case CATEGORY_UPDATE_FAIL:
            return { loading: false, error: action.payload };    
        case CATEGORY_UPDATE_RESET:
            return { category: {} };    
        default:
            return state;
    }
};

// LIST PLANT
export const plantListReducer = ( state = { plants: [] }, action ) => {
    switch (action.type) {
        case PLANT_LIST_REQUEST:
            return { loading: true,};
        case PLANT_LIST_SUCCESS:
            return {
                loading: false,
                plants: action.payload,
            };
        case PLANT_LIST_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// CREATE PLANT
export const plantCreateReducer = ( state = {}, action ) => {
    switch (action.type) {
        case PLANT_CREATE_REQUEST:
            return { loading: true };
        case PLANT_CREATE_SUCCESS:
            return { loading: false, success: true, plant: action.payload };
        case PLANT_CREATE_FAIL:
            return { loading: false, error: action.payload };    
        case PLANT_CREATE_RESET:
            return {};    
        default:
            return state;
    }
};

// DELETE PLANT
export const plantDeleteReducer = ( state = {}, action ) => {
    switch (action.type) {
        case PLANT_DELETE_REQUEST:
            return { loading: true};
        case PLANT_DELETE_SUCCESS:
            return { loading: false, success: true } ;
        case PLANT_DELETE_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// UPDATE PLANT
export const plantUpdateReducer = ( state = { plant: {} }, action ) => {
    switch (action.type) {
        case PLANT_UPDATE_REQUEST:
            return { loading: true };
        case PLANT_UPDATE_SUCCESS:
            return { loading: false, success: true, plant: action.payload };
        case PLANT_UPDATE_FAIL:
            return { loading: false, error: action.payload };    
        case PLANT_UPDATE_RESET:
            return { plant: {} };    
        default:
            return state;
    }
};

// LIST SUBCATEGORY
export const subcategoryListReducer = ( state = {}, action ) => {
    switch (action.type) {
        case SUBCATEGORY_LIST_REQUEST:
            return { loading: true,};
        case SUBCATEGORY_LIST_SUCCESS:
            return {
                loading: false,
                subcategorys: action.payload.subcategory,
                idcategory: action.payload.id
            };
        case SUBCATEGORY_LIST_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// CREATE SUBCATOGORY
export const subcategoryCreateReducer = ( state = {}, action ) => {
    switch (action.type) {
        case SUBCATEGORY_CREATE_REQUEST:
            return { loading: true };
        case SUBCATEGORY_CREATE_SUCCESS:
            return { loading: false, success: true, subcategory: action.payload };
        case SUBCATEGORY_CREATE_FAIL:
            return { loading: false, error: action.payload };    
        case SUBCATEGORY_CREATE_RESET:
            return {};    
        default:
            return state;
    }
};

// DELETE SUBCATEGORY
export const subcategoryDeleteReducer = ( state = {}, action ) => {
    switch (action.type) {
        case SUBCATEGORY_DELETE_REQUEST:
            return { loading: true};
        case SUBCATEGORY_DELETE_SUCCESS:
            return { loading: false, success: true } ;
        case SUBCATEGORY_DELETE_FAIL:
            return { loading: false, error: action.payload };    
        default:
            return state;
    }
};

// UPDATE SUBCATEGORY
export const subcategoryUpdateReducer = ( state = { subcategory: {} }, action ) => {
    switch (action.type) {
        case SUBCATEGORY_UPDATE_REQUEST:
            return { loading: true };
        case SUBCATEGORY_UPDATE_SUCCESS:
            return { loading: false, success: true, subcategory: action.payload };
        case SUBCATEGORY_UPDATE_FAIL:
            return { loading: false, error: action.payload };    
        case SUBCATEGORY_UPDATE_RESET:
            return { subcategory: {} };    
        default:
            return state;
    }
};


