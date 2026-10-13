import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { Quicksand_500Medium, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { SectionProvider } from '../context/section';
import { ProfileProvider } from '../context/profile';
import { LogProvider } from '../context/log';

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
      <ProfileProvider>
        <LogProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 350,
            }}
          >
            <Stack.Screen name="index" options={{ animation: 'fade' }} />
            <Stack.Screen name="(app)" options={{ animation: 'fade', gestureEnabled: false }} />

            {/* Ventanas emergentes: ellas mismas animan su entrada */}
            <Stack.Screen name="sintomas" options={{ presentation: 'transparentModal', animation: 'none' }} />
            <Stack.Screen name="sexo" options={{ presentation: 'transparentModal', animation: 'none' }} />
            <Stack.Screen name="nota" options={{ presentation: 'transparentModal', animation: 'none' }} />
            <Stack.Screen name="producto" options={{ presentation: 'transparentModal', animation: 'none' }} />
            <Stack.Screen name="checkin" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          </Stack>
        </LogProvider>
      </ProfileProvider>
    </SectionProvider>
  );
}