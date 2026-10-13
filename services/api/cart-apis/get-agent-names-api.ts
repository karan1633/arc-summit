import { executeGETAPI } from '../../../utils/http-methods';
import APP_CONFIG from '../../../interfaces/app-config-interface';

// Agent Names the logged-in user can select on the order and cart pages
const fetchAgentNamesAPI = async (appConfig: APP_CONFIG, token: any) => {
  const response = await executeGETAPI(appConfig, 'get-agent-names-api', token);
  return response;
};

export default fetchAgentNamesAPI;
