import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/battle" options={{ headerShown: false }} />
      <Stack.Screen name="screens/territoryScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
