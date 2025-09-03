import { combineReducers } from '@reduxjs/toolkit';
import navbarSlice from './slices/general_slices/navbar-slice';
import LanguageReducer from './slices/language-slice/language-json-slice';
import CurrencyReducer from './slices/general_slices/multi-currency-slice';
import GetAccessTokenReducer from './slices/auth/token-login-slice';
import MultiLanguageReducer from './slices/general_slices/multilang-slice';
import SelectedFilterLangDataScreen from './slices/general_slices/selected-multilanguage-slice';
import wishlistSlice from './slices/wishlist-slices/wishlist-local-slice';
import PrevPageReferenceTracker from './slices/reference-tracking-slices/prev-page-slice';
import cartLocalSlice from './slices/cart-slices/cart-local-slice';
import { resetStore } from './slices/auth/logout-slice';

const appReducer = combineReducers({
  NavbarScreen: navbarSlice,
  LanguagesScreen: LanguageReducer,
  CurrencyScreen: CurrencyReducer,
  GetAccessTokenScreen: GetAccessTokenReducer,
  MultilanguageScreen: MultiLanguageReducer,
  SelectedFilterLangDataScreen: SelectedFilterLangDataScreen,
  wishlistSlice: wishlistSlice,
  cart: cartLocalSlice,
  PrevPageReferenceTracker: PrevPageReferenceTracker,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === resetStore.type) {
    return appReducer(undefined, action);
    // state = {}; // Clear the entire state
  } else {
    return appReducer(state, action);
  }
};

export default rootReducer;
export type RootState = ReturnType<typeof appReducer>;
