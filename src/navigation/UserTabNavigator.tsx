import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

import { UserDashboardScreen } from '../screens/user/UserDashboardScreen';
import { UserMapScreen } from '../screens/user/UserMapScreen';
import { UserEventsScreen } from '../screens/user/UserEventsScreen';
import { UserTransmissionsScreen } from '../screens/user/UserTransmissionsScreen';
import { UserMoreScreen } from '../screens/user/UserMoreScreen';

const Tab = createBottomTabNavigator();

interface UserTabNavigatorProps {
  onLogout: () => void;
}

export function UserTabNavigator({ onLogout }: UserTabNavigatorProps) {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Eventos':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Lives':
              iconName = focused ? 'radio' : 'radio-outline';
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
      <Tab.Screen name="Home" component={UserDashboardScreen} />
      <Tab.Screen name="Mapa" component={UserMapScreen} />
      <Tab.Screen name="Eventos" component={UserEventsScreen} />
      <Tab.Screen name="Lives" component={UserTransmissionsScreen} />
      <Tab.Screen name="Mais" children={() => <UserMoreScreen onLogout={onLogout} />} />
    </Tab.Navigator>
  );
}