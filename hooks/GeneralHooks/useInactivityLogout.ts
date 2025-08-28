'use client';
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { resetStore } from '../../store/slices/auth/logout-slice';
import { useDispatch, useSelector } from 'react-redux';
import logoutUser from '../../services/api/auth/logout-api';
import { get_access_token } from '../../store/slices/auth/token-login-slice';
const INACTIVITY_LIMIT = 60 * 60 * 1000 // 1 hour in ms
// const INACTIVITY_LIMIT = 60 * 1000     // 1 min
const useInactivityLogout = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const TokenFromStore: any = useSelector(get_access_token);
    const handleLogoutUser = async () => {
        let logoutAPIResponse: any;
        try {
            logoutAPIResponse = await logoutUser(null, TokenFromStore?.token);
            if (logoutAPIResponse?.status === 200) {
                dispatch(resetStore());
                localStorage.clear();
                router.push('/login');
            }
        } catch (error) {
            console.log(error)
        }
    };
    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            handleLogoutUser()
        }, INACTIVITY_LIMIT)
    }
    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'click']
        events.forEach(event => window.addEventListener(event, resetTimer))
        resetTimer()
        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer))
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])
}
export default useInactivityLogout;