import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
type TerritoryType = 'owned' | 'enemy' | 'neutral';

interface Territory {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  type: TerritoryType;
}

// --- Constants ---
const GRID_SIZE = 0.01; // Size of each grid cell (approx. 1.1km)
const GRID_RADIUS = 2;   // How many cells to generate in each direction (creates an 11x11 grid)

const CURRENT_STEPS = 3500;
const GOAL_STEPS = 5000;
const PROGRESS = Math.min(CURRENT_STEPS / GOAL_STEPS, 1);

const TERRITORY_COLORS = {
  owned: 'rgba(0, 0, 255, 0.3)',   // Blue
  enemy: 'rgba(255, 0, 0, 0.3)',   // Red
  neutral: 'rgba(128, 128, 128, 0.3)' // Grey
};

const TERRITORY_BORDER_COLORS = {
  owned: 'rgba(0, 0, 255, 0.8)',
  enemy: 'rgba(255, 0, 0, 0.8)',
  neutral: 'rgba(128, 128, 128, 0.8)'
};

export default function Index() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      generateGrid(currentLocation.coords);
    })();
  }, []);

  const generateGrid = (coords: { latitude: number; longitude: number }) => {
    const newTerritories: Territory[] = [];
    
    // Snap user location to a grid to keep territories consistent
    const startLat = Math.floor(coords.latitude / GRID_SIZE) * GRID_SIZE;
    const startLong = Math.floor(coords.longitude / GRID_SIZE) * GRID_SIZE;

    for (let x = -GRID_RADIUS; x <= GRID_RADIUS; x++) {
      for (let y = -GRID_RADIUS; y <= GRID_RADIUS; y++) {
        const cellLat = startLat + (x * GRID_SIZE);
        const cellLong = startLong + (y * GRID_SIZE);

        // Define the 4 corners of the square
        const squareCoords = [
          { latitude: cellLat, longitude: cellLong },
          { latitude: cellLat + GRID_SIZE, longitude: cellLong },
          { latitude: cellLat + GRID_SIZE, longitude: cellLong + GRID_SIZE },
          { latitude: cellLat, longitude: cellLong + GRID_SIZE },
        ];
        // Randomly assign type for demonstration
        const rand = Math.random();
        let type: TerritoryType = 'neutral';
        if (rand > 0.7) type = 'enemy';
        else if (rand > 0.5) type = 'owned';

        newTerritories.push({
          id: `${x},${y}`,
          coordinates: squareCoords,
          type,
        });
      }
    }
    setTerritories(newTerritories);
  };

  const recenterMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const resetBearing = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({ heading: 0 });
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Locating...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false} // Hide default
        showsCompass={false}          // Hide default
      >
        {territories.map((territory) => (
          <React.Fragment key={territory.id}>
            {/* The Grid Square */}
            <Polygon
              coordinates={territory.coordinates}
              fillColor={TERRITORY_COLORS[territory.type]}
              strokeColor={TERRITORY_BORDER_COLORS[territory.type]}
              strokeWidth={2}
            />
          </React.Fragment>
        ))}
      </MapView>
      
      {/* UI Overlay Layer */}
      <SafeAreaView style={styles.uiOverlay} pointerEvents="box-none">
        
        {/* Top Section Container */}
        <View>
          {/* Top Bar */}
          <View style={styles.topBar}>

            {/* Left Side: Menu and Name */}
            <View style={styles.topLeftGroup}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="menu" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.gameTitle}>StepQuest</Text>
            </View>
            
            <View style={styles.topRightButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="person-circle-outline" size={28} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="settings-outline" size={26} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Map Controls - Just below Top Bar, aligned right */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.controlButton} onPress={resetBearing}>
              <Ionicons name="compass-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={recenterMap}>
              <Ionicons name="locate" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBarContainer}>
          <View style={styles.bottomBar}>
            <View style={styles.stepInfo}>
              <Text style={styles.stepLabel}>Daily Steps</Text>
              <Text style={styles.stepCount}>{CURRENT_STEPS} / {GOAL_STEPS}</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${PROGRESS * 100}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(PROGRESS * 100)}%</Text>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // This makes the map fill the screen behind everything
  },
  uiOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // Top Bar Styles
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
  },
  topLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  topRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  // Map Controls Styles
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to the right
    marginRight: 16,
    marginTop: 10,
    gap: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Bottom Bar Styles
  bottomBarContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  bottomBar: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  stepInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  stepCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBackground: {
    flex: 1, // Take up remaining space
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50', // Green for progress
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 35, // Ensure text doesn't jump around too much
  },
});