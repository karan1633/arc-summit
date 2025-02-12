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
      clientSocketInstance.emit('site-in-sleep-mode', {
        uid: parsedSocketData[0]?.uid,
      });
    } else if (documentVisibility === 'visible') {
      let socket_data: any = localStorage.getItem('socket_data');
      let parsedSocketData = JSON.parse(socket_data);
      clientSocketInstance.emit('site-occupied', {
        uid: parsedSocketData[0]?.uid,
      });
    }
  };
  return { userEventRegistered, handleVisibilityChange };
};
