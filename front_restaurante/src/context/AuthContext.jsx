import React, { createContext } from 'react';
import useAuthProvider from '../hooks/useAuthProvider';

const AuthContext = createContext();

export function AuthProvider(props) {
  const auth = useAuthProvider();
  const { children } = props;
  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
