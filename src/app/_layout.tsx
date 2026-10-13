import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Quicksand_500Medium, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { SectionProvider } from '../context/section';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Fredoka_600SemiBold,
    Quicksand_500Medium,
    Quicksand_700Bold,
    TitanOne_400Regular,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SectionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 350,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(app)" options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack>
    </SectionProvider>
  );
}