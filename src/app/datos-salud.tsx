import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import SubScreen from '../components/SubScreen';
import { Card, CardTitle, Chip, LabeledInput, PrimaryButton } from '../components/form';
import { useSection } from '../context/section';
import { useProfile } from '../context/profile';
import { BODY_BOLD } from '../theme';

const inRange = (v: string, min: number, max: number) => v === '' || (Number(v) >= min && Number(v) <= max);
const digits = (v: string) => v.replace(/[^0-9.]/g, '');

export default function DatosSalud() {
  const { section, palette: p } = useSection();
  const { profile, update } = useProfile();
  const router = useRouter();

  const [d, setD] = useState({
    age: profile.age,
    height: profile.height,
    weight: profile.weight,
    exercise: profile.exercise,
    cycleLength: profile.cycleLength,
    periodLength: profile.periodLength,
  });
  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => setD((x) => ({ ...x, [k]: v }));

  const isWomen = section === 'mujeres';
  const errors = {
    age: inRange(d.age, 10, 120) ? '' : 'Ingresa una edad entre 10 y 120',
    height: inRange(d.height, 100, 230) ? '' : 'Ingresa una altura entre 100 y 230 cm',
    weight: inRange(d.weight, 30, 250) ? '' : 'Ingresa un peso entre 30 y 250 kg',
    cycleLength: !isWomen || inRange(d.cycleLength, 20, 45) ? '' : 'Entre 20 y 45 días',
    periodLength: !isWomen || inRange(d.periodLength, 2, 10) ? '' : 'Entre 2 y 10 días',
  };
  const invalid = Object.values(errors).some(Boolean);

  return (
    <SubScreen
      title="Datos de salud"
      footer={
        <PrimaryButton
          p={p}
          label="Guardar"
          disabled={invalid}
          onPress={() => {
            update(d);
            router.back();
          }}
        />
      }
    >
      <Card p={p}>
        <CardTitle p={p}>Tus datos</CardTitle>
        <LabeledInput p={p} label="Edad" value={d.age} onChangeText={(v) => set('age', digits(v))} keyboardType="numeric" placeholder="Años" error={errors.age} />
        <LabeledInput p={p} label="Altura (cm)" value={d.height} onChangeText={(v) => set('height', digits(v))} keyboardType="numeric" placeholder="Ej. 165" error={errors.height} />
        <LabeledInput p={p} label="Peso (kg)" value={d.weight} onChangeText={(v) => set('weight', digits(v))} keyboardType="numeric" placeholder="Ej. 60" error={errors.weight} />

        <View style={{ gap: 8 }}>
          <Text style={[styles.label, { color: p.ink }]}>¿Haces ejercicio?</Text>
          <View style={styles.row}>
            <Chip p={p} label="Sí" selected={d.exercise === true} onPress={() => set('exercise', true)} />
            <Chip p={p} label="No" selected={d.exercise === false} onPress={() => set('exercise', false)} />
          </View>
        </View>
      </Card>

      {isWomen && (
        <Card p={p}>
          <CardTitle p={p}>Tu ciclo</CardTitle>
          <LabeledInput p={p} label="Duración del ciclo (días)" value={d.cycleLength} onChangeText={(v) => set('cycleLength', digits(v))} keyboardType="numeric" error={errors.cycleLength} />
          <LabeledInput p={p} label="Duración del periodo (días)" value={d.periodLength} onChangeText={(v) => set('periodLength', digits(v))} keyboardType="numeric" error={errors.periodLength} />
        </Card>
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: BODY_BOLD, fontSize: 12 },
  row: { flexDirection: 'row', gap: 10 },
});