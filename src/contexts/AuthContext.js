import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
        setUser({ isLoggedIn: true }); // Simplified user object on load
    }
    }, []);

  const login = async (email,password) => {
    try {

        const response = await axios.post(
            'http://127.0.0.1:8000/login', // Replace with your backend URL
            {"email":email,"password":password}
          );
        
        //headers: {
        //    Authorization: `Bearer ${token}`,
        //  }
        
        //console.log(response.data)
        // Assuming your backend returns a JWT token in response.data.token
        localStorage.setItem('userToken', response.data.token);

    
        localStorage.setItem('userdata', JSON.stringify(response.data.user));

        // For this example, we just set a mock user object
        setUser(response.data.userDetails || { isLoggedIn: true, email }); 

    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw so your Login page can handle errors
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);    
    alert("You have signed out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
