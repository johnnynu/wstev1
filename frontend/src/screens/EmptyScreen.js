import React from 'react';
import { View, Text } from 'react-native';
import { handleLogout } from '../components/handleLogout';
import { useEffect } from 'react';
import { auth } from '../components/firebase';

const EmptyScreen = () => {
    useEffect(() => {
        const handleLogout = async () => {
          await auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        };
        handleLogout();
      }, []);
    
      return null;
    };

export default EmptyScreen;
