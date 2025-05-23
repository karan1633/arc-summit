import { useRouter } from 'next/router';
import React from 'react'
import { openRoutes } from '../utils/open-routes';
import ProtectedRoute from './ProtectedRoute';
import { useSelector } from 'react-redux';
import { get_access_token } from '../store/slices/auth/token-login-slice';

interface PublicRoutesProps {
    children: React.ReactNode;
}

const Routes = ({children}:PublicRoutesProps) => {
    const TokenFromStore: any = useSelector(get_access_token);
    const isCatalogUser = localStorage.getItem('isCatalogUser');
    const router = useRouter();
    if (openRoutes.includes(router.pathname)  && !TokenFromStore.token && isCatalogUser  ) {
        return <>{children}</>
    }
    return <>{
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    }</>
}

export default Routes