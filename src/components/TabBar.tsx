import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSection } from '../context/section';
import { BODY_BOLD, PALETTES } from '../theme';
import { PressableScale } from './PressableScale';

type IconName = keyof typeof Icon.glyphMap;

const TABS: Record<string, { icon: IconName; label: string }> = {
  home: { icon: 'home-outline', label: 'HOME' },
  foros: { icon: 'message-text-outline', label: 'FOROS' },
  ai: { icon: 'brain', label: 'AI' },
  pareja: { icon: 'heart-outline', label: 'PAREJA' },
};

type ItemProps = {
  focused: boolean;
  icon: IconName;
  label: string;
  ink: string;
  onPress: () => void;
};

function TabItem({ focused, icon, label, ink, onPress }: ItemProps) {
  const t = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(focused ? 1 : 0, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, [focused]);

  const pill = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(t.value, [0, 1], ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']),
    paddingHorizontal: 12 + t.value * 6,
  }));

  return (
    <Animated.View layout={LinearTransition.duration(320)}>
      <PressableScale onPress={onPress} scaleTo={0.9}>
        <Animated.View style={[styles.item, pill]}>
          <Icon name={icon} size={26} color={ink} />
          {focused && (
            <Animated.Text
              entering={FadeIn.duration(260).delay(80)}
              exiting={FadeOut.duration(100)}
              style={[styles.label, { color: ink }]}
            >
              {label}
            </Animated.Text>
          )}
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
}

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const { palette: base } = useSection();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;
  const palette = current === 'pareja' ? PALETTES.parejas : base;

  return (
    <View style={[styles.bar, { backgroundColor: palette.primary, paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        return (
          <TabItem
            key={route.key}
            focused={state.index === i}
            icon={tab.icon}
            label={tab.label}
            ink={palette.ink}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingTop: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, borderRadius: 20 },
  label: { fontFamily: BODY_BOLD, fontSize: 11 },
});