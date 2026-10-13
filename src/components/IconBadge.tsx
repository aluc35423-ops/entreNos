import { View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type Props = {
  name: keyof typeof Icon.glyphMap;
  size?: number;
  bg: string;
  color: string;
  round?: boolean;
};

export default function IconBadge({ name, size = 56, bg, color, round }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.3,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={name} size={size * 0.55} color={color} />
    </View>
  );
}