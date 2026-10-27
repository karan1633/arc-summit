import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../services/config/app-config';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { callGetAPI } from '../../utils/http-methods';

// Enabled Agent Names the logged-in user may see. The resource API runs frappe.get_list, so User Permissions apply.
const useAgentNames = () => {
  const TokenFromStore: any = useSelector(get_access_token);
  const [agentNames, setAgentNames] = useState<string[]>([]);
  const [isAgentNamesLoading, setIsAgentNamesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAgentNames = async () => {
      const params = new URLSearchParams({
        filters: JSON.stringify([['disabled', '=', 0]]),
        order_by: 'name asc',
        limit_page_length: '0',
      });
      const url = `${CONSTANTS.API_BASE_URL}/api/resource/${encodeURIComponent('Agent Name')}?${params.toString()}`;
      const response: any = await callGetAPI(url, TokenFromStore?.token);
      setAgentNames((response?.data?.data || []).map((agent: any) => agent.name));
      setIsAgentNamesLoading(false);
    };
    fetchAgentNames();
  }, [TokenFromStore?.token]);

  return { agentNames, isAgentNamesLoading };
};

export default useAgentNames;
