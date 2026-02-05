import APP_CONFIG from '../../../interfaces/app-config-interface';
import { executeGETAPI } from '../../../utils/http-methods';

const getAllowedFactoryList = async (appConfig: APP_CONFIG, token: any) => {
    // Use executeGETAPI to handle GET Request logic
    const response = await executeGETAPI(
        appConfig,
        'get-factory-list-api',
        token
    );

    return response;
};

export default getAllowedFactoryList;