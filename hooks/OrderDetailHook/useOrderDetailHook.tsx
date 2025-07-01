import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';
import getOrderDetailAPI from '../../services/api/order-detail-apis/order-detail-api';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { CONSTANTS } from '../../services/config/app-config';
import { deletOrderApi } from '../../services/api/order-apis/order-list-api';
import { selectCart } from '../../store/slices/cart-slices/cart-local-slice';
import { PostAddToCartAPI } from '../../services/api/cart-apis/add-to-cart-api';
import { deleteOrderApi, getUserPermissionsAPI, readyToDispatchApi } from '../../services/api/order-detail-apis/order-update-api';

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

  const handleReorder = async (customerName: any) => {
    if (cartCount > 0) {
      return toast.warn('Reorder unsuccessful as your Cart is not empty');
    }
    const reOrderOrderDetail = orderData?.data?.map((ele: any) => ele?.orders);
    // // Declare variables outside
    // let itemCode: any;
    // let reorderPurity: any;
    // let orderDetails: any = [];
    const paramsArray: any = [];
    // let colour: any, qty: any, size: any, weight: any;
    // // Accessing item_code if there is an extra array level
    // if (
    //   Array.isArray(reOrderOrderDetail) &&
    //   reOrderOrderDetail.length > 0 &&
    //   Array.isArray(reOrderOrderDetail[0]) &&
    //   reOrderOrderDetail[0].length > 0
    // ) {
    //   itemCode = reOrderOrderDetail[0][0].item_code;
    //   reorderPurity = reOrderOrderDetail[0][0].purity;

    //   // Accessing the order array
    //   orderDetails = reOrderOrderDetail[0][0].order;
    //   if (Array.isArray(orderDetails) && orderDetails.length > 0) {
    //     ({ colour, qty, size, weight } = orderDetails[0]);
    //   }
    // } else {
    // }
    reOrderOrderDetail.forEach((productArray: any[]) => {
      productArray.forEach((product: any) => {

        const itemCode = product.item_code;
        const reorderPurity = product.purity;

        // Accessing the order array
        const orderDetails = product.order;

        // Initialize variables for product details
        let colour = '';
        let qty = 0;
        let size = '';
        let weight = 0;

        if (Array.isArray(orderDetails) && orderDetails.length > 0) {
          // Initialize the qty_size_list array for this product

          // Assuming the first element contains the necessary details
          ({ colour, qty, size, weight } = orderDetails[0]);
        }
        const qtySizeList = orderDetails.map((order: any) => ({
          quantity: order.qty,
          size: order.size,
          colour: order.colour,
        }));

        // Create params object for this product
        const params = {
          cust_name: editableCustomerName || customerName,
          item_code: itemCode,
          purity: reorderPurity,
          qty_size_list: qtySizeList,
          colour: colour,
          remark: product?.remark,
          user: user || null,
          wastage: '',
          party_name: partyName,
        };

        paramsArray.push(params);
      });
    });

    for (const params of paramsArray) {
      await PostAddToCartAPI(ARC_APP_CONFIG, params, tokenFromStore.token); // Call PostCartAPI
    }
    router.push('/cart');
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
