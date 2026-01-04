import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();

  // Mock Data
  const user = {
    name: "Profile Name",
    level: 5,
    xp: 1250,
    maxXp: 2000,
    stats: {
      totalSteps: 124500,
      territoriesOwned: 12,
      bossesDefeated: 3,
      kingdomsFormed: 1,
      currentStreak: 5,
    },
    achievements: [
      { id: 1, title: "First Victory", unlocked: true },
      { id: 2, title: "Night Owl", unlocked: true },
      { id: 3, title: "Empire Builder", unlocked: true },
      { id: 4, title: "Marathon Master", unlocked: false },
    ],
    weeklyActivity: [
      { day: 'M', value: 0.4 },
      { day: 'T', value: 0.2 },
      { day: 'W', value: 0.1 },
      { day: 'T', value: 0.8 },
      { day: 'F', value: 0.3 },
      { day: 'S', value: 0.5 },
      { day: 'S', value: 0.6 },
    ]
  };

  const xpPercentage = (user.xp / user.maxXp) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Floating Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <Ionicons name="person-circle" size={60} color="#333" />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.levelText}>Level {user.level} Walker</Text>
            </View>
          </View>
          
          <View style={styles.xpContainer}>
            <Text style={styles.xpLabel}>XP:</Text>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${xpPercentage}%` }]} />
            </View>
            <Text style={styles.xpText}>{user.xp}/{user.maxXp}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics:</Text>
          <View style={styles.statRow}><Text style={styles.statLabel}>Total Steps:</Text><Text style={styles.statValue}>{user.stats.totalSteps.toLocaleString()}</Text></View>
          <View style={styles.statRow}><Text style={styles.statLabel}>Territories Owned:</Text><Text style={styles.statValue}>{user.stats.territoriesOwned}</Text></View>
          <View style={styles.statRow}><Text style={styles.statLabel}>Bosses Defeated:</Text><Text style={styles.statValue}>{user.stats.bossesDefeated}</Text></View>
          <View style={styles.statRow}><Text style={styles.statLabel}>Kingdoms Formed:</Text><Text style={styles.statValue}>{user.stats.kingdomsFormed}</Text></View>
          <View style={styles.statRow}><Text style={styles.statLabel}>Current Streak:</Text><Text style={styles.statValue}>{user.stats.currentStreak} days</Text></View>
        </View>

        <View style={styles.divider} />

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements:</Text>
          {user.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementRow}>
              <Ionicons 
                name={achievement.unlocked ? "checkbox" : "lock-closed-outline"} 
                size={20} 
                color={achievement.unlocked ? "#333" : "#666"} 
              />
              <Text style={[styles.achievementText, !achievement.unlocked && styles.lockedText]}>
                {achievement.title}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Weekly Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week:</Text>
          <View style={styles.chartContainer}>
            {user.weeklyActivity.map((day, index) => (
              <View key={index} style={styles.chartColumn}>
                <View style={[styles.chartBar, { height: 60 * day.value }]} />
                <Text style={styles.chartLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Slightly grey background to make cards pop
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  // Floating Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  iconButton: {
    padding: 4,
  },
  // Cards
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileText: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 16,
    color: '#666',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#999',
  },
  xpText: {
    fontSize: 12,
    color: '#666',
  },
  // Statistics
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Achievements
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  achievementText: {
    fontSize: 16,
    color: '#333',
  },
  lockedText: {
    color: '#999',
  },
  // Chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  chartColumn: {
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
