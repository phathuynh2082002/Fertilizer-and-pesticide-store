import { 
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST, 
  CATEGORY_LIST_SUCCESS,
  PLANT_LIST_FAIL,
  PLANT_LIST_REQUEST,
  PLANT_LIST_SUCCESS,
  SUBCATEGORY_LIST_FAIL,
  SUBCATEGORY_LIST_REQUEST,
  SUBCATEGORY_LIST_SUCCESS,
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




