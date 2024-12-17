import { executeGETAPI } from '../../../utils/http-methods';
import APP_CONFIG from '../../../interfaces/app-config-interface';

const fetchCustomerNameAPI = async (appConfig: APP_CONFIG, token: any, user: any) => {
  const additionalParams = { user }; // Add additional parameters if needed
  // Use executeGETAPI to handle GET Request logic
  const response = await executeGETAPI(
    appConfig,
    'get-customer-name-api',
    token,
    additionalParams // Pass additional parameters if needed
  );

  return response;
};

export default fetchCustomerNameAPI;
