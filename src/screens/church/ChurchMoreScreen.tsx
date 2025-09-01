import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumModal } from '../../components/modals/PremiumModal';
import { useNavigation } from '@react-navigation/native';

interface ChurchMoreScreenProps {
  onLogout: () => void;
}

export function ChurchMoreScreen({ onLogout }: ChurchMoreScreenProps) {
  const { colors, theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const menuSections = [
    {
      title: 'Gestão',
      items: [
        { id: 'prayers', title: 'Pedidos de Oração', icon: 'heart', premium: false },
        { id: 'announcements', title: 'Avisos e Notícias', icon: 'megaphone', premium: false },
        { id: 'feed', title: 'Feed da Igreja', icon: 'camera', premium: false },
        { id: 'chat', title: 'Mural Comunitário', icon: 'chatbubbles', premium: false },
        { id: 'members', title: 'Gestão de Membros', icon: 'people', premium: true },
        { id: 'reports', title: 'Relatórios', icon: 'bar-chart', premium: true },
        { id: 'raffles', title: 'Rifas e Campanhas', icon: 'gift', premium: true },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'profile', title: 'Dados da Igreja', icon: 'business', premium: false },
        { id: 'payment', title: 'Formas de Pagamento', icon: 'card', premium: false },
        { id: 'notifications', title: 'Notificações', icon: 'notifications', premium: false },
        { id: 'theme', title: 'Tema', icon: 'color-palette', premium: false },
      ]
    },
    {
      title: 'Suporte',
      items: [
        { id: 'help', title: 'Central de Ajuda', icon: 'help-circle', premium: false },
        { id: 'contact', title: 'Fale Conosco', icon: 'mail', premium: false },
        { id: 'about', title: 'Sobre o App', icon: 'information-circle', premium: false },
      ]
    }
  ];

  const handleMenuPress = (itemId: string, isPremium: boolean) => {
    if (isPremium && !user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    switch (itemId) {
      case 'theme':
        // Toggle theme será tratado no componente
        break;
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'prayers':
        navigation.navigate('ChurchPrayers');
        break;
      case 'announcements':
        navigation.navigate('ChurchAnnouncements');
        break;
      case 'feed':
        navigation.navigate('ChurchFeed');
        break;
      case 'chat':
        navigation.navigate('ChurchChat');
        break;
      case 'raffles':
        navigation.navigate('ChurchRaffles');
        break;
      case 'payment':
        navigation.navigate('ChurchPayments');
        break;
      default:
        Alert.alert('Em Desenvolvimento', `Funcionalidade "${itemId}" será implementada em breve`);
    }
  };

  const handlePremiumUpgrade = () => {
    setShowPremiumModal(false);
    Alert.alert(
      'Upgrade Premium',
      'Redirecionando para pagamento...',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    profileIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 4,
    },
    profileType: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    premiumButton: {
      backgroundColor: `linear-gradient(135deg, ${colors.gold}, ${colors.primary})`,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    premiumButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItemPremium: {
      opacity: 0.6,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.foreground,
    },
    menuArrow: {
      marginLeft: 8,
    },
    premiumIndicator: {
      backgroundColor: colors.gold + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    premiumIndicatorText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.gold,
    },
    themeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoutButton: {
      backgroundColor: colors.destructive + '20',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    logoutText: {
      color: colors.destructive,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Menu</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="business" size={40} color={colors.primaryForeground} />
          </View>
          <Text style={styles.profileName}>{user?.name || 'Igreja'}</Text>
          <Text style={styles.profileType}>Administrador da Igreja</Text>
          
          {!user?.isPremium && (
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Ionicons name="diamond" size={16} color="white" />
              <Text style={styles.premiumButtonText}>Upgrade Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  item.premium && !user?.isPremium && styles.menuItemPremium
                ]}
                onPress={() => handleMenuPress(item.id, item.premium)}
              >
                <View style={styles.menuIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                
                <View style={styles.menuContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.premium && (
                      <View style={styles.premiumIndicator}>
                        <Text style={styles.premiumIndicatorText}>PRO</Text>
                      </View>
                    )}
                  </View>
                </View>

                {item.id === 'theme' ? (
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    trackColor={{ false: colors.muted, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                ) : item.id === 'notifications' ? (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: colors.muted, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                ) : (
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.mutedForeground}
                    style={styles.menuArrow}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out" size={20} color={colors.destructive} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        userType="church"
        onUpgrade={handlePremiumUpgrade}
      />
    </SafeAreaView>
  );
}