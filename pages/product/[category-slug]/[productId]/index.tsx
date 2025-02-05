import { useRouter } from 'next/router';
import ProductDetailMaster from '../../../../components/ProductDetailComponents/ProductDetailMaster';
import MetaTag from '../../../../services/api/general-apis/meta-tag-api';
import { CONSTANTS } from '../../../../services/config/app-config';
import { returnLastPageViewedData, setRecentPageData } from '../../../../utils/get-last-page-viewed-data';
import { useEffect } from 'react';
import { pageViewTracker } from '../../../../utils/socket-functions';

const Index = ({ metaData }: any) => {
  const { query }: any = useRouter();

  const getLastViewedPage = returnLastPageViewedData();
  setRecentPageData('Product Page', query.productId);

  const userName = localStorage.getItem('party_name');

  useEffect(() => {
    const userObj = {
      name: userName,
      phone: '',
    };
    pageViewTracker(
      'Product Page',
      query?.productId,
      'Page View',
      getLastViewedPage?.reference_type,
      getLastViewedPage?.reference_id,
      userObj
    );
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
