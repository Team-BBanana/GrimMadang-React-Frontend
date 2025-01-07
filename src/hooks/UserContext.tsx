import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface DecodedToken {
    userId: string;
    role: string;
    exp: number;
}

const getTokenRole = (): string => {
    const token = Cookies.get('token');
    if (!token) return 'ROLE_FAMILY';
    
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.role;
    } catch {
        return 'ROLE_ELDER';
    }
};

export const useUserRole = () => {
    const [userRole, setUserRole] = useState<string>(getTokenRole());

    useEffect(() => {
        setUserRole(getTokenRole());
    }, []);

    return { userRole, setUserRole };
};