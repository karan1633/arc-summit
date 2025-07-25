import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import getNavbarDataFromAPI from '../../services/api/general-apis/navbar-api';
import { clearToken, get_access_token } from '../../store/slices/auth/token-login-slice';
import { currency_selector_state } from '../../store/slices/general_slices/multi-currency-slice';
import { CONSTANTS } from '../../services/config/app-config';
import logoutUser from '../../services/api/auth/logout-api';
import useHandleStateUpdate from './handle-state-update-hook';
import { useRouter } from 'next/router';
import { resetStore } from '../../store/slices/auth/logout-slice';
import { RootState } from '../../store/root-reducer';
import { addNavbarData } from '../../store/slices/general_slices/navbar-slice';
const useNavbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const category = useSelector((state: RootState) => state.NavbarScreen);
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const { SUMMIT_APP_CONFIG }: any = CONSTANTS;
  const currency_state_from_redux: any = useSelector(currency_selector_state);
  const TokenFromStore: any = useSelector(get_access_token);

  const [navbarData, setNavbarData] = useState<any>(null);

  const [selectedCurrencyValue, setSelectedCurrencyValue] = useState('');

  const handleLogoutUser = async () => {
    let logoutAPIResponse: any;
    try {
      logoutAPIResponse = await logoutUser(null, TokenFromStore?.token);
      if (logoutAPIResponse?.status === 200) {
        dispatch(resetStore());
        localStorage.clear();
        router.push('/login');
      }
    } catch (error) {
      toast.error("Couldn't log out. Please try back in sometime");
    }
  };

  const fetchNavbarDataAPI = async () => {
    if (category?.items?.length > 0 && category?.items?.every((item: any) => item?.values?.length > 0)) {
      setNavbarData(category?.items);
      return
    }
    else {
      let navbarDataAPI: any;
      setIsLoading(true);
      try {
        navbarDataAPI = await getNavbarDataFromAPI(SUMMIT_APP_CONFIG, TokenFromStore?.token);
        if (navbarDataAPI?.data?.message?.msg === 'success' && navbarDataAPI?.data?.message?.data?.length > 0) {
          const sortedNavbarData = [...navbarDataAPI?.data?.message?.data].sort(function (a: any, b: any) {
            return a.seq - b.seq;
          });
          dispatch(addNavbarData(sortedNavbarData));
        } else {
          setNavbarData([]);
          setErrMessage(navbarDataAPI?.data?.message?.error);
        }
      } catch (error) {
        setErrMessage(navbarDataAPI?.data?.message?.error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchNavbarDataAPI();
  }, []);

  useEffect(() => {
    setNavbarData(category.items);
  }, [category]);

  useEffect(() => {
    setSelectedCurrencyValue(currency_state_from_redux?.selected_currency_value);
  }, [currency_state_from_redux?.selected_currency_value]);
  return {
    navbarData,
    isLoading,
    errorMessage,
    selectedCurrencyValue,
    handleLogoutUser,
  };
};

export default useNavbar;
