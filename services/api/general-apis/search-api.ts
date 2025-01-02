import { executeGETAPI } from '../../../utils/http-methods';
import APP_CONFIG from '../../../interfaces/app-config-interface';

const fetchSearchDataAPI = async (appConfig: APP_CONFIG, token: any, searchValue: string) => {
  const additionalParams = { search_value: searchValue }; // Add additional parameters if needed
  // Use executeGETAPI to handle GET Request logic
  const response = await executeGETAPI(
    appConfig,
    'search-api',
    token,
    additionalParams // Pass additional parameters if needed
  );

  return response;
};

export default fetchSearchDataAPI;
