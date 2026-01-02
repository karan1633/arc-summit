import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { deletOrderApi, getOrderListAPI } from '../../services/api/order-apis/order-list-api';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';
import { CONSTANTS } from '../../services/config/app-config';
import getOrderReportFilterOptionsAPI from '../../services/api/order-report-apis/order-report-filter-options-api';

type SelectOption = {
  label: string;
  value: string;
};

type Filters = {
  transaction_date: string;
  delivery_date: string;
  customer_name: SelectOption | null;
  order_id: SelectOption | null;
  purity: SelectOption | null;
};

const useOrderListHook = () => {
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const { SUMMIT_APP_CONFIG, ARC_APP_CONFIG }: any = CONSTANTS;
  const router: any = useRouter();
  const { query }: any = router;
  const [orderListData, setOrderListData] = useState<any>([]);
  const [orderListTotalCount, setOrderListTotalCount] = useState<any>([]);
  const [selectedOrder, setSelectedOrders] = useState<string[]>([]);
  const tokenFromStore: any = useSelector(get_access_token);
  const [filters, setFilters] = useState<Filters>({
    transaction_date: '',
    delivery_date: '',
    customer_name: null,
    order_id: null,
    purity: null,
  });
  const [filterOptions, setFilterOptions] = useState<{
    customers: SelectOption[];
    purities: SelectOption[];
    order_ids: SelectOption[];
  }>({
    customers: [],
    purities: [],
    order_ids: [],
  });


  const handlePaginationBtn = (pageNo: any) => {
    router.push({
      query: { ...query, page: pageNo + 1 },
    });
  };

  const fetchOrderListingDataFun: any = async () => {
    let getOrderListingData: any;
    setIsLoading(true);
    const updateStatus: any = (query: any) => {
      if (query === 'completed-orders') {
        return 'Completed';
      } else if (query === 'cancelled-orders') {
        return 'Cancelled';
      } else {
        return '';
      }
    };
    const status: any = updateStatus(query?.orderStatus);

    const params = {
      page: query?.page || 1,
      limit: 12,
      transaction_date: filters.transaction_date,
      delivery_date: filters.delivery_date,
      customer_name: filters.customer_name?.value || '',
      purity: filters.purity?.value || '',
      order_id: filters.order_id?.value || '',
    };


    /**
     * Fetches order listing data from the API using the given token and status.
     *
     * @async
     * @function getOrderListAPI
     * @param {Object} ARC_APP_CONFIG - The Summit API SDK object used to interact with the API.
     * @param {string} token - The authentication token obtained from the store.
     * @param {string} status - The order status to filter the listing data. Could be any of 3 values 1. Completed 2.Cancelled or 3. ''.
     * @returns {Promise<void>} - Resolves when the API response is handled.
     * @throws {Error} Throws an error if the API call fails.
     */
    try {
      getOrderListingData = await getOrderListAPI(ARC_APP_CONFIG, params, status, tokenFromStore.token);
      if (getOrderListingData?.data?.message?.msg === 'success') {
        setOrderListData(getOrderListingData?.data?.message?.data);
        setOrderListTotalCount(getOrderListingData?.data?.message?.total_count);
      } else {
        setErrMessage(getOrderListingData?.data?.message?.error);
      }
    } catch (error) {
      setErrMessage(getOrderListingData?.data?.message?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrder = (orderId: any) => {
    if (selectedOrder?.includes(orderId)) {
      setSelectedOrders(selectedOrder.filter((order: any) => order !== orderId));
    } else {
      setSelectedOrders([...selectedOrder, orderId]);
    }
  };

  const deleteBulkOrder = async () => {
    const reqBody = {
      sales_orders: selectedOrder,
    };

    if (selectedOrder.length > 0) {
      const deleteOrder = await deletOrderApi(ARC_APP_CONFIG, reqBody, tokenFromStore.token);
      if (deleteOrder?.status === 200) {
        // const updatedOrderList = orderListData?.filter((prev: any) => !selectedOrder.some((order: any) => order === prev?.name));
        // setOrderListData(updatedOrderList);
        // setSelectedOrders([]);
        fetchOrderListingDataFun();
      }
    }
  };

  useEffect(() => {
    fetchOrderListingDataFun();
  }, [query, filters]);

  useEffect(() => {
    if (!tokenFromStore?.token) return;

    const fetchFilterOptions = async () => {
      try {
        const res = await getOrderReportFilterOptionsAPI(
          ARC_APP_CONFIG,
          status,
          tokenFromStore.token
        );

        setFilterOptions({
          customers: (res?.data?.message?.customers || []).map((c: string) => ({
            label: c,
            value: c,
          })),
          purities: (res?.data?.message?.purities || []).map((p: string) => ({
            label: p,
            value: p,
          })),
          order_ids: (res?.data?.message?.order_ids || []).map((o: string) => ({
            label: o,
            value: o,
          })),
        });
      } catch {
        setFilterOptions({ customers: [], purities: [], order_ids: [] });
      }
    };

    fetchFilterOptions();
  }, [tokenFromStore?.token]);

  return {
    orderListData,
    isLoading,
    errorMessage,
    filters,
    setFilters,
    filterOptions,
    handleSelectOrder,
    deleteBulkOrder,
    handlePaginationBtn,
    orderListTotalCount,
  };


};

export default useOrderListHook;
