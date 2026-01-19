import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '../../services/config/app-config';
import fetchDashBardData from '../../services/api/dashboard-api/get-dashboard-api';
import getAllowedFactoryList from '../../services/api/dashboard-api/getAllowedFactoryList';
import { useSelector } from 'react-redux';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { AxiosResponse } from 'axios';

const useDashBoard = () => {
  const router = useRouter();
  const { ARC_APP_CONFIG } = CONSTANTS;
  const TokenFromStore: any = useSelector(get_access_token);

  const [selectedPurity, setSelectedPurity] = useState('22KT');
  const [factories, setFactories] = useState<any[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrMessage] = useState<string>('');
  const [data, setData] = useState<any[]>([]);

  /* -------------------- FETCH FACTORIES -------------------- */

  const fetchFactories = async () => {
    try {
      const res: AxiosResponse = await getAllowedFactoryList(
        ARC_APP_CONFIG,
        TokenFromStore?.token
      );
      
      const factoryList = res?.data?.message || [];
      setFactories(factoryList);

      if (factoryList.length && !selectedFactory) {
        setSelectedFactory(factoryList[0].name);
      }
    } catch (error) {
      setErrMessage('Failed to fetch factories.');
    }
  };

  /* -------------------- FETCH DASHBOARD -------------------- */

  const fetchDashBoardData = async () => {
    if (!selectedFactory) return;

    try {
      setIsLoading(false);

      const requestParams = {
        user: localStorage.getItem('user'),
        status: 'dashboard',
        purity: selectedPurity,
        factory: selectedFactory,
      };

      const res: AxiosResponse = await fetchDashBardData(
        ARC_APP_CONFIG,
        requestParams,
        TokenFromStore?.token
      );

      const { data } = res.data.message.data;
      setData(data);
    } catch (error) {
      setErrMessage('Failed to fetch dashboard data.');
    } finally {
      setIsLoading(true);
    }
  };

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    if (TokenFromStore?.token) {
      fetchFactories();
    }
  }, [TokenFromStore?.token]);

  useEffect(() => {
    fetchDashBoardData();
  }, [selectedPurity, selectedFactory]);

  /* -------------------- STATIC DATA -------------------- */

  const purity = [
    { name: '22KT' },
    { name: '18KT' },
    { name: '14KT' },
    { name: '9KT' },
    { name: '21KT' },
    { name: '92' },
  ];

  /* -------------------- CARD CLICK -------------------- */

  const handleCardClick = (link: string) => {
    const url =
      `${CONSTANTS.REPORTS_BASE_URL}${link}` +
      `?purity=${selectedPurity}&factory=${selectedFactory}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  /* -------------------- COLORS -------------------- */

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
    factories,
    selectedFactory,
    setSelectedFactory,
    colorMap,
    handleCardClick,
    isLoading,
    errorMessage,
  };
};

export default useDashBoard;
