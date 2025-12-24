import axios from 'axios';
import { CONSTANTS } from '../../config/app-config';
import APP_CONFIG from '../../../interfaces/app-config-interface';

const UserRoleFetch = async (appConfig: APP_CONFIG, token: any) => {
  const {access_token, unique_key} = token
  let response: any;
  const version = appConfig.version;
  const method = 'get_user_profile';
  const entity = 'signin';
  const apiSDKName = appConfig.app_name;

  const config = {
    headers: {
      Authorization: access_token,
      "x-api-key": unique_key
    },
  };

  await axios
    .get(
      `${CONSTANTS.API_BASE_URL}${apiSDKName}?version=${version}&method=${method}&entity=${entity}`,
      { ...config, timeout: 5000 }
      // config
    )
    .then((res: any) => {
      response = res?.data?.message?.data;
      const navbarPermissions = JSON.stringify({
          "is_show_dashboard": response?.is_show_dashboard,
          "is_show_orders": response?.is_show_orders,
          "is_show_reports": response?.is_show_reports
        });

      if (Object.keys(response)?.length > 0) {
        localStorage.setItem('isDealer', response.is_dealer);
        localStorage.setItem('isSuperAdmin', response.is_superadmin);
        localStorage.setItem('isCatalogUser', response.is_catalog_user);
        localStorage.setItem('navbarPermissions', navbarPermissions);
      }
    })
    .catch((err: any) => {
      if (err.code === 'ECONNABORTED') {
        response = 'Request timed out';
      } else if (err.code === 'ERR_BAD_REQUEST') {
        response = 'Bad Request';
      } else if (err.code === 'ERR_INVALID_URL') {
        response = 'Invalid URL';
      } else {
        response = err;
      }
    });

  return response;
};

const UserRoleGet = (appConfig: APP_CONFIG, token: any) => UserRoleFetch(appConfig, token);

export default UserRoleGet;
