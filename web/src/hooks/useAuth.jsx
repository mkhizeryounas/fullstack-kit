import { useState, useEffect } from 'react';
import ls from '../utils/localstorage';
import axios from '../utils/axios';
import { toSlug } from '../utils/common';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = ls.get('user');
  const accessToken = user?.accessToken;
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const authenticate = async () => {
    if (!isAuthenticated) {
      return false;
    }
    let success = false;
    setIsLoading(true);
    try {
      await axios.get('/users/me');
      success = true;
    } catch (err) {
      console.log('Authenticate error', err);
      success = false;
    }
    setIsLoading(false);
    setIsAuthenticated(success);
    return success;
  };

  const logout = ({ returnTo = '/' }) => {
    ls.remove('user');
    window.location.href = returnTo;
  };

  const login = async ({ returnTo = '/', email, password, workspace }) => {
    const values = { email, password, workspace };
    setIsLoading(true);
    try {
      const { data: user } = await axios.post('/users/signin', values);
      ls.set({ key: 'user', data: user });
      setIsLoading(false);
      window.location.href = returnTo;
    } catch (err) {
      ls.remove('user');
      setIsLoading(false);
      throw err;
    }
  };

  const signup = async ({
    returnTo = '/',
    email,
    password,
    workspace,
    name,
  }) => {
    const values = {
      email,
      password,
      name,
      workspace: {
        name: workspace,
        identifier: toSlug(workspace),
      },
    };

    setIsLoading(true);

    try {
      await axios.post('/users/signup', values);
      setIsLoading(false);
      window.location.href = returnTo;
    } catch (err) {
      ls.remove('user');
      setIsLoading(false);
      throw err;
    }
  };

  const checkWorkspaceAvailability = async ({ name }) => {
    try {
      const identifier = toSlug(name);
      const { data } = await axios.get(
        `/users/workspace/availability?identifier=${identifier}`
      );
      console.log('data', data);
      return data.available;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    authenticate();
    // eslint-disable-next-line
  }, []);

  return {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    logout,
    login,
    signup,
    checkWorkspaceAvailability,
  };
};

export default useAuth;
