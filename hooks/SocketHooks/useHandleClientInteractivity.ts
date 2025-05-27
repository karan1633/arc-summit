import { clientSocketInstance } from '../../lib/sockets/clientSocketInstance';
import { emitSocketEvent } from '../../utils/http-methods';

export const useHandleClientInteractivity = () => {
  const userEventRegistered = () => {
    clientSocketInstance.on('user-register-success', (data: any) => {
      localStorage.setItem('socket_data', JSON.stringify(data));
    });
  };
  const handleVisibilityChange = (documentVisibility: any) => {
    if (documentVisibility === 'hidden') {
      let socket_data: any = localStorage.getItem('socket_data');
      // let parsedSocketData = JSON.parse(socket_data);
      // const {user_name, phone, email_id, page_type, page_id, reference_type, reference_id, action='disconnect'} = parsedSocketData;

      // new code
      const parsedSocketData = JSON.parse(socket_data);

      const { user_name, phone, email_id, page_type, page_id, reference_type, reference_id } = parsedSocketData[0];

      // Set default or override action
      const action = 'Disconnect';

      // Create final payload object
      const userAnalyticsPayload = {
        user_data: { name: user_name, phone, emailID: email_id },
        page_type,
        page_id,
        reference_type,
        reference_id,
        action,
      };

      // handleEmitEvent(parsedSocketData, 'site-in-sleep-mode');
      // handleEmitEvent(userAnalyticsPayload, 'user-event');
      emitSocketEvent(userAnalyticsPayload);
    } else if (documentVisibility === 'visible') {
      let socket_data: any = localStorage.getItem('socket_data');
      // let parsedSocketData = JSON.parse(socket_data);
      // handleEmitEvent(parsedSocketData, 'site-occupied');

      const parsedSocketData = JSON.parse(socket_data);

      const { user_name, phone, email_id, page_type, page_id, reference_type, reference_id } = parsedSocketData[0];

      // Set default or override action
      const action = 'Page View';

      // Create final payload object
      const userAnalyticsPayload = {
        user_data: { name: user_name, phone, emailID: email_id },
        page_type,
        page_id,
        reference_type,
        reference_id,
        action,
      };

      // handleEmitEvent(parsedSocketData, 'site-in-sleep-mode');
      // handleEmitEvent(userAnalyticsPayload, 'user-event');
      emitSocketEvent(userAnalyticsPayload);
    }
  };

  const handleEmitEvent = (socketData: any, eventName: string) => {
    if (socketData?.length > 0) {
      clientSocketInstance.emit(eventName, {
        uid: socketData[0]?.uid,
      });
    }
  };
  return { userEventRegistered, handleVisibilityChange };
};
