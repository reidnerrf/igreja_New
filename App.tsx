import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { useOfflineSync } from './src/hooks/useOfflineSync';
import { ChurchRootNavigator } from './src/navigation/ChurchRootNavigator';
import { UserRootNavigator } from './src/navigation/UserRootNavigator';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

const Stack = createStackNavigator();

export default function App() {
  useOfflineSync();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'church' | 'user' | null>(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboarding_complete');
      const authToken = await AsyncStorage.getItem('auth_token');
      const savedUserType = await AsyncStorage.getItem('user_type');

      setHasCompletedOnboarding(!!onboardingComplete);
      setIsAuthenticated(!!authToken);
      setUserType(savedUserType as 'church' | 'user' | null);
    } catch (error) {
      console.error('Error checking app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setHasCompletedOnboarding(true);
  };

  const handleLogin = async (type: 'church' | 'user') => {
    // Do not overwrite token set by social login; just persist the user type
    await AsyncStorage.setItem('user_type', type);
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_type']);
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {!hasCompletedOnboarding ? (
                <Stack.Screen name="Onboarding">
                  {() => <OnboardingScreen onComplete={handleOnboardingComplete} />}
                </Stack.Screen>
              ) : !isAuthenticated ? (
                <Stack.Screen name="Login">
                  {() => <LoginScreen onLogin={handleLogin} />}
                </Stack.Screen>
              ) : userType === 'church' ? (
                <Stack.Screen name="ChurchApp">
                  {() => <ChurchRootNavigator onLogout={handleLogout} />}
                </Stack.Screen>
              ) : (
                <Stack.Screen name="UserApp">
                  {() => <UserRootNavigator onLogout={handleLogout} />}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}