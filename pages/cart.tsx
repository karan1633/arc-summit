import React, { useEffect } from 'react';
import { CONSTANTS } from '../services/config/app-config';
import CartListing from '../components/Cart/CartListing';
import MetaTag from '../services/api/general-apis/meta-tag-api';
import { useHandleClientInteractivity } from '../hooks/SocketHooks/useHandleClientInteractivity';
import { returnLastPageViewedData, setRecentPageData } from '../utils/get-last-page-viewed-data';
import { emitSocketEvent } from '../utils/http-methods';

const Cart = () => {
  const { userEventRegistered, handleVisibilityChange } = useHandleClientInteractivity();

  const getLastViewedPage = returnLastPageViewedData();
  setRecentPageData('Cart', 'cart');

  const userName = localStorage.getItem('party_name');

  useEffect(() => {
    const userObj = {
      name: userName,
      phone: '',
    };
    const eventData = {
      page_type: 'Cart',
      page_id: 'cart',
      action: 'Page View',
      reference_type: getLastViewedPage?.reference_type,
      reference_id: getLastViewedPage?.reference_id,
      user_data: userObj,
      is_active: true,
    };
    emitSocketEvent(eventData);
    userEventRegistered();
  }, []);
  return (
    <>
      <CartListing />
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

export default Cart;
