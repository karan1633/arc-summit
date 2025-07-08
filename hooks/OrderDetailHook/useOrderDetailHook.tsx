import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deletOrderApi } from '../../services/api/order-apis/order-list-api';
import getOrderDetailAPI from '../../services/api/order-detail-apis/order-detail-api';
import { deleteOrderApi, getUserPermissionsAPI, readyToDispatchApi } from '../../services/api/order-detail-apis/order-update-api';
import { PostReorderAPI } from '../../services/api/order-detail-apis/reorder-api';
import { CONSTANTS } from '../../services/config/app-config';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { selectCart } from '../../store/slices/cart-slices/cart-local-slice';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';

const useOrderDetailHook = () => {
  const { query } = useRouter();
  const { SUMMIT_APP_CONFIG, ARC_APP_CONFIG }: any = CONSTANTS;
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const tokenFromStore: any = useSelector(get_access_token);
  const dispatch = useDispatch();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>({});
  const orderReOrderCustomerName = orderData?.cust_name;
  const getCustomerName: any = localStorage.getItem('customer-name');
  const [editableCustomerName, setEditableCustomerName] = useState(orderReOrderCustomerName || getCustomerName);
  const { cartCount } = useSelector(selectCart);
  const [showButtons, setShowButtons] = useState(false);

  const fetchOrderData: any = async () => {
    setIsLoading(true);
    try {
      let orderDetailData: any = await getOrderDetailAPI(ARC_APP_CONFIG, query.orderId, tokenFromStore.token);

      if (orderDetailData?.data?.message?.message === 'Success' && orderDetailData?.status === 200) {
        setOrderData(orderDetailData?.data?.message);
      } else {
        setOrderData([]);
        setErrMessage(orderDetailData?.data?.message?.error);
      }
    } catch (error) {
      setErrMessage('Failed to fetch Order data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const reqBody = {
      sales_orders: [query?.orderId],
    };

    const deleteOrder = await deletOrderApi(ARC_APP_CONFIG, reqBody, tokenFromStore.token);
    if (deleteOrder?.status === 200) {
      toast.success(deleteOrder?.data?.message?.data);
    } else {
      toast.warn(deleteOrder?.data?.message?.error);
    }
  };

  let user = localStorage.getItem('user');
  const partyName = localStorage.getItem('party_name');

  const handleReorder = async () => {
    if (cartCount > 0) {
      return toast.warn('Reorder unsuccessful as your Cart is not empty');
    }

    let reorderApi = await PostReorderAPI(ARC_APP_CONFIG, query?.orderId, tokenFromStore.token);
    if (reorderApi?.data?.message?.msg === "success") {
      router.push('/cart');
    }

  };

  const handleShowButtons = async () => {
    let userPermission: any = await getUserPermissionsAPI(ARC_APP_CONFIG, user, tokenFromStore.token);
    if (userPermission?.data?.message?.data) {
      setShowButtons(true);
    }
  };

  const handleDeleteOrder = async (itemCode: any) => {
    const reqBody = {
      item_code: itemCode,
      sales_order: query?.orderId,
    };
    const deleteOrder = await deleteOrderApi(ARC_APP_CONFIG, reqBody, tokenFromStore?.token);
    if (deleteOrder?.status === 200) {
      fetchOrderData();
    }
  };

  const handleReadyToDispatch = async (itemCode: any) => {
    const reqBody = {
      item_code: itemCode,
      sales_order: query?.orderId,
    };
    let readyToDispatch = await readyToDispatchApi(ARC_APP_CONFIG, reqBody, tokenFromStore.token);
    if (readyToDispatch?.data?.message?.data) {
      fetchOrderData();
    }
  };

  useEffect(() => {
    fetchOrderData();
    handleShowButtons();
  }, [query]);

  return { orderData, isLoading, errorMessage, handleCancelOrder, handleReorder, showButtons, handleDeleteOrder, handleReadyToDispatch };
};

export default useOrderDetailHook;
