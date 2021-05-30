import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from "redux-thunk";
import { changeState } from "./redux/reducers/nav";
import { auth } from "./redux/reducers/auth";
import { constant } from "./redux/reducers/constant";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// config cho persist Store : giúp vẫn lưu state khi reload trang
const persistConfig = {
 key: 'root',
 storage: storage,
 stateReconciler: autoMergeLevel2 // Xem thêm tại mục "Quá trình merge".
};

// Khai báo các reducer và gom về 1 nguồn
const rootReducer = combineReducers({
  navReducer: changeState,
  authReducer: auth,
  constantReducer: constant,
});

const pReducer = persistReducer(persistConfig, rootReducer);

// Khởi tạo store
export const store = createStore(pReducer, composeWithDevTools(
    applyMiddleware(ReduxThunk)
));

export const persistor = persistStore(store);