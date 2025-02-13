import { useRouter } from 'next/router';
import SocketPageMapper from '../../utils/socket-page-type-mapping';
const useGetPageURLData = () => {
  const router = useRouter();
  let page_category: any;

  // From /catalog/winter?page=1, router.route.split('/)[1] will return catalog
  const base_page = router.route.split('/')[1];

  // Below line return query value from URL. For ex - /catalog/[category]?page=1
  if (base_page === 'product-category' || base_page === 'catalog') {
    page_category = router.query?.category ? router.query?.category : '';
  } else if (base_page === 'product') {
    page_category = router.query?.productId ? router.query?.productId : '';
  } else if (base_page === 'cart') {
    page_category = 'cart';
  }

  // Below line will return page_type mapped with url
  // For ex - in case of /catalog below fn will return Catalog. For /product-category/[category_name] will return Category
  const pageTypeData = SocketPageMapper(base_page);
  return { router, base_page, page_category, pageTypeData };
};
export default useGetPageURLData;
