import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

import { ChurchDashboardScreen } from '../screens/church/ChurchDashboardScreen';
import { ChurchEventsScreen } from '../screens/church/ChurchEventsScreen';
import { ChurchTransmissionsScreen } from '../screens/church/ChurchTransmissionsScreen';
import { ChurchDonationsScreen } from '../screens/church/ChurchDonationsScreen';
import { ChurchMoreScreen } from '../screens/church/ChurchMoreScreen';

const Tab = createBottomTabNavigator();

interface ChurchTabNavigatorProps {
  onLogout: () => void;
}

export function ChurchTabNavigator({ onLogout }: ChurchTabNavigatorProps) {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Eventos':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Transmissões':
              iconName = focused ? 'radio' : 'radio-outline';
              break;
            case 'Doações':
              iconName = focused ? 'card' : 'card-outline';
              break;
            case 'Mais':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={ChurchDashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Eventos" 
        component={ChurchEventsScreen}
      />
      <Tab.Screen 
        name="Transmissões" 
        component={ChurchTransmissionsScreen}
        options={{ title: 'Lives' }}
      />
      <Tab.Screen 
        name="Doações" 
        component={ChurchDonationsScreen}
      />
      <Tab.Screen 
        name="Mais" 
        children={() => <ChurchMoreScreen onLogout={onLogout} />}
      />
    </Tab.Navigator>
  );
}