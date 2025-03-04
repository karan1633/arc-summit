import { clientSocketInstance } from '../../lib/sockets/clientSocketInstance';

export const useHandleClientInteractivity = () => {
  const userEventRegistered = () => {
    clientSocketInstance.on('user-register-success', (data: any) => {
      localStorage.setItem('socket_data', JSON.stringify(data));
    });
  };
  const handleVisibilityChange = (documentVisibility: any) => {
    if (documentVisibility === 'hidden') {
      let socket_data: any = localStorage.getItem('socket_data');
      let parsedSocketData = JSON.parse(socket_data);
      handleEmitEvent(parsedSocketData, 'site-in-sleep-mode');
    } else if (documentVisibility === 'visible') {
      let socket_data: any = localStorage.getItem('socket_data');
      let parsedSocketData = JSON.parse(socket_data);
      handleEmitEvent(parsedSocketData, 'site-occupied');
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
