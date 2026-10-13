import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Sheet from '../components/Sheet';
import { Card, CardTitle, Chip } from '../components/form';
import { useSection } from '../context/section';
import { useLog } from '../context/log';
import { MONTHS } from '../utils/dates';
import { BODY } from '../theme';
import type { Section } from '../theme';

type IconName = keyof typeof Icon.glyphMap;
type Category = { title: string; only?: Section; items: { label: string; icon: IconName }[] };

const CATEGORIES: Category[] = [
  {
    title: 'Ánimo',
    items: [
      { label: 'Feliz', icon: 'emoticon-happy-outline' },
      { label: 'Tranquilidad', icon: 'spa-outline' },
      { label: 'Motivación', icon: 'arm-flex-outline' },
      { label: 'Ansiedad', icon: 'emoticon-confused-outline' },
      { label: 'Irritabilidad', icon: 'emoticon-angry-outline' },
      { label: 'Tristeza', icon: 'emoticon-sad-outline' },
      { label: 'Sensibilidad', icon: 'heart-broken-outline' },
    ],
  },
  {
    title: 'Cuerpo',
    items: [
      { label: 'Dolor de cabeza', icon: 'head-flash-outline' },
      { label: 'Dolor de espalda', icon: 'human' },
      { label: 'Náuseas', icon: 'emoticon-sick-outline' },
      { label: 'Hinchazón', icon: 'circle-expand' },
      { label: 'Acné', icon: 'dots-horizontal-circle-outline' },
      { label: 'Mareo', icon: 'rotate-3d-variant' },
    ],
  },
  {
    title: 'Flujo',
    only: 'mujeres',
    items: [
      { label: 'Manchado', icon: 'water-outline' },
      { label: 'Ligero', icon: 'water' },
      { label: 'Medio', icon: 'water-plus' },
      { label: 'Abundante', icon: 'waves' },
    ],
  },
  {
    title: 'Dolor del ciclo',
    only: 'mujeres',
    items: [
      { label: 'Cólicos', icon: 'flash-outline' },
      { label: 'Senos sensibles', icon: 'flower-outline' },
    ],
  },
  {
    title: 'Energía y sueño',
    items: [
      { label: 'Mucha energía', icon: 'lightning-bolt' },
      { label: 'Poca energía', icon: 'battery-low' },
      { label: 'Dormí bien', icon: 'sleep' },
      { label: 'Insomnio', icon: 'weather-night' },
    ],
  },
  {
    title: 'Antojos',
    items: [
      { label: 'Dulce', icon: 'candy-outline' },
      { label: 'Salado', icon: 'french-fries' },
      { label: 'Sin apetito', icon: 'food-off-outline' },
    ],
  },
];

export default function Sintomas() {
  const { section, palette: p } = useSection();
  const { get, update } = useLog();
  const [selected, setSelected] = useState<string[]>(get().symptoms);
  const [query, setQuery] = useState('');

  const today = new Date();
  const toggle = (label: string) =>
    setSelected((s) => (s.includes(label) ? s.filter((x) => x !== label) : [...s, label]));

  const q = query.trim().toLowerCase();
  const visible = CATEGORIES.filter((c) => !c.only || c.only === section)
    .map((c) => ({ ...c, items: c.items.filter((i) => !q || i.label.toLowerCase().includes(q)) }))
    .filter((c) => c.items.length > 0);

  return (
    <Sheet
      title="Hoy"
      subtitle={`${today.getDate()} de ${MONTHS[today.getMonth()]} · ¿Cómo te sientes?`}
      onSave={() => update({ symptoms: selected })}
    >
      <View style={[styles.search, { backgroundColor: p.soft }]}>
        <Icon name="magnify" size={22} color={p.ink} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar"
          placeholderTextColor="#8A8A9A"
          style={styles.searchInput}
        />
      </View>

      {visible.map((c) => (
        <Card key={c.title} p={p}>
          <CardTitle p={p}>{c.title}</CardTitle>
          <View style={styles.wrap}>
            {c.items.map((i) => (
              <Chip
                key={i.label}
                p={p}
                label={i.label}
                emoji={i.emoji}
                selected={selected.includes(i.label)}
                onPress={() => toggle(i.label)}
              />
            ))}
          </View>
        </Card>
      ))}

      {visible.length === 0 && <Text style={[styles.empty, { color: p.ink }]}>Sin resultados</Text>}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 22, paddingHorizontal: 14, height: 46 },
  searchInput: { flex: 1, fontFamily: BODY, fontSize: 14, color: '#2A1F4D' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  empty: { textAlign: 'center', fontFamily: BODY, marginTop: 10 },
});