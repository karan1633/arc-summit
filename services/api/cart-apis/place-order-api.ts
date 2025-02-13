import APP_CONFIG from '../../../interfaces/app-config-interface';
import { executePOSTAPI } from '../../../utils/http-methods';

const postPlaceOrderAPI: any = async (appConfig: APP_CONFIG, apiBody: any, token?: any, socketInfo?: any) => {
  const response = await executePOSTAPI(appConfig, 'place-order-api', apiBody, token, socketInfo);
  return response;
};
export default postPlaceOrderAPI;
