import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { CreateDonationModal } from '../../components/modals/CreateDonationModal';
import { useDonations } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export function ChurchDonationsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  
  const { data: donationsData, loading, error, refetch } = useDonations({ filter });
  const donations = donationsData || [];

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'Reforma da Igreja',
      description: 'Arrecadação para reforma do telhado',
      goal: 50000,
      raised: 23500,
      donors: 45,
      endDate: '2025-03-01',
      status: 'active'
    },
    {
      id: 2,
      title: 'Ação Social de Natal',
      description: 'Cestas básicas para famílias carentes',
      goal: 15000,
      raised: 15000,
      donors: 78,
      endDate: '2024-12-24',
      status: 'completed'
    }
  ]);

  const totalToday = donations
    .filter(d => new Date(d.date).toDateString() === new Date().toDateString())
    .reduce((sum, d) => sum + d.amount, 0);

  const totalMonth = donations
    .filter(d => {
      const donationDate = new Date(d.date);
      const now = new Date();
      return donationDate.getMonth() === now.getMonth() && 
             donationDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + d.amount, 0);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'pix': return 'phone-portrait';
      case 'card': return 'card';
      case 'cash': return 'cash';
      default: return 'wallet';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.destructive;
      default: return colors.mutedForeground;
    }
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
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    createButtonText: {
      color: colors.primaryForeground,
      fontWeight: '600',
      marginLeft: 8,
    },
    content: {
      flex: 1,
    },
    statsContainer: {
      padding: 20,
      paddingBottom: 0,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.muted,
      margin: 20,
      marginTop: 0,
      borderRadius: 8,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 6,
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
    },
    activeTabText: {
      color: colors.primaryForeground,
    },
    listContainer: {
      padding: 20,
      paddingTop: 0,
    },
    donationCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    donationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    donationAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.success,
    },
    donationStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    donationStatusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    donationDonor: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 4,
    },
    donationDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    donationMethod: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    donationMethodText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    donationDate: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    campaignCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    campaignHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    campaignTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      flex: 1,
      marginRight: 12,
    },
    campaignStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    campaignStatusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    campaignDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    progressContainer: {
      marginBottom: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
    },
    progressText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 8,
      textAlign: 'center',
    },
    campaignStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    campaignStat: {
      alignItems: 'center',
    },
    campaignStatValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    campaignStatLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
  });

  const renderDonationCard = ({ item }: { item: any }) => (
    <View style={styles.donationCard}>
      <View style={styles.donationHeader}>
        <Text style={styles.donationAmount}>
          R$ {item.amount.toFixed(2).replace('.', ',')}
        </Text>
        <View style={[
          styles.donationStatus,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            styles.donationStatusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status === 'completed' ? 'Concluída' : 
             item.status === 'pending' ? 'Pendente' : 'Falhou'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.donationDonor}>{item.donor}</Text>
      <Text style={styles.donationDetails}>Campanha: {item.campaign}</Text>
      
      <View style={styles.donationDetails}>
        <View style={styles.donationMethod}>
          <Ionicons 
            name={getMethodIcon(item.method)} 
            size={16} 
            color={colors.mutedForeground} 
          />
          <Text style={styles.donationMethodText}>
            {item.method === 'pix' ? 'PIX' : 
             item.method === 'card' ? 'Cartão' : 'Dinheiro'}
          </Text>
        </View>
        <Text style={styles.donationDate}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderCampaignCard = ({ item }: { item: any }) => {
    const progress = (item.raised / item.goal) * 100;
    
    return (
      <View style={styles.campaignCard}>
        <View style={styles.campaignHeader}>
          <Text style={styles.campaignTitle}>{item.title}</Text>
          <View style={[
            styles.campaignStatus,
            { backgroundColor: item.status === 'active' ? colors.success + '20' : colors.muted }
          ]}>
            <Text style={[
              styles.campaignStatusText,
              { color: item.status === 'active' ? colors.success : colors.mutedForeground }
            ]}>
              {item.status === 'active' ? 'Ativa' : 'Finalizada'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.campaignDescription}>{item.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            R$ {item.raised.toLocaleString()} de R$ {item.goal.toLocaleString()} ({progress.toFixed(0)}%)
          </Text>
        </View>
        
        <View style={styles.campaignStats}>
          <View style={styles.campaignStat}>
            <Text style={styles.campaignStatValue}>R$ {item.raised.toLocaleString()}</Text>
            <Text style={styles.campaignStatLabel}>Arrecadado</Text>
          </View>
          <View style={styles.campaignStat}>
            <Text style={styles.campaignStatValue}>{item.donors}</Text>
            <Text style={styles.campaignStatLabel}>Doadores</Text>
          </View>
          <View style={styles.campaignStat}>
            <Text style={styles.campaignStatValue}>
              {Math.ceil((new Date(item.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.campaignStatLabel}>Dias restantes</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Doações</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={styles.createButtonText}>Nova</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ {totalToday.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Hoje</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R$ {totalMonth.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Este Mês</Text>
            </View>
          </View>
        </View>

        {/* Abas */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, filter === 'donations' && styles.activeTab]}
            onPress={() => setFilter('donations')}
          >
            <Text style={[
              styles.tabText,
              filter === 'donations' && styles.activeTabText
            ]}>
              Doações
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, filter === 'campaigns' && styles.activeTab]}
            onPress={() => setFilter('campaigns')}
          >
            <Text style={[
              styles.tabText,
              filter === 'campaigns' && styles.activeTabText
            ]}>
              Campanhas
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {filter === 'donations' ? (
            <FlatList
              data={donations}
              renderItem={renderDonationCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <FlatList
              data={campaigns}
              renderItem={renderCampaignCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <CreateDonationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (donationData) => {
          await apiService.createDonationCampaign(donationData);
          setShowCreateModal(false);
          refetch();
        }}
      />
    </SafeAreaView>
  );
}