import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '../../services/config/app-config';
import fetchDashBardData from '../../services/api/dashboard-api/get-dashboard-api';
import { useSelector } from 'react-redux';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { Axios, AxiosResponse } from 'axios';

const useDashBoard = () => {
  const router = useRouter();
  const { ARC_APP_CONFIG } = CONSTANTS;
  const TokenFromStore: any = useSelector(get_access_token);
  const [selectedPurity, setSelectedPurity] = useState('22KT');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrMessage] = useState<string>('');
  const [data, setData] = useState([
    {
      report_name: 'Pending Orders',
      link: 'pending-order',
      total_qty: 4585,
      total_weight: 12345.6531,
      total_net_weight: 19117.26,
      total_sales_orders: 24,
    },
    {
      report_name: 'In Process Orders',
      link: 'in-process-orders-report',
      total_qty: 19490,
      total_weight: 54556.611,
      total_net_weight: 60688.91,
      total_sales_orders: 79,
    },
    {
      report_name: 'Dispatched Orders',
      link: 'dispatched-orders-report',
      total_qty: 0,
      total_weight: 0,
      total_net_weight: 0,
      total_sales_orders: 0,
    },
    {
      report_name: 'Due Date Orders',
      link: 'due-date-reminder-report',
      total_qty: 965,
      total_weight: 1101.8611,
      total_net_weight: 1634.65,
      total_sales_orders: 6,
    },
    {
      report_name: 'Late Orders',
      link: 'late-orders-report',
      total_qty: 16533,
      total_weight: 33641.6203,
      total_net_weight: 41910.41,
      total_sales_orders: 63,
    },
    {
      report_name: 'Review Dispatched Orders',
      link: 'review-report',
      total_qty: 0,
      total_weight: 0,
      total_net_weight: 0,
      total_sales_orders: 0,
    },
  ]);

  const requestParams = {
    user: localStorage.getItem('user'),
    status: 'dashboard',
    purity: selectedPurity,
  };
  const fetchDashBoardData = async () => {
    try {
      setIsLoading(false);
      const res: AxiosResponse = await fetchDashBardData(ARC_APP_CONFIG, requestParams, TokenFromStore?.token);
      const { data } = res.data.message.data;
      setData(data);
    } catch (error) {
      setErrMessage('Failed to fetch dashboard data.');
      console.log('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchDashBoardData();
  }, [selectedPurity]);

  const purity = [
    {
      name: '22KT',
    },
    {
      name: '18KT',
    },
    {
      name: '14KT',
    },
    {
      name: '9KT',
    },
    {
      name: '21KT',
    },
    {
      name: '92',
    },
  ];

  const handleCardClick = (link: string) => {
    router.push(`reports/${link}`);
  };

  const colorMap: any = {
    'Pending Orders': '#3b5998',
    'In Process Orders': '#f48024',
    'Dispatched Orders': '#4CAF50',
    'Due Date Orders': '#FFD700',
    'Late Orders': '#003366',
    'Review Dispatched Orders': '#000080',
  };
  return {
    data,
    purity,
    selectedPurity,
    setSelectedPurity,
    colorMap,
    handleCardClick,
    isLoading
  };
};

export default useDashBoard;
