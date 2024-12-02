import React, { useEffect, useState } from 'react';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';
import { useSelector } from 'react-redux';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import getOrderReportAPI from '../../services/api/order-report-apis/order-report-api';
import { useRouter } from 'next/router';
import { CONSTANTS } from '../../services/config/app-config';

const useOrderReport = () => {
  const { SUMMIT_APP_CONFIG, ARC_APP_CONFIG }: any = CONSTANTS;
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const [OrderReportData, setOrderReportData] = useState<any>([]);
  const tokenFromStore: any = useSelector(get_access_token);
  const router: any = useRouter();
  let status: any;
  const user = localStorage.getItem('user');
  const fetchOrderReportDataFunction = async () => {
    switch (router?.query?.order_report) {
      case 'due-date-reminder-report':
        status = 'due_date_orders_list';
        break;
      case 'review-report':
        status = 'review_dispatched_orders_list';
        break;
      case 'pending-order':
        status = 'pending_orders_list';
        break;
      case 'dispatched-orders-report':
        status = 'dispatched_orders_list';
        break;
      case 'in-process-orders-report':
        status = 'in_process_orders_list';
        break;
      case 'late-orders-report':
        status = 'late_orders_list';
        break;
    }
    setIsLoading(true);
    const requestParams = { user, status };
    try {
      const getDispatchOrderData = await getOrderReportAPI(ARC_APP_CONFIG, requestParams, tokenFromStore?.token);
      if (getDispatchOrderData?.status === 200 && getDispatchOrderData?.data?.message?.msg === 'success') {
        setOrderReportData(getDispatchOrderData?.data?.message?.data);
      } else {
        setOrderReportData([]);
        setErrMessage(getDispatchOrderData?.data?.message?.error);
      }
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderReportDataFunction();
  }, [router]);

  return {
    OrderReportData,
    isLoading,
    errorMessage,
    router,
  };
};

export default useOrderReport;
