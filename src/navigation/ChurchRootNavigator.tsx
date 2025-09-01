import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChurchTabNavigator } from './ChurchTabNavigator';
import { ChurchPrayersScreen } from '../screens/church/ChurchPrayersScreen';
import { ChurchAnnouncementsScreen } from '../screens/church/ChurchAnnouncementsScreen';
import { ChurchFeedScreen } from '../screens/church/ChurchFeedScreen';
import { ChurchChatScreen } from '../screens/church/ChurchChatScreen';
import { ChurchRafflesScreen } from '../screens/church/ChurchRafflesScreen';
import { ChurchPaymentsScreen } from '../screens/church/ChurchPaymentsScreen';

const Stack = createStackNavigator();

interface ChurchRootNavigatorProps {
  onLogout: () => void;
}

export function ChurchRootNavigator({ onLogout }: ChurchRootNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChurchTabs">
        {() => <ChurchTabNavigator onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="ChurchPrayers" component={ChurchPrayersScreen} />
      <Stack.Screen name="ChurchAnnouncements" component={ChurchAnnouncementsScreen} />
      <Stack.Screen name="ChurchFeed" component={ChurchFeedScreen} />
      <Stack.Screen name="ChurchChat" component={ChurchChatScreen} />
      <Stack.Screen name="ChurchRaffles" component={ChurchRafflesScreen} />
      <Stack.Screen name="ChurchPayments" component={ChurchPaymentsScreen} />
    </Stack.Navigator>
  );
}

