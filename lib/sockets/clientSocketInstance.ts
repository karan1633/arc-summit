import { io } from 'socket.io-client';
import { CONSTANTS } from '../../services/config/app-config';
export const clientSocketInstance = io(`${CONSTANTS.SOCKET_SITE_BASE_URL}`);
