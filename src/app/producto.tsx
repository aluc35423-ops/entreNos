import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Sheet from '../components/Sheet';
import { Card } from '../components/form';
import { useSection } from '../context/section';
import { PRODUCTS } from '../data/products';
import { BODY, BODY_BOLD, FONT } from '../theme';

export default function Producto() {
  const { palette: p } = useSection();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find((x) => x.id === id);

  if (!product) return null;

  return (
    <Sheet title={product.name} subtitle={product.category} saveLabel="Cerrar">
      <Card p={p} style={{ alignItems: 'center' }}>
        <View style={[styles.img, { backgroundColor: p.cream }]}>
          <Icon name={product.icon} size={96} color={p.ink} />
        </View>
        <Text style={[styles.price, { color: p.ink, backgroundColor: p.highlight }]}>{product.price}</Text>
      </Card>

      <View style={[styles.box, { backgroundColor: p.cream }]}>
        <Text style={[styles.title, { color: p.ink }]}>Descripción</Text>
        <Text style={[styles.text, { color: p.ink }]}>{product.description}</Text>
        <Text style={[styles.note, { color: p.ink }]}>Vista previa del producto.</Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', height: 180, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  price: { fontFamily: FONT, fontSize: 20, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 2, overflow: 'hidden' },
  box: { borderRadius: 16, padding: 16, gap: 8 },
  title: { fontFamily: BODY_BOLD, fontSize: 13 },
  text: { fontFamily: BODY, fontSize: 13, lineHeight: 19 },
  note: { fontFamily: BODY, fontSize: 11, opacity: 0.6 },
});