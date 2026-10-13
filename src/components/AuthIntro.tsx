import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { COLORS, LOGO_FONT } from '../theme';
import AuthForm from './AuthForm';
import { useProfile } from '../context/profile';

const LOGO = 72;
const SIZE = 260;
const C = SIZE / 2;
const FINAL_SCALE = 0.6;

// Texto en arco
const ARC_R = 66;       // distancia de las letras al centro
const ARC_FONT = 28;
const ARC_STEP = 26;    // grados entre letras: sube si se pegan, baja si se separan
type ArcProps = { text: string; position: 'top' | 'bottom' };

function ArcText({ text, position }: ArcProps) {
  const letters = text.split('');
  const mid = (letters.length - 1) / 2;
  const box = ARC_FONT * 1.4;

  return (
    <>
      {letters.map((ch, i) => {
        const offset = (i - mid) * ARC_STEP;
        const angle = position === 'top' ? -90 + offset : 90 - offset;
        const rad = (angle * Math.PI) / 180;
        const x = C + ARC_R * Math.cos(rad);
        const y = C + ARC_R * Math.sin(rad);
        const rotate = position === 'top' ? angle + 90 : angle - 90;

        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x - box / 2,
              top: y - box / 2,
              width: box,
              height: box,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ rotate: `${rotate}deg` }],
            }}
          >
            <Text
              style={{
                fontFamily: LOGO_FONT,
                fontSize: ARC_FONT,
                color: COLORS.text,
                includeFontPadding: false,
              }}
            >
              {ch}
            </Text>
          </View>
        );
      })}
    </>
  );
}

// Decoración con los colores de las rayitas del logo
type Decor = { type: 'star' | 'dot'; x: string; y: string; size: number; color: string };

const DECOR: Decor[] = [
  { type: 'star', x: '18%', y: '30%', size: 22, color: COLORS.yellow },
  { type: 'star', x: '78%', y: '66%', size: 18, color: COLORS.yellow },
  { type: 'star', x: '30%', y: '72%', size: 14, color: COLORS.teal },
  { type: 'star', x: '70%', y: '24%', size: 12, color: COLORS.teal },
  { type: 'dot', x: '82%', y: '36%', size: 14, color: COLORS.lilac },
  { type: 'dot', x: '12%', y: '58%', size: 10, color: COLORS.pink },
  { type: 'dot', x: '60%', y: '80%', size: 8, color: COLORS.lilac },
];

function DecorItem({ d }: { d: Decor }) {
  const pos = { position: 'absolute' as const, left: d.x as any, top: d.y as any };
  if (d.type === 'star') {
    return (
      <Svg width={d.size} height={d.size} viewBox="0 0 24 24" style={pos}>
        <Path
          d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0 Z"
          fill={d.color}
        />
      </Svg>
    );
  }
  return (
    <View style={[pos, { width: d.size, height: d.size, borderRadius: d.size / 2, backgroundColor: d.color }]} />
  );
}

export default function AuthIntro() {
  const { height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { update } = useProfile();

  const [boxH, setBoxH] = useState(H); // alto real del contenedor

  const finalCenter = insets.top + 24 + (SIZE * FINAL_SCALE) / 2;
// la tarjeta empieza debajo de "NOS" ya encogido, con 20 de margen
  const cardTop = finalCenter + (ARC_R + ARC_FONT) * FINAL_SCALE + 20;
  const travel = finalCenter - boxH / 2;

  const bg = useSharedValue(0);
  const shape = useSharedValue(0);
  const pop = useSharedValue(1);
  const entre = useSharedValue(0);
  const nos = useSharedValue(0);
  const decor = useSharedValue(0);
  const move = useSharedValue(0);
  const card = useSharedValue(0);

  useEffect(() => {
    bg.value = withTiming(1, { duration: 600 });
    shape.value = withTiming(1, { duration: 500 });
    pop.value = withSequence(
      withTiming(1.6, { duration: 450, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 450, easing: Easing.inOut(Easing.cubic) }),
    );
    entre.value = withDelay(1000, withTiming(1, { duration: 350 }));
    decor.value = withDelay(1100, withTiming(1, { duration: 500 }));
    nos.value = withDelay(1250, withTiming(1, { duration: 350 }));

    move.value = withDelay(2000, withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.cubic) }));
    card.value = withDelay(2500, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
  }, []);

  const gradientStyle = useAnimatedStyle(() => ({ opacity: bg.value }));

  const decorStyle = useAnimatedStyle(() => ({
    opacity: decor.value * (1 - move.value),
    transform: [{ scale: interpolate(decor.value, [0, 1], [0.8, 1]) }],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(move.value, [0, 1], [0, travel]) },
      { scale: interpolate(move.value, [0, 1], [1, FINAL_SCALE]) },
    ],
  }));

  const radiusStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(shape.value, [0, 1], [LOGO / 2, 20]),
  }));
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const entreStyle = useAnimatedStyle(() => ({ opacity: entre.value }));
  const nosStyle = useAnimatedStyle(() => ({ opacity: nos.value }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: card.value,
    transform: [{ translateY: interpolate(card.value, [0, 1], [60, 0]) }],
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      onLayout={(e) => setBoxH(e.nativeEvent.layout.height)}
    >
      <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
        <LinearGradient
          colors={COLORS.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, decorStyle]} pointerEvents="none">
        {DECOR.map((d, i) => (
          <DecorItem key={i} d={d} />
        ))}
      </Animated.View>

      <Animated.View style={[styles.header, headerStyle]} pointerEvents="none">
        <Animated.View style={[styles.abs, entreStyle]}>
          <ArcText text="ENTRE" position="top" />
        </Animated.View>

        <Animated.View style={[styles.abs, nosStyle]}>
          <ArcText text="NOS" position="bottom" />
        </Animated.View>

        <Animated.View style={[styles.logoShadow, radiusStyle, popStyle]}>
          <Animated.View style={[styles.logoClip, radiusStyle]}>
            <Image source={require('../../assets/logo-icon.png')} style={styles.img} resizeMode="contain" />
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.card, { top: cardTop }, cardStyle]}>
        <AuthForm
          maxHeight={boxH - cardTop - 16 - insets.bottom}
          onLogin={() => router.replace('/home')}
          onRegister={(d) => {
          update({
            name: String(d.name ?? ''),
            email: String(d.email ?? ''),
            height: String(d.height ?? ''),
            weight: String(d.weight ?? ''),
            age: String(d.age ?? ''),
            exercise: (d.exercise as boolean | null) ?? null,
          });
          router.replace('/home');
        }}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  abs: { position: 'absolute', width: SIZE, height: SIZE },
  logoShadow: {
    width: LOGO,
    height: LOGO,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  logoClip: { width: LOGO, height: LOGO, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: LOGO * 1.62, height: LOGO * 1.62 },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 32,
    overflow: 'hidden',
  },
});