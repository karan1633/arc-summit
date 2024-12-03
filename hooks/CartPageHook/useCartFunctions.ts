import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PostAddToCartAPI } from '../../services/api/cart-apis/add-to-cart-api';
import fetchCartListingAPI from '../../services/api/cart-apis/cart-listing-api';
import { DeleteClearCart } from '../../services/api/cart-apis/clear-cart-api';
import postPlaceOrderAPI from '../../services/api/cart-apis/place-order-api';
import { DeleteItemFromCart } from '../../services/api/cart-apis/remove-item-api';
import { CONSTANTS } from '../../services/config/app-config';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { addCartList, addItemToCart, clearCart, removeItemFromCart, selectCart } from '../../store/slices/cart-slices/cart-local-slice';
import updateCartDataAPI from '../../services/api/cart-apis/update-customer-name';

const useAddToCartHook = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const tokenFromStore: any = useSelector(get_access_token);
  const { quotation_Id } = useSelector(selectCart);
  const { SUMMIT_APP_CONFIG, ARC_APP_CONFIG }: any = CONSTANTS;

  const [disableRemove, setDisableRemove] = useState<boolean>(false);
  const extractProductCodes = (data: any[]) => {
    return data?.flatMap((category) => category.orders.map((order: any) => order.item_code));
  };
  const getCartList = async (setCartListingItems: any) => {
    try {
      let cartListingData: any = await fetchCartListingAPI(ARC_APP_CONFIG, tokenFromStore.token);
      if (cartListingData.data.message.msg === 'success') {
        setCartListingItems(cartListingData?.data?.message?.data);
        let cartData = extractProductCodes(cartListingData?.data?.message?.data?.categories);
        let quotationId = cartListingData?.data?.message?.data?.name;
        dispatch(addCartList({ cartData, quotationId }));
      } else {
        setCartListingItems({});
      }
      return cartListingData;
    } catch (error) {
      return;
    }
  };
  const addToCartItem = async (params: any, setCartListingItems?: any) => {
    const postDataInCart = await PostAddToCartAPI(ARC_APP_CONFIG, params, tokenFromStore?.token);
    if (postDataInCart?.status === 200 && postDataInCart?.data?.message?.msg === 'success') {
      dispatch(addItemToCart(params?.item_code));
      if (setCartListingItems) {
        getCartList(setCartListingItems);
        toast.success('Product updated successfully!');
      } else {
        toast.success('Product added to cart successfully!');
      }
    } else {
      toast.error('Failed to add product to Cart.');
    }
  };
  const placeOrderAPIFunc = async (params: any, setCartListingItems: any) => {
    const placeOrder = await postPlaceOrderAPI(ARC_APP_CONFIG, params, tokenFromStore?.token);
    if (placeOrder?.data?.message?.msg === 'success') {
      router.push('/order-history');
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      setCartListingItems({});
    } else {
      toast.error('Failed to place order.');
    }
  };
  const RemoveItemCartAPIFunc = async (params: any, setCartListingItems: any) => {
    setDisableRemove(true);
    const removeCartfunc = await DeleteItemFromCart(SUMMIT_APP_CONFIG, params, tokenFromStore?.token);
    if (removeCartfunc?.data?.message?.msg === 'success') {
      dispatch(removeItemFromCart(params?.item_code));
      toast.success('Product removed from cart successfully!');
      getCartList(setCartListingItems);
      setDisableRemove(false);
    } else {
      toast.error('Failed to remove product from cart');
      setDisableRemove(false);
    }
  };

  const cLearCartAPIFunc = async (quotation_id: any) => {
    const clearCartfunc = await DeleteClearCart(SUMMIT_APP_CONFIG, quotation_id, tokenFromStore?.token);
    if (clearCartfunc?.status === 200) {
      dispatch(clearCart());
      toast.success('Cart cleared sucessfully!');
    } else {
      toast.error('Failed to clear cart.');
    }
  };

  const updateCartData = async (custName: any, updatedPurity: any, setPurity: any) => {
    const reqBody = {
      purity: updatedPurity,
      customer_name: custName,
      quotation_id: quotation_Id,
    };
    const updateCustName = await updateCartDataAPI(ARC_APP_CONFIG, reqBody, tokenFromStore?.token);
    if (updateCustName?.status === 200) {
      toast.success(' updated successfully!');
      setPurity(updatedPurity);
    } else {
      toast.error('Failed to Upadte');
    }
  };

  // const updatePurityFunc = async (updatedPurity: any, setPurity: any) => {
  //   const reqBody = {
  //     purity: updatedPurity,
  //     quotation_id: quotation_Id,
  //   };
  //   const updateCustName = await updateCustNameAPI(ARC_APP_CONFIG, reqBody, tokenFromStore?.token);
  //   if (updateCustName?.status === 200) {
  //     toast.success('Purtiy Updated successfully!');
  //     setPurity(updatedPurity);
  //   } else {
  //     toast.error('Failed to Upadte Purity');
  //   }
  // };

  return { addToCartItem, placeOrderAPIFunc, RemoveItemCartAPIFunc, cLearCartAPIFunc, disableRemove, updateCartData };
};
export default useAddToCartHook;
