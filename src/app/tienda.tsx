import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PressableScale } from '../components/PressableScale';
import { Chip } from '../components/form';
import { shadow, TopBar } from '../components/ui';
import { useSection } from '../context/section';
import { PRODUCTS } from '../data/products';
import { BODY_BOLD } from '../theme';

const CATEGORIES = ['Todo', 'Protección', 'Menstruación', 'Bienestar', 'Parejas'] as const;

export default function Tienda() {
  const { section, palette: p } = useSection();
  const router = useRouter();
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Todo');

  const items = PRODUCTS.filter(
    (x) => (!x.only || x.only === section) && (cat === 'Todo' || x.category === cat),
  );
  const cats = CATEGORIES.filter((c) => c !== 'Menstruación' || section === 'mujeres');

  return (
    <View style={{ flex: 1, backgroundColor: p.cream }}>
      <TopBar
        palette={p}
        title="Tienda"
        left={
          <PressableScale onPress={() => router.back()} hitSlop={10}>
            <Icon name="arrow-left" size={26} color={p.ink} />
          </PressableScale>
        }
      />

      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 14 }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={cats}
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cats}
            style={{ flexGrow: 0 }}
            renderItem={({ item }) => (
              <Chip p={p} label={item} selected={cat === item} onPress={() => setCat(item)} />
            )}
          />
        }
        renderItem={({ item }) => (
          <PressableScale
            style={[styles.card, { backgroundColor: p.soft }, shadow(p.ink)]}
            onPress={() => router.push({ pathname: '/producto', params: { id: item.id } })}
          >
            <View style={[styles.img, { backgroundColor: p.cream }]}>
              <Icon name={item.icon} size={52} color={p.ink} />
            </View>
            <Text style={[styles.name, { color: p.ink }]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={[styles.price, { color: p.ink, backgroundColor: p.highlight }]}>{item.price}</Text>
          </PressableScale>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 18, gap: 14, paddingBottom: 40 },
  cats: { gap: 8, paddingBottom: 6 },
  card: { flex: 1, borderRadius: 18, padding: 10, gap: 8, marginTop: 8 },
  img: { height: 110, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: BODY_BOLD, fontSize: 12, minHeight: 32 },
  price: {
    alignSelf: 'flex-start',
    fontFamily: BODY_BOLD,
    fontSize: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
});