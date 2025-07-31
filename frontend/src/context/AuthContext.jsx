import React, { createContext, useState, useContext, useEffect } from 'react';
import API_BASE from '../apiConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('userData');

                if (!token) {
                    setCurrentUser(null);
                    setLoading(false);
                    return;
                }

                // Verificamos la validez del token comprobando si es un JWT bien formado
                // Un JWT tiene 3 partes separadas por puntos
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                    console.error('Token malformado');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    setCurrentUser(null);
                    setLoading(false);
                    return;
                }

                // Si tenemos datos de usuario almacenados, los usamos
                if (userData) {
                    try {
                        const parsedUserData = JSON.parse(userData);
                        setCurrentUser(parsedUserData);
                        console.log('Usuario autenticado desde localStorage:', parsedUserData);
                        setLoading(false);
                        return;
                    } catch (e) {
                        console.error('Error al parsear datos de usuario:', e);
                    }
                }

                // Como no hay endpoint de perfil, marcamos como autenticado con datos básicos
                const basicUserData = { isAuthenticated: true };
                localStorage.setItem('userData', JSON.stringify(basicUserData));
                setCurrentUser(basicUserData);
                console.log('Usuario autenticado con datos básicos');
                setLoading(false);

                if (response.ok) {
                    const userData = await response.json();
                    setCurrentUser(userData);
                } else {
                    // Token inválido o expirado
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
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

            // Como no hay endpoint de perfil, creamos datos básicos del usuario
            const basicUserData = {
                correo: email,
                isAuthenticated: true
            };

            // Guardar datos del usuario en localStorage
            localStorage.setItem('userData', JSON.stringify(basicUserData));
            setCurrentUser(basicUserData);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Error al registrarse');
            }

            // Verificar si la respuesta es JSON o texto
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                // Si la respuesta no es JSON, usamos texto y creamos un objeto
                const text = await response.text();
                console.log('Respuesta del servidor:', text);

                // Si el registro fue exitoso pero no hay token, redirigimos a login
                return { success: true, message: text, requireLogin: true };
            }

            // Si hay token, lo guardamos
            if (data && data.token) {
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
