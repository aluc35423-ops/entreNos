import { useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONT } from '../theme';

// Tiempos de la transición (ms): sube los valores para hacerla más lenta
const FADE_OUT = 250;
const FADE_IN = 550;
const RESIZE = 800;

type FieldProps = TextInputProps & {
  icon: keyof typeof Icon.glyphMap;
  password?: boolean;
};

function Field({ icon, password, ...props }: FieldProps) {
  const [hidden, setHidden] = useState(!!password);
  return (
    <View style={styles.field}>
      <Icon name={icon} size={22} color={COLORS.text} />
      <TextInput
        autoCapitalize="none"
        placeholderTextColor="#7B7B93"
        {...props}
        secureTextEntry={hidden}
        style={styles.input}
      />
      {password && (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
          <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.text} />
        </Pressable>
      )}
    </View>
  );
}

type Props = {
  maxHeight: number; // alto máximo de la tarjeta; si el contenido pasa de aquí, hace scroll
  onLogin?: (data: { email: string; password: string }) => void;
  onRegister?: (data: Record<string, string | boolean | null>) => void;
};

export default function AuthForm({ maxHeight, onLogin, onRegister }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const isLogin = mode === 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [exercise, setExercise] = useState<boolean | null>(null);

  // --- Animación: alto de la tarjeta + fundido del contenido ---
  const containerH = useSharedValue(0);
  const fade = useSharedValue(1);
  const measured = useRef(false);
  const busy = useRef(false);

  const onContentLayout = (e: LayoutChangeEvent) => {
    const target = Math.min(e.nativeEvent.layout.height, maxHeight);
    if (!measured.current) {
      measured.current = true;
      containerH.value = target; // primera medida: sin animar
    } else {
      containerH.value = withTiming(target, {
        duration: RESIZE,
        easing: Easing.inOut(Easing.cubic),
      });
    }
  };

  // Al terminar de cambiar el modo, el contenido nuevo aparece
  useEffect(() => {
    fade.value = withDelay(
      100,
      withTiming(1, { duration: FADE_IN, easing: Easing.out(Easing.cubic) }),
    );
    const t = setTimeout(() => {
      busy.current = false;
    }, RESIZE);
    return () => clearTimeout(t);
  }, [mode]);

  const switchTo = (next: 'login' | 'register') => {
    if (busy.current) return;
    busy.current = true;
    fade.value = withTiming(0, { duration: FADE_OUT });
    setTimeout(() => setMode(next), FADE_OUT + 10);
  };

  const containerStyle = useAnimatedStyle(() => ({ height: containerH.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: interpolate(fade.value, [0, 1], [14, 0]) }],
  }));

  const submit = () => {
    if (isLogin) onLogin?.({ email, password });
    else onRegister?.({ name, email, password, height, weight, age, exercise });
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentStyle]} onLayout={onContentLayout}>
          {!isLogin && (
            <Text style={styles.intro}>Cuéntanos un poco sobre ti para crear tu cuenta.</Text>
          )}

          {!isLogin && (
            <Field
              icon="account-outline"
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <Field
            icon="email-outline"
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Field
            icon="lock-outline"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            password
          />

          {!isLogin && (
            <>
              <Field
                icon="human-male-height"
                placeholder="Altura (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              <Field
                icon="weight-kilogram"
                placeholder="Peso (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <Field
                icon="timer-sand"
                placeholder="Edad"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />

              <View style={styles.exerciseRow}>
                <Text style={styles.exerciseLabel}>¿Haces ejercicio?</Text>
                {[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false },
                ].map((o) => (
                  <Pressable key={o.label} style={styles.radioWrap} onPress={() => setExercise(o.value)}>
                    <View style={[styles.radio, exercise === o.value && styles.radioOn]} />
                    <Text style={styles.radioText}>{o.label}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Registrarme'}</Text>
          </Pressable>

          <Pressable onPress={() => switchTo(isLogin ? 'register' : 'login')}>
            <Text style={styles.link}>
              {isLogin ? '¿No tienes cuenta? Regístrate aquí.' : '¿Ya tienes cuenta? Inicia sesión aquí.'}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 12 },
  intro: { fontSize: 12, color: COLORS.text, textAlign: 'center', marginBottom: 4 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.lilac,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, fontSize: 15, color: '#2A1F4D' },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  exerciseLabel: { color: COLORS.text, fontFamily: FONT, fontSize: 14 },
  radioWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: COLORS.primary },
  radioOn: { backgroundColor: COLORS.primary },
  radioText: { color: COLORS.text, fontFamily: FONT, fontSize: 14 },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#FFFFFF', fontSize: 20, fontFamily: FONT },
  link: { color: COLORS.text, fontFamily: FONT, fontSize: 15, marginTop: 4 },
});