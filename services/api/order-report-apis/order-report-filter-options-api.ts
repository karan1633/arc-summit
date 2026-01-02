import APP_CONFIG from '../../../interfaces/app-config-interface';
import { executeGETAPI } from '../../../utils/http-methods';

const getOrderReportFilterOptionsAPI = async (appConfig: APP_CONFIG, status: any, token: any) => {
    const user = localStorage.getItem('user') || '';
    const params = {
        user,
        status
    };
    const response = await executeGETAPI(
        appConfig,
        'order-reports-filter-options',
        token,
        params
    );

    return response;
};

export default getOrderReportFilterOptionsAPI;
