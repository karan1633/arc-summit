// import firebase, { initializeApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken } from 'firebase/messaging';
import { requestPermission } from 'firebase/messaging';

export const initializeFirebase = () => {
  const firebaseConfig = {
    messagingSenderId: '418835235707',
    projectId: 'test-web-push-a2336',
    apiKey: 'AIzaSyDN4CdmegnU636eD7peIPctuPhM4UtaIq8',
    appId: '1:418835235707:web:600b74e364068af64c73de',
    authDomain: 'test-web-push-a2336.firebaseapp.com',
    storageBucket: 'test-web-push-a2336.appspot.com',
    measurementId: 'G-61W9QD50GF',
  };
  initializeApp(firebaseConfig);
};

export const askForPermissionToReceiveNotifications = async () => {
  try {
    const messaging = getMessaging();
    const currentToken = await getToken(messaging);

    // if (currentToken) {
    //   // Token exists, delete the token
    //   await deleteToken(messaging, currentToken);
    // }

    // const newToken = await getToken(messaging);

    return newToken;
  } catch (error) {
  }
};

// export const askForPermissionToReceiveNotifications = async () => {
//   try {
//     const messaging = getMessaging();
//     // await requestPermission();
//     const token = await getToken(messaging);
//     return token;
//   } catch (error) {
//   }
// };

// export const askForPermissionToReceiveNotifications = () =>
// {
//   const messaging = getMessaging();
//   getToken(messaging).then((currentToken) => {
//     if (currentToken) {
//       // Token exists, proceed with unsubscribe
//       deleteToken(messaging, currentToken)
//         .then(() => {

//           // Subscribe to a new token
//           getToken(messaging)
//             .then((newToken) => {
//               // Use the new token for sending notifications or other operations
//             })
//             .catch((error) => {
//             });
//         })
//         .catch((error) => {
//         });
//     } else {
//     }
//   }).catch((error) => {
//   });
// }
