import { clientSocketInstance } from '../lib/sockets/clientSocketInstance';

type UserData = {
  name: string | null;
  phone: string | null;
  emailID: string | null;
};

export function eventTracker(
  page_type: string,
  page_id: string,
  action: string,
  reference_type: string,
  reference_id: string,
  user_data: UserData,
  is_active: boolean
) {
  const pageData = {
    user_name: user_data?.name,
    phone: user_data?.phone,
    email_id: user_data?.emailID,
    page_type,
    page_id,
    action,
    reference_type,
    reference_id,
    is_active,
  };
  clientSocketInstance.emit('user-event', pageData);
}
export function userMovingForward(socketData: any) {
  return new Promise((resolve) => {
    clientSocketInstance.emit('client-new-page', { uid: socketData[0]?.uid }, (acknowledgment: any) => {
      console.log('ackneledgement', acknowledgment);
      if (acknowledgment.success) {
        resolve(acknowledgment);
      } // Resolve the promise when the server acknowledges
    });
  });
}
