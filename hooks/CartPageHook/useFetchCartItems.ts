import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchCartListingAPI from '../../services/api/cart-apis/cart-listing-api';
import { CONSTANTS } from '../../services/config/app-config';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { addCartList, selectCart } from '../../store/slices/cart-slices/cart-local-slice';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';
import { callGetAPI } from '../../utils/http-methods';
const useFetchCartItems = () => {
  const dispatch = useDispatch();
  const { ARC_APP_CONFIG }: any = CONSTANTS;
  const [cartListingItems, setCartListingItems] = useState<any>({});
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const local_cust_name = localStorage.getItem('cust_name');
  const tokenFromStore: any = useSelector(get_access_token);
  const [purity, setPurity] = useState<any[]>([]);
  const { cartCount } = useSelector(selectCart);

  const extractProductCodes = (data: any[]) => {
    return data?.flatMap((category) => category.orders.map((order: any) => order.item_code));
  };
  const fetchCartListingData: any = async () => {
    setIsLoading(true);
    try {
      let cartListingData: any = await fetchCartListingAPI(ARC_APP_CONFIG, tokenFromStore.token);
      if (cartListingData?.status === 200 && cartListingData?.data?.message?.msg === 'success') {
        if (local_cust_name === '') {
          localStorage.setItem(
            'cust_name',
            cartListingData?.data?.message?.data?.cust_name ? cartListingData?.data?.message?.data?.cust_name : ''
          );
        }
        if (Object.keys(cartListingData?.data?.message?.data).length !== 0) {
          setCartListingItems(cartListingData?.data?.message?.data);
          const cartData = extractProductCodes(cartListingData?.data?.message?.data?.categories);
          const quotationId = cartListingData?.data?.message?.data?.name;
          dispatch(addCartList({ cartData, quotationId }));
        } else {
          setCartListingItems({});
          const cartData: any[] = [];
          const quotationId = '';
          dispatch(addCartList({ cartData, quotationId }));
        }
      } else {
        setCartListingItems({});
        setErrMessage(cartListingData?.data?.message?.error);
      }
    } catch (error) {
      setErrMessage('Failed to fetch cart listing data.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPurityValues = async () => {
    const url = `${CONSTANTS.API_BASE_URL}/api/resource/Purity`;
    const fetchPurityValues = await callGetAPI(url, tokenFromStore.token);
    return fetchPurityValues;
  };

  const fetchPurityValues = async () => {
    const values = await getPurityValues();
    setPurity(values?.data?.data);
  };

  useEffect(() => {
    fetchCartListingData();
    fetchPurityValues();
  }, []);

  return {
    cartListingItems,
    setCartListingItems,
    isLoading,
    errorMessage,
    cartCount,
    purity,
    fetchCartListingData
  };
};
export default useFetchCartItems;
