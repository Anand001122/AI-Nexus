import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAPI } from '../hooks/useAPI';

export const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);
    const { getMe } = useAPI();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            const finalizeLogin = async () => {
                try {
                    // Set token first so getMe can use it in the Authorization header
                    localStorage.setItem('auth-storage', JSON.stringify({
                        state: { token, isAuthenticated: true, user: null },
                        version: 0
                    }));

                    const userResponse = await getMe();
                    setAuth(token, {
                        email: userResponse.email,
                        fullName: userResponse.fullName,
                        isPremium: userResponse.isPremium,
                        credits: userResponse.credits
                    });
                    navigate('/', { replace: true });
                } catch (err) {
                    console.error('Failed to finalize login:', err);
                    navigate('/auth', { replace: true });
                }
            };
            finalizeLogin();
        } else {
            navigate('/auth', { replace: true });
        }
    }, [searchParams, navigate, setAuth, getMe]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Finalizing secure login...</p>
            </div>
        </div>
    );
};
