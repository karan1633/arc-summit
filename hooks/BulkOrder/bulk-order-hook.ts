import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { callGetAPI } from '../../utils/http-methods';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { CONSTANTS } from '../../services/config/app-config';
import useBunchOrder from './bunch-order-hook';
import useCustomMarketOrder from './custom-market-order-hook';
import useMarketOrder from './market-order-hook';
import { PostBulkQuotationAPI } from '../../services/api/bulk-order-page-apis/create-bulk-quotation-api';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import fetchCustomerNameAPI from '../../services/api/general-apis/customer-name-api';

const useBulkOrder = () => {
  const { ARC_APP_CONFIG }: any = CONSTANTS;
  const router = useRouter();
  const [customerId, setCustomerId] = useState([]);

  let users: any = localStorage.getItem('user');
  let validUser: any = localStorage.getItem('user');
  validUser = validUser.replace(/^"(.*)"$/, '$1');

  let login: any = localStorage.getItem('token');
  const TokenFromStore: any = useSelector(get_access_token);

  const initialQty = () => Array.from({ length: 23 }, () => ({ qty: '', size: '' }));

  const initialFormData = {
    purity: '',
    transaction_date: '',
    delivery_date: '',
    description: '',
    customer: '',
    company: '',
    currency: '',
    marketOrderDetails: [
      {
        item_code: '',
        description: '',
        uom: '',
        qty: initialQty(),
      },
    ],
    customMarketOrderDetails: [
      {
        item_code: '',
        qty: [{ qty: '', size: '' }],
        description: '',
        uom: '',
      },
    ],
    bunchOrderDetails: [
      {
        item_code: '',
        qty: [{ qty: '', size: '' }],
        description: '',
        uom: '',
        bunch_weight: '',
        weight_per_unit: '',
        estimate_bunch_weight: '',
        is_bunch: '',
      },
    ],
  };

  const [formData, setFormData] = useState<any>(initialFormData);
  const [purityValues, setPurityValues] = useState([]);
  const [refCodesList, setRefCodesList] = useState<any>([]);
  const { errMsgMarketOrder, addMarketOrderRow, deleteMarketOrderRow, handleChangeMarketOrder } = useMarketOrder(formData, setFormData);
  const { errMsgCustomOrder, addCustomMarketOrderRow, deleteCustomMarketOrderRow, handleChangeCustomOrder } = useCustomMarketOrder(
    formData,
    setFormData
  );
  const { errMsgBuchOrder, addBunchOrderRow, deleteBunchOrderRow, handleChangeBunchOrder, isBunchWeightDisabled, fetchItemDetails } =
    useBunchOrder(formData, setFormData);

  // Function to handle changes in input fields
  const handleChange = (e: any) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  // Fuction to fetch purity values
  const getPurityValues = async () => {
    const url = `${CONSTANTS.API_BASE_URL}/api/resource/Purity`;
    const fetchValues = await callGetAPI(url, TokenFromStore.token);
    return fetchValues;
  };
  const fetchPurityValues = async () => {
    const values = await getPurityValues();
    setPurityValues(values?.data?.data);
  };
  // Function to fetch design name values
  const getRefCodeList = async () => {
    const params = `Customer Item Reference Code?fields=["name","item_code","customer_name","reference_code"]&customer_name=&limit=none`;
    const url = `${CONSTANTS.API_BASE_URL}/api/resource/${params}`;
    const fetchValues = await callGetAPI(url, TokenFromStore.token);
    return fetchValues;
  };
  const fetchRefCodeValues = async () => {
    const values = await getRefCodeList();
    setRefCodesList(values?.data?.data);
  };

  const getCustomer: any = async () => {
    try {
      let customerNameData: any = await fetchCustomerNameAPI(ARC_APP_CONFIG, TokenFromStore.token, users);

      if (customerNameData?.data?.message?.msg === 'success') {
        setCustomerId(customerNameData?.data?.message?.data);
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    fetchPurityValues();
    fetchRefCodeValues();
    getCustomer();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    // Update formData.transaction_date with today's date
    handleChange({
      target: {
        name: 'transaction_date',
        value: todayString,
      },
    });
  }, []);

  // Function to calculate delivery date
  const calculateDeliveryDate = (transactionDate: string) => {
    const date = new Date(transactionDate);
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  };

  // Update delivery date on transaction date change
  useEffect(() => {
    if (formData.transaction_date) {
      const deliveryDate = calculateDeliveryDate(formData.transaction_date);
      setFormData((prev: any) => ({
        ...prev,
        delivery_date: deliveryDate,
      }));
    }
  }, [formData.transaction_date]);
  const handleSaveBtn = async () => {
    try {
      const mappedMarketItems = formData.marketOrderDetails
        .map((item: any) => ({
          item_code: item.item_code,
          qty: item.qty.filter(
            (q: any) => q.qty !== '' && q.qty !== null && q.qty !== undefined && q.size !== '' && q.size !== null && q.size !== undefined
          ),
          description: item.description,
          uom: formData?.purity,
        }))
        .filter((item: any) => item.qty.length > 0);
      const mappedCustomItems = formData.customMarketOrderDetails
        .map((item: any) => ({
          item_code: item.item_code,
          qty: item.qty.filter(
            (q: any) => q.qty !== '' && q.qty !== null && q.qty !== undefined && q.size !== '' && q.size !== null && q.size !== undefined
          ),
          description: item.description,
          uom: formData?.purity,
        }))
        .filter((item: any) => item.qty.length > 0);
      const mappedBunchItems = formData.bunchOrderDetails
        .map((item: any) => ({
          item_code: item.item_code,
          qty: item.qty.filter(
            (q: any) => q.qty !== '' && q.qty !== null && q.qty !== undefined && q.size !== '' && q.size !== null && q.size !== undefined
          ),

          description: item.description,
          uom: formData?.purity,
          weight_per_unit: item.weight_per_unit,
          per_unit_weight: item.weight_per_unit,
          estimate_bunch_weight: item.estimate_bunch_weight,
          is_bunch: item.is_bunch,
          bunch_weight: parseInt(item.bunch_weight), //bunch weight
        }))
        .filter((item: any) => item.qty.length > 0);

      // Combine all items
      const mergedItems = [...mappedMarketItems, ...mappedCustomItems, ...mappedBunchItems];

      // Filter items to remove those without qty
      const filteredItems = mergedItems.filter((item) => {
        return item.qty !== '' && item.qty !== null && item.qty !== undefined;
      });

      // Construct final mappedItemsAllArray
      const mappedItemsAllArray = filteredItems.flatMap((item: any) => {
        const { qty, ...rest } = item;
        return qty.map((q: any) => ({
          item_code: rest.item_code,
          qty_size: [
            {
              qty: q.qty,
              size: q.size,
              estimate_bunch_weight: rest.estimate_bunch_weight,
              per_unit_weight: rest.weight_per_unit,
              is_bunch: rest.is_bunch,
            },
          ],
          description: rest.description,
          uom: rest.uom || formData.purity,

          weight_per_unit: '',
          estimate_bunch_weight: rest.estimate_bunch_weight,
          is_bunch: rest.is_bunch,
          bunch_weight: rest.bunch_weight,
        }));
      });

      const data: any = {
        cust_name: formData?.customer,
        purity: formData?.purity,
        transaction_date: formData?.transaction_date,
        company: 'ARC',
        contact_email: users,
        conversion_rate: '',
        currency: 'INR',
        customer: customerId,
        customer_group: '',
        customer_name: customerId,
        delivery_date: formData?.delivery_date,
        description: formData?.description,
        order_type: 'Shopping Cart',
        party_name: customerId,
        plc_conversion_rate: '',
        price_list_currency: 'INR',
        selling_price_list: 'Standard Selling',
        territory: '',
        user: users,
        items: mappedItemsAllArray,
      };

      const postBulkQuotation = await PostBulkQuotationAPI(ARC_APP_CONFIG, data, TokenFromStore?.token); // Call PostCartAPI

      if (postBulkQuotation?.data?.message?.msg === 'success') {
        toast.success(postBulkQuotation?.data.message?.data?.message);
        router.push('/cart');
      } else {
        toast.error(postBulkQuotation?.data.message?.error);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return {
    formData,
    handleChange,
    purityValues,
    addMarketOrderRow,
    deleteMarketOrderRow,
    errMsgMarketOrder,
    handleChangeMarketOrder,
    refCodesList,
    errMsgCustomOrder,
    addCustomMarketOrderRow,
    deleteCustomMarketOrderRow,
    handleChangeCustomOrder,
    errMsgBuchOrder,
    addBunchOrderRow,
    deleteBunchOrderRow,
    handleChangeBunchOrder,
    isBunchWeightDisabled,
    handleSaveBtn,
    fetchItemDetails,
  };
};

export default useBulkOrder;
