import APP_CONFIG from '../../../interfaces/app-config-interface';
import { SocketInfoTypes } from '../../../interfaces/socket-types';
import { executeGETAPI } from '../../../utils/http-methods';

type PrevPageTypes = {
  reference_type: string;
  reference_id: string;
};

const fetchProductDetailData = async (appConfig: APP_CONFIG, requestParams: any, token: any) => {
  const additionalParams = { ...requestParams }; // Add additional parameters if needed
  const retrieveSessionStorage = sessionStorage.getItem('summit_page_data');
  const { reference_type, reference_id } = JSON.parse(retrieveSessionStorage) || {};
  let socketInfo: SocketInfoTypes = {
    page_type: 'Product',
    page_id: requestParams?.slug,
    action: 'Page View',
    reference_type,
    reference_id,
  };
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
