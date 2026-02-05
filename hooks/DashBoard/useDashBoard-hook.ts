import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '../../services/config/app-config';
import fetchDashBardData from '../../services/api/dashboard-api/get-dashboard-api';
import { useSelector } from 'react-redux';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { Axios, AxiosResponse } from 'axios';
import { callGetAPI } from '../../utils/http-methods';
import getAllowedFactoryList from '../../services/api/dashboard-api/getAllowedFactoryList';

const useDashBoard = () => {
  const router = useRouter();
  const { ARC_APP_CONFIG } = CONSTANTS;
  const TokenFromStore: any = useSelector(get_access_token);
  const [selectedPurity, setSelectedPurity] = useState('22KT');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrMessage] = useState<string>('');
  const [data, setData] = useState([]);
  const [purity, setPurity] = useState([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<string>('');

  const requestParams = {
    user: localStorage.getItem('user'),
    status: 'dashboard',
    purity: selectedPurity,
  };

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

  useEffect(() => {
    fetchDashBoardData();
  }, [selectedPurity, selectedFactory]);

  const getPurityValues = async () => {
    const url = `${CONSTANTS.API_BASE_URL}/api/resource/Purity`;
    const fetchPurityValues = await callGetAPI(url, TokenFromStore?.token);
    const purityValues = fetchPurityValues?.data?.data;
    setPurity(purityValues);
    if (purityValues.length) setSelectedPurity(purityValues[0].name);
  };

  const handleCardClick = (link: string) => {
    const url = `${CONSTANTS.REPORTS_BASE_URL}${link}` +
      `?purity=${selectedPurity}&factory=${selectedFactory}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const colorMap: any = {
    'Pending Orders': '#3b5998',
    'In Production Orders': '#f48024',
    'Dispatched Orders': '#4CAF50',
    'Late Orders': '#FFD700',
    'Due Date Orders': '#003366',
    'Completed Orders': '#000080',
  };

  useEffect(() => {
    getPurityValues();
    fetchFactories();
  }, []);

  return {
    data,
    purity,
    selectedPurity,
    setSelectedPurity,
    colorMap,
    handleCardClick,
    isLoading,
    factories,
    selectedFactory,
    setSelectedFactory,
  };
};

export default useDashBoard;
