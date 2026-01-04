import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TerritoryDetails() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  
  const isEnemy = type === 'enemy';
  const isOwned = type === 'owned';

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Floating Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Territory</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Placeholder */}
        <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={80} color="#888" />
            <Text style={styles.imageText}>{isEnemy ? 'Boss Illustration' : 'Territory Illustration'}</Text>
        </View>

        {isEnemy && (
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.bossName}>Boss Name</Text>
                </View>
                
                <View style={styles.card}>
                    <Text style={styles.statusLabel}>Status: <Text style={styles.statusValue}>Enemy Controlled</Text></Text>
                    
                    <Text style={styles.sectionTitle}>Boss Stats:</Text>
                    <View style={styles.bulletList}>
                        <Text style={styles.text}>• HP: 5000/5000</Text>
                        <Text style={styles.text}>• Type: Fire</Text>
                        <Text style={styles.text}>• Weakness: Water</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Special Mechanic:</Text>
                    <Text style={styles.text}>Takes double damage from steps taken between 6:00 PM and 8:00 PM.</Text>

                    <Text style={styles.sectionTitle}>Rewards:</Text>
                    <View style={styles.bulletList}>
                        <Text style={styles.text}>• 500 XP</Text>
                        <Text style={styles.text}>• Boss Item: Fire Shard</Text>
                        <Text style={styles.text}>• 10% Walking Speed Buff</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.challengeButton} onPress={() => router.push(
                    { pathname: '/screens/battle' as any })}>
                    <Text style={styles.challengeButtonText}>[ CHALLENGE BOSS ]</Text>
                </TouchableOpacity>
                
                <Text style={styles.distanceText}>Distance to Territory: 0.5km</Text>
            </View>
        )}

        {isOwned && (
            <View style={styles.infoContainer}>
                 <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Territory Health:</Text>
                    <View style={styles.healthRow}>
                        <View style={styles.healthBarContainer}>
                            <View style={[styles.healthBarFill, { width: '80%' }]} />
                        </View>
                        <Text style={styles.healthText}>80%</Text>
                    </View>

                    <Text style={styles.text}>Decays in: 2 Days, 4 hours</Text>
                    <Text style={styles.text}>Last Patrol: 1 Day ago</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Kingdom Bonus Active:</Text>
                    <Text style={styles.text}>Connected to 3 other territories</Text>
                    <Text style={styles.text}>• Decay Rate -15%</Text>
                </View>

                <TouchableOpacity style={styles.patrolButton}>
                    <Text style={styles.patrolButtonText}>[ PATROL TERRITORY ]</Text>
                    <Text style={styles.subButtonText}>(Walk 2000 steps here)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.abandonButton}>
                    <Text style={styles.abandonButtonText}>[ ABANDON TERRITORY ]</Text>
                </TouchableOpacity>
            </View>
        )}
        
        {/* Neutral State */}
        {!isEnemy && !isOwned && (
             <View style={styles.infoContainer}>
                <View style={styles.card}>
                    <Text style={styles.statusLabel}>Status: <Text style={styles.statusValue}>Neutral</Text></Text>
                    <Text style={styles.text}>This territory is unclaimed. Walk here to claim it!</Text>
                </View>
                <TouchableOpacity style={styles.challengeButton}>
                    <Text style={styles.challengeButtonText}>[ CLAIM TERRITORY ]</Text>
                </TouchableOpacity>
             </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
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
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContainer: {
        gap: 15,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bossName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusValue: {
        fontWeight: 'normal',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    bulletList: {
        marginLeft: 10,
    },
    text: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    challengeButton: {
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    challengeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    distanceText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
    },
    // Owned specific
    healthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    healthBarContainer: {
        flex: 1,
        height: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
    },
    healthBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    healthText: {
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 5,
    },
    patrolButton: {
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    patrolButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subButtonText: {
        fontSize: 12,
        color: '#666',
    },
    abandonButton: {
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        marginTop: 5,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    abandonButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});