import { clientSocketInstance } from '../lib/sockets/clientSocketInstance';

type UserData = {
  name: string | null;
  phone: string | null;
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
  console.log('user_data', user_data);
  const pageData = {
    user_name: user_data?.name,
    phone: user_data?.phone,
    page_type,
    page_id,
    action,
    reference_type,
    reference_id,
    is_active,
  };
  clientSocketInstance.emit('user-event', pageData);
}
