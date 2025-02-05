import { reference } from '@popperjs/core';
import { clientSocketInstance } from '../lib/sockets/clientSocketInstance';

let getUsername = '';
let getUserMailID = '';

if (typeof window !== 'undefined') {
  getUsername = localStorage.getItem('party_name') || '';
  getUserMailID = localStorage.getItem('user') || '';
}
type UserData = {
  name: string | null;
  phone: string | null;
};
export function registerUser() {
  // Register user to the server.
  clientSocketInstance.emit('new-user-visit', { userName: getUsername, userEmail: getUserMailID });
}
export function catalogPageVisit(catalogName: string, userContactDetails: UserData) {
  // Track catalog page visit.
  clientSocketInstance.emit('catalog-page-visit', {
    userName: userContactDetails.name,
    phone: userContactDetails.phone,
    catalogName,
  });
}

// export function handleSiteOccupied(username: string) {
//   clientSocketInstance.emit('site-occupied', {
//     user: username,
//   });
// }

// export function handleSiteInSleepMode(username: string) {
//   clientSocketInstance.emit('site-in-sleep-mode', {
//     user: username,
//   });
// }

export function pageViewTracker(
  page_type: string,
  page_id: string,
  action: string,
  reference_type: string,
  reference_id: string,
  user_data: UserData
) {
  const pageData = {
    user_name: user_data.name,
    phone: user_data.phone,
    page_type: page_type,
    page_id: page_id,
    action: action,
    reference_type: reference_type,
    reference_id: reference_id,
  };
  clientSocketInstance.emit('page-visit', pageData);
}
