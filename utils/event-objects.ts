import { SocketInfoTypes } from '../interfaces/socket-types';
import { returnLastPageViewedData, setRecentPageData } from './get-last-page-viewed-data';
import { catalogPageEventData } from './socket-registry';

export const returnSocketAdditionalData = (socketInfo: SocketInfoTypes) => {
  const getLastViewedPage = returnLastPageViewedData();
  setRecentPageData(socketInfo.page_type, socketInfo.page_id);
  const referenceObj = { reference_type: getLastViewedPage?.reference_type, reference_id: getLastViewedPage?.reference_id };
  const userName = localStorage.getItem('party_name');
  const userEmailId = localStorage.getItem('user');

  const user_data = {
    name: userName,
    phone: '',
    emailID: userEmailId,
  };
  return { ...referenceObj, user_data, is_active: socketInfo?.action !== 'Add to Cart' ? true : false };
};
