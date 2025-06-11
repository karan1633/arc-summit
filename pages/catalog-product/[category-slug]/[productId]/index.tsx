import { useEffect } from 'react';
import MetaTag from '../../../../services/api/general-apis/meta-tag-api';
import { CONSTANTS } from '../../../../services/config/app-config';
import { useHandleClientInteractivity } from '../../../../hooks/SocketHooks/useHandleClientInteractivity';
import ProductDetailMaster from '../../../../components/ProductDetailComponents/ProductDetailMaster';
import { userMovingForward } from '../../../../utils/socket-functions';

const Index = ({ metaData }: any) => {
  const { userEventRegistered, handleVisibilityChange } = useHandleClientInteractivity();
  const socketData = localStorage.getItem('socket_data');

  useEffect(() => {
    userEventRegistered();
  }, []);

  useEffect(() => {
    function handleClientVisibility(documentVisibility: any) {
      handleVisibilityChange(documentVisibility);
    }
    async function handleSocketEvents(socketData: any) {
      if (socketData) {
        await userMovingForward(JSON.parse(socketData)); // Wait for server acknowledgment
      }
    }
    handleSocketEvents(socketData);
    document.addEventListener('visibilitychange', () => handleClientVisibility(document.visibilityState));
    document.addEventListener('popState', () => handleClientVisibility(document.visibilityState));
    return () => {
      // window.removeEventListener('beforeunload', () => handleSiteInSleepMode(name));
      document.removeEventListener('visibilitychange', handleClientVisibility);
    };
  }, []);
  return (
    <div>
      <ProductDetailMaster />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { SUMMIT_APP_CONFIG } = CONSTANTS;
  const method = 'get_meta_tags';
  const version = SUMMIT_APP_CONFIG.version;
  const entity = 'seo';
  const params = `?version=${version}&method=${method}&entity=${entity}`;
  const url = `${context.resolvedUrl.split('?')[0]}`;
  if (CONSTANTS.ENABLE_META_TAGS) {
    let meta_data: any = await MetaTag(`${CONSTANTS.API_BASE_URL}${SUMMIT_APP_CONFIG.app_name}${params}&page_name=${url}`);

    if (meta_data !== null && Object.keys(meta_data).length > 0) {
      const metaData = meta_data?.data?.message?.data;
      return { props: { metaData } };
    } else {
      return { props: {} };
    }
  } else {
    return { props: {} };
  }
}
export default Index;
