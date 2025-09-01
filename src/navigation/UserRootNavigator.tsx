import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { UserTabNavigator } from './UserTabNavigator';
import { MyPrayersScreen } from '../screens/user/MyPrayersScreen';
import { DonationHistoryScreen } from '../screens/user/DonationHistoryScreen';
import { MyRafflesScreen } from '../screens/user/MyRafflesScreen';
import { MyPostsScreen } from '../screens/user/MyPostsScreen';
import { UserProfileScreen } from '../screens/user/UserProfileScreen';
import { PrivacySettingsScreen } from '../screens/user/PrivacySettingsScreen';
import { CommunityChatScreen } from '../screens/user/CommunityChatScreen';
import { QRCheckinScreen } from '../screens/user/QRCheckinScreen';
import { NotificationsInboxScreen } from '../screens/user/NotificationsInboxScreen';
import { WidgetsCenterScreen } from '../screens/user/WidgetsCenterScreen';

const Stack = createStackNavigator();

interface UserRootNavigatorProps {
  onLogout: () => void;
}

export function UserRootNavigator({ onLogout }: UserRootNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs">
        {() => <UserTabNavigator onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="MyPrayers" component={MyPrayersScreen} />
      <Stack.Screen name="DonationHistory" component={DonationHistoryScreen} />
      <Stack.Screen name="MyRaffles" component={MyRafflesScreen} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="CommunityChat" component={CommunityChatScreen} />
      <Stack.Screen name="QRCheckin" component={QRCheckinScreen} />
      <Stack.Screen name="NotificationsInbox" component={NotificationsInboxScreen} />
      <Stack.Screen name="WidgetsCenter" component={WidgetsCenterScreen} />
    </Stack.Navigator>
  );
}

