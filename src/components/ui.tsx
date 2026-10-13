import { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT, Palette } from '../theme';

export const shadow = (color = '#000'): ViewStyle => ({
  shadowColor: color,
  shadowOpacity: 0.18,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 5 },
  elevation: 5,
});

export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={require('../../assets/logo-icon.png')}
        style={{ width: size * 1.62, height: size * 1.62 }}
        resizeMode="contain"
      />
    </View>
  );
}

// El avatar de arriba a la derecha: abre Ajustes
export function AvatarButton({ size = 34 }: { size?: number }) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push('/ajustes')} hitSlop={8}>
      <Avatar size={size} />
    </Pressable>
  );
}

type TopBarProps = {
  palette: Palette;
  title: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function TopBar({ palette, title, left, right }: TopBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: palette.primary, paddingTop: insets.top + 8 },
        shadow(palette.ink),
      ]}
    >
      <View style={styles.side}>{left}</View>
      <Text style={[styles.title, { color: palette.ink }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right ?? <AvatarButton />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  side: { width: 44, justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: FONT, fontSize: 15 },
});