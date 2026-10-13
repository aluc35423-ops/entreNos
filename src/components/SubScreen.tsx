import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSection } from '../context/section';
import { PressableScale } from './PressableScale';
import { TopBar } from './ui';
import type { Palette } from '../theme';

export default function SubScreen({
    title,
    children,
    footer,
    palette,
    }: {
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    palette?: Palette;
    }) {
    const { palette: base } = useSection();
    const p = palette ?? base;
    const router = useRouter();
    const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title={title}
        left={
          <PressableScale onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </PressableScale>
        }
        right={<View />}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {footer && <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View>}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, gap: 16, paddingBottom: 30 },
  footer: { paddingHorizontal: 18, paddingTop: 8 },
});