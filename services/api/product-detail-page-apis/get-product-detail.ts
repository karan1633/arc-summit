import APP_CONFIG from '../../../interfaces/app-config-interface';
import { SocketInfoTypes } from '../../../interfaces/socket-types';
import { executeGETAPI } from '../../../utils/http-methods';

const fetchProductDetailData = async (appConfig: APP_CONFIG, requestParams: any, token: any) => {
  const additionalParams = { ...requestParams }; // Add additional parameters if needed
  let socketInfo: SocketInfoTypes = { page_type: 'Product', page_id: requestParams?.slug, action: 'Page View' };
  // Use executeGETAPI to handle GET Request logic
  const response = await executeGETAPI(
    appConfig,
    'product-detail-api',
    token,
    additionalParams, // Pass additional parameters if needed
    undefined,
    socketInfo
  );

  return response;
};

export default fetchProductDetailData;
