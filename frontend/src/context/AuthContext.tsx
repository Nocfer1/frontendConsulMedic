import React, { createContext, useState, useContext, useEffect } from 'react';
import API_BASE from '../apiConfig';


interface User {
    [key: string]: any;
}

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; message?: string; requireLogin?: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                console.log('POST a:', `${API_BASE}/auth/register`);

                const response = await fetch(`${API_BASE}/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el perfil del usuario');
                }

                const user = await response.json();
                console.log('✅ Perfil cargado:', user);


                // Guardar en estado y localStorage
                setCurrentUser(user);
                localStorage.setItem('userData', JSON.stringify(user));
            } catch (error) {
                console.error('❌ Error al cargar perfil:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: email,
                    contrasenia: password
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Error al iniciar sesión');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);

            // Llamar a /user/profile
            const profileRes = await fetch(`${API_BASE}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });

            if (!profileRes.ok) throw new Error('No se pudo cargar el perfil');

            const profileData = await profileRes.json();

            // Guardar perfil
            setCurrentUser(profileData);
            localStorage.setItem('userData', JSON.stringify(profileData));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };


    const register = async (userData) => {
        try {
            console.log('📦 Enviando datos de registro:', userData);
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`❌ Error ${response.status} ${response.statusText}:`, text);
                throw new Error(`(${response.status}) ${text || 'Error al registrarse'}`);
            }



            // Verificar si la respuesta es JSON o texto
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                // Si la respuesta no es JSON, usamos texto y creamos un objeto
                const text = await response.text();
                console.log('Respuesta del servidor:', text);

                // Si el registro fue exitoso pero no hay token, redirigimos a login
                return { success: true, message: text, requireLogin: true };
            }

            // Si hay token, lo guardamos
            if (data?.token) {
                localStorage.setItem('token', data.token);

                // Como no hay endpoint de perfil, creamos datos básicos del usuario
                const basicUserData = {
                    nombre: userData.nombre,
                    correo: userData.correo,
                    especialidad: userData.especialidad,
                    isAuthenticated: true
                };

                // Guardar datos del usuario en localStorage
                localStorage.setItem('userData', JSON.stringify(basicUserData));
                setCurrentUser(basicUserData);
                return { success: true };
            }

            return { success: true, requireLogin: true };
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
