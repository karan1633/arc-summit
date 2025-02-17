import { useEffect } from 'react';
import { CONSTANTS } from '../../services/config/app-config';
import MetaTag from '../../services/api/general-apis/meta-tag-api';
import { useHandleClientInteractivity } from '../../hooks/SocketHooks/useHandleClientInteractivity';
import PageMetaData from '../../components/PageMetaData/PageMetaData';
import CatalogListingMaster from '../../components/CatalogListingComponents/CatalogListingMaster';
import { returnLastPageViewedData, setRecentPageData } from '../../utils/get-last-page-viewed-data';
import { emitSocketEvent } from '../../utils/http-methods';
import { userMovingForward } from '../../utils/socket-functions';

const Index = ({ metaData }: any) => {
  const { userEventRegistered, handleVisibilityChange } = useHandleClientInteractivity();

  const getLastViewedPage = returnLastPageViewedData();
  setRecentPageData('Catalogs List', 'catalog');

  const socketData = localStorage.getItem('socket_data');

  const userName = localStorage.getItem('party_name');
  const userEmailId = localStorage.getItem('user');

  useEffect(() => {
    const userObj = {
      name: userName,
      phone: '',
      emailID: userEmailId,
    };
    const eventData = {
      page_type: 'Catalogs List',
      page_id: 'catalog',
      action: 'Page View',
      reference_type: getLastViewedPage?.reference_type,
      reference_id: getLastViewedPage?.reference_id,
      user_data: userObj,
      is_active: true,
    }; // Async function to ensure proper order
    async function handleSocketEvents(socketData: any, eventData: any) {
      if (socketData) {
        await userMovingForward(JSON.parse(socketData)); // Wait for server acknowledgment
      }
      emitSocketEvent(eventData); // Now emit the event after completion
    }
    handleSocketEvents(socketData, eventData);
    userEventRegistered();
  }, []);

  useEffect(() => {
    function handleClientVisibility(documentVisibility: any) {
      handleVisibilityChange(documentVisibility);
    }
    document.addEventListener('visibilitychange', () => handleClientVisibility(document.visibilityState));
    return () => {
      // window.removeEventListener('beforeunload', () => handleSiteInSleepMode(name));
      document.removeEventListener('visibilitychange', handleClientVisibility);
    };
  }, [document.visibilityState]);
  return (
    <>
      {CONSTANTS.ENABLE_META_TAGS && <PageMetaData meta_data={metaData} />}
      <>
        <CatalogListingMaster />
      </>
    </>
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
