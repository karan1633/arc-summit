import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../services/config/app-config';
import fetchAgentNamesAPI from '../../services/api/cart-apis/get-agent-names-api';
import { get_access_token } from '../../store/slices/auth/token-login-slice';

// Agent Names the logged-in user can select: only their own agent if they are its Default User, otherwise every
// enabled Agent Name they are permitted to see
const useAgentNames = () => {
  const TokenFromStore: any = useSelector(get_access_token);
  const { ARC_APP_CONFIG }: any = CONSTANTS;
  const [agentNames, setAgentNames] = useState<string[]>([]);
  const [isAgentNamesLoading, setIsAgentNamesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgentNames = async () => {
      const response: any = await fetchAgentNamesAPI(ARC_APP_CONFIG, TokenFromStore?.token);
      setAgentNames(response?.data?.message?.msg === 'success' ? response?.data?.message?.data || [] : []);
      setIsAgentNamesLoading(false);
    };
    fetchAgentNames();
  }, [TokenFromStore?.token]);

  return { agentNames, isAgentNamesLoading };
};

export default useAgentNames;
