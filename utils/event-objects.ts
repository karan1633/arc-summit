import { SocketInfoTypes } from '../interfaces/socket-types';

export const returnSocketAdditionalData = (socketInfo: SocketInfoTypes) => {
  const userName = localStorage.getItem('party_name');
  const userEmailId = localStorage.getItem('user');

  const user_data = {
    name: userName,
    phone: '',
    emailID: userEmailId,
  };
  return { user_data, is_active: socketInfo?.action !== 'Add to Cart' ? true : false };
};
