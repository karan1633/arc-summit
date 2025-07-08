import APP_CONFIG from '../../../interfaces/app-config-interface';
import { callPostAPI } from '../../../utils/http-methods';
import { CONSTANTS } from '../../config/app-config';

export const PostReorderAPI: any = async (appConfig: APP_CONFIG, params: any, token?: any) => {
    let response: any;
    let version = appConfig.version;
    const method = 'create_quotation_from_sales_order';
    const entity = 'cart';
    const apiSDKName = appConfig.app_name;

    const url = `${CONSTANTS.API_BASE_URL}${apiSDKName}?version=${version}&method=${method}&entity=${entity}&sales_order_id=${params}`;

    response = await callPostAPI(url, undefined, token);
    return response;
};
