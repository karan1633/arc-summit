import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import fetchProductDetailData from '../../services/api/product-detail-page-apis/get-product-detail';
import fetchProductVariant from '../../services/api/product-detail-page-apis/get-product-variants';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import useHandleStateUpdate from '../GeneralHooks/handle-state-update-hook';
import { CONSTANTS } from '../../services/config/app-config';
import { selectPrevPage } from '../../store/slices/reference-tracking-slices/prev-page-slice';

const useProductDetail = () => {
  const { query } = useRouter();
  const { isLoading, setIsLoading, errorMessage, setErrMessage }: any = useHandleStateUpdate();
  const { SUMMIT_APP_CONFIG }: any = CONSTANTS;
  // const currency_state_from_redux: any = useSelector(currency_selector_state);
  const TokenFromStore: any = useSelector(get_access_token);
  const prevPage: any = useSelector(selectPrevPage);

  const [productDetailData, setProductDetailData] = useState({});
  // Set if product detail data is variant that has opened. If Variant then check what's its template and set it.
  const [variantOf, setVariantOf] = useState<string>('');
  const [productVariantData, setProductVariantData] = useState([]);
  const [variantLoading, setVariantLoading] = useState<boolean>(false);

  const fetchProductDetailDataAPI = async () => {
    const requestParams = {
      item: query?.productId,
      slug: query?.productId,
      currency: 'INR',
    };
    const params = new URLSearchParams(window.location.search);
    const prevPageType = params.get('ref');
    const prevPageID = params.get('refID');
    if (prevPageType && prevPageID) {
      sessionStorage.setItem(
        'summit_page_data',
        JSON.stringify({ reference_type: prevPageType, reference_id: prevPageID, page_type: 'Product', page_id: requestParams.slug })
      );
    }
    setIsLoading(true);
    try {
      const productDetailAPI: any = await fetchProductDetailData(SUMMIT_APP_CONFIG, requestParams, TokenFromStore?.token);
      if (productDetailAPI?.status === 200 && productDetailAPI?.data?.message?.msg === 'Success') {
        setProductDetailData(productDetailAPI?.data?.message?.data);
        if (productDetailAPI?.data?.message?.data?.variant_of) {
          setVariantOf(productDetailAPI?.data?.message?.data?.variant_of);

          if (productDetailAPI?.data?.message?.data?.variant_of) {
            fetchProductVariantDataAPI(productDetailAPI?.data?.message?.data?.variant_of);
          }
        } else {
          setProductVariantData([]);
        }
      } else {
        setProductDetailData({});
        setErrMessage(productDetailAPI?.data?.message?.data?.error);
      }
    } catch (error) {
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const fetchProductVariantDataAPI = async (templateName: string) => {
    setVariantLoading(true);
    try {
      const productVariantAPI: any = await fetchProductVariant(SUMMIT_APP_CONFIG, templateName, TokenFromStore?.token);
      if (productVariantAPI?.status === 200 && productVariantAPI?.data?.message?.msg === 'success') {
        setProductVariantData(productVariantAPI?.data?.message?.data);
      } else {
        setProductVariantData([]);
        setErrMessage(productVariantAPI);
      }
    } catch (error) {
      return;
    } finally {
      setVariantLoading(false);
    }
  };
  useEffect(() => {
    fetchProductDetailDataAPI();
  }, [query?.productId]);
  return {
    isLoading,
    errorMessage,
    productDetailData,
    productVariantData,
    fetchProductDetailDataAPI,
    variantLoading,
  };
};

export default useProductDetail;
