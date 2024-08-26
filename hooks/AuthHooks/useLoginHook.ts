import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { TypeLoginAPIParams, TypeLoginForm } from '../../interfaces/login-params-interface';
import getTokenFromLoginAPI from '../../services/api/auth/get-token-from-login-api';
import { CONSTANTS } from '../../services/config/app-config';
import { storeToken } from '../../store/slices/auth/token-login-slice';

const useLoginHook = () => {
  const { SUMMIT_APP_CONFIG } = CONSTANTS;
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<TypeLoginForm>({ usr: '', pwd: '' });
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoginThroughOTP, setIsLoginThroughOTP] = useState<boolean>(false);
  const [isLoginThroughGoogle, setIsLoginThroughGoogle] = useState<boolean>(false);
  const togglePasswordIcon = (e: React.MouseEvent) => {
    e.preventDefault();
    setPasswordHidden(!passwordHidden);
  };

  const fetchToken = async (values: TypeLoginForm) => {
    const userParams: TypeLoginAPIParams = {
      values: { ...values },
      isGuest: false,
      loginViaOTP: false,
      LoginViaGoogle: false,
    };
    const tokenData = await getTokenFromLoginAPI(SUMMIT_APP_CONFIG, userParams);
    if (tokenData?.msg === 'success' && tokenData?.data?.hasOwnProperty('access_token')) {
      localStorage.setItem('isLoggedIn', 'true');
      dispatch(storeToken(tokenData?.data));
      localStorage.setItem('user', values.usr);
      localStorage.setItem('party_name', tokenData?.data?.full_name);
      router.push('/');
        toast.success('Login Successfully');
    } else {
      toast.error('Invalid Credentials. Please try again.');
    }
  };
  return { passwordHidden, togglePasswordIcon, fetchToken };
};

export default useLoginHook;
