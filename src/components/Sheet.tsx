import { ReactNode, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSection } from '../context/section';
import { BODY, FONT } from '../theme';
import { PrimaryButton } from './form';
import { PressableScale } from './PressableScale';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  saveLabel?: string;
  saveDisabled?: boolean;
  onSave?: () => void;
};

export default function Sheet({ title, subtitle, children, saveLabel = 'Guardar', saveDisabled, onSave }: Props) {
  const { palette: p } = useSection();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withTiming(1, { duration: 340, easing: Easing.out(Easing.cubic) });
  }, []);

  const close = () => {
    t.value = withTiming(0, { duration: 240, easing: Easing.in(Easing.cubic) });
    setTimeout(() => router.back(), 230);
  };

  const backdrop = useAnimatedStyle(() => ({ opacity: t.value }));
  const sheet = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - t.value) * height }] }));

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]}>
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.kav}
        pointerEvents="box-none"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: p.cream, maxHeight: height * 0.88, paddingBottom: insets.bottom + 12 },
            sheet,
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <PressableScale onPress={close} hitSlop={10}>
              <Icon name="close" size={26} color={p.ink} />
            </PressableScale>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={[styles.title, { color: p.ink }]}>{title}</Text>
              {!!subtitle && <Text style={[styles.subtitle, { color: p.ink }]}>{subtitle}</Text>}
            </View>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton
              p={p}
              label={saveLabel}
              disabled={saveDisabled}
              onPress={() => {
                onSave?.();
                close();
              }}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.4)' },
  kav: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 8 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.18)', marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingBottom: 10 },
  title: { fontFamily: FONT, fontSize: 18 },
  subtitle: { fontFamily: BODY, fontSize: 12, opacity: 0.7, marginTop: 2 },
  content: { paddingHorizontal: 18, paddingBottom: 12, gap: 14 },
  footer: { paddingHorizontal: 18, paddingTop: 6 },
});