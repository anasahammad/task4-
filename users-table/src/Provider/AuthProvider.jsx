import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext(null)
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const token = localStorage.getItem('token')

        if(token){
            const decoded = jwtDecode(token)
            setUser({name: decoded.name, email: decoded.email, password: decoded.password})
            setLoading(false)
        } else{
            setUser(null)
        }
    }, [])

    const authInfo = {user, setUser, loading}
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;