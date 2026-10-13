import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { BODY, BODY_BOLD, FONT, Palette } from '../theme';
import { PressableScale } from './PressableScale';
import { shadow } from './ui';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export function Card({ p, children, style }: { p: Palette; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, { backgroundColor: p.soft }, shadow(p.ink), style]}>{children}</View>;
}

export function CardTitle({ p, children }: { p: Palette; children: string }) {
  return <Text style={[styles.cardTitle, { color: p.ink }]}>{children}</Text>;
}

type InputProps = TextInputProps & { p: Palette; label: string; error?: string };

export function LabeledInput({ p, label, error, style, ...rest }: InputProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { color: p.ink }]}>{label}</Text>
      <TextInput
        placeholderTextColor="#8A8A9A"
        {...rest}
        style={[
          styles.input,
          { backgroundColor: p.cream, borderColor: error ? '#D64545' : p.primary },
          style,
        ]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function PrimaryButton({
  p,
  label,
  onPress,
  disabled,
}: {
  p: Palette;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: p.button, opacity: disabled ? 0.5 : 1 }]}
    >
      <Text style={[styles.btnText, { color: p.ink }]}>{label}</Text>
    </PressableScale>
  );
}

export function SwitchRow({
  p,
  label,
  hint,
  value,
  onChange,
}: {
  p: Palette;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.switchLabel, { color: p.ink }]}>{label}</Text>
        {!!hint && <Text style={[styles.hint, { color: p.ink }]}>{hint}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: p.cream, true: p.highlight }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export function Chip({
  p,
  label,
  icon,
  selected,
  onPress,
}: {
  p: Palette;
  label: string;
  icon?: keyof typeof Icon.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.94}
      style={[
        styles.chip,
        { backgroundColor: selected ? p.button : p.cream, borderColor: selected ? p.ink : 'transparent' },
      ]}
    >
      {!!icon && <Icon name={icon} size={18} color={p.ink} />}
      <Text style={[styles.chipText, { color: p.ink }]}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: 16, gap: 12 },
  cardTitle: { fontFamily: FONT, fontSize: 15 },
  label: { fontFamily: BODY_BOLD, fontSize: 12 },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontFamily: BODY,
    fontSize: 14,
    color: '#2A1F4D',
  },
  error: { color: '#D64545', fontFamily: BODY, fontSize: 11 },
  btn: { borderRadius: 16, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: FONT, fontSize: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchLabel: { fontFamily: BODY_BOLD, fontSize: 13 },
  hint: { fontFamily: BODY, fontSize: 11, opacity: 0.7, marginTop: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  emoji: { fontSize: 16 },
  chipText: { fontFamily: BODY_BOLD, fontSize: 12 },
});