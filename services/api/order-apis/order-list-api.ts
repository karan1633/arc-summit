import APP_CONFIG from '../../../interfaces/app-config-interface';
import { executeGETAPI, executePOSTAPI } from '../../../utils/http-methods';

/**
 * Fetches Order History data from the API using the given parameters.
 *
 * @async
 * @function getOrderListAPI
 * @param {string} appName - The name of the application.
 * @param {string} token - The authentication token.
 * @param {object} params - Optional params object contains page filter for the order listing.
 * @param {string} status - Optional status filter for the order listing.
 * @returns {Promise<any>} - The response from the API call.
 * @throws {Error} Throws an error if the API call fails.
 */
export const getOrderListAPI = async (appConfig: APP_CONFIG, params: any, status: string, token: any): Promise<any> => {
  const user = localStorage.getItem('user') || '';
  let additionalParams = { user, ...(params && { ...params }), ...(status && { status }) };
  // Use executeGETAPI to handle GET Request logic
  const response = await executeGETAPI(
    appConfig,
    'order-list-api',
    token,
    additionalParams // Pass additional parameters if needed
  );

  return response;
};

/**
 * Cancelling bulk order list
 *
 * @async
 * @function deletOrderApi
 * @param {string} appConfig - The name of the application.
 * @param {string} [body] - request body
 * @param {string} token - The authentication token.
 * @returns {Promise<any>} - The response from the API call.
 * @throws {Error} Throws an error if the API call fails.
 */

export const deletOrderApi = async (appConfig: APP_CONFIG, body: any, token: any): Promise<any> => {
  const response = await executePOSTAPI(appConfig, 'bulk-order-cancel-api', body, token);
  return response;
};
