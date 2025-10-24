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
  const [data, setData] = useState([]);

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
   router.push(`${link}?purity=${selectedPurity}`);
  };

  const colorMap: any = {
    'Pending Orders': '#3b5998',
    'In Production Orders': '#f48024',
    'Dispatched Orders': '#4CAF50',
    'Late Orders': '#FFD700',
    'Due Date Orders': '#003366',
    'Completed Orders': '#000080',
  };
  return {
    data,
    purity,
    selectedPurity,
    setSelectedPurity,
    colorMap,
    handleCardClick,
    isLoading,
  };
};

export default useDashBoard;
