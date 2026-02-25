import { useSelector } from 'react-redux';
import { CONSTANTS } from '../../services/config/app-config';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
import { PostSaveSSReview } from '../../services/api/product-detail-page-apis/saveSSReview';
import { toast } from 'react-toastify';
import { useState } from 'react';

const useSSReview = () => {
    const tokenFromStore: any = useSelector(get_access_token);
    const [loading, setLoading] = useState(false);

    const saveSsReview = async (ssReviewData: any) => {
        if (loading) return false;

        try {
            setLoading(true);

            const response = await PostSaveSSReview(
                CONSTANTS.ARC_APP_CONFIG,
                ssReviewData,
                tokenFromStore?.token
            );

            if (response?.status === 200 && response?.data?.message?.msg === 'success') {
                toast.success(response.data.message.data);
                return true;
            }

            toast.error(response?.data?.message?.error || 'Something went wrong');
            return false;

        } catch (err) {
            toast.error('Something went wrong');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { saveSsReview, loading };
};

export default useSSReview;