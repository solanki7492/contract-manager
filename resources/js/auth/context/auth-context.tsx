import { createContext, useContext, ReactNode } from 'react';
import { router } from '@inertiajs/react';

export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    fullname?: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    pic?: string;
}

interface AuthContextType {
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const logout = () => {
        router.post('/logout');
    };

    return (
        <AuthContext.Provider value={{ logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
