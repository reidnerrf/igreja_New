import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Onboarding } from './components/Onboarding';
import { LoginScreen } from './components/LoginScreen';
import { ChurchDashboard } from './components/ChurchDashboardComplete';
import { UserDashboard } from './components/UserDashboardComplete';

type AppState = 'onboarding' | 'login' | 'dashboard';
type UserType = 'church' | 'user' | null;

export default function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userType, setUserType] = useState<UserType>(null);

  const handleOnboardingComplete = (selectedUserType: 'church' | 'user') => {
    setUserType(selectedUserType);
    setAppState('login');
  };

  const handleLogin = () => {
    setAppState('dashboard');
  };

  const handleBackToOnboarding = () => {
    setAppState('onboarding');
    setUserType(null);
  };

  const handleLogout = () => {
    setAppState('onboarding');
    setUserType(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {appState === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {appState === 'login' && userType && (
          <LoginScreen
            userType={userType}
            onLogin={handleLogin}
            onBack={handleBackToOnboarding}
          />
        )}
        
        {appState === 'dashboard' && userType === 'church' && (
          <ChurchDashboard onLogout={handleLogout} />
        )}
        
        {appState === 'dashboard' && userType === 'user' && (
          <UserDashboard onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  );
}