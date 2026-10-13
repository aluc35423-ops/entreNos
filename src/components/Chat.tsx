import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BODY, BODY_BOLD, Palette } from '../theme';
import { Avatar, shadow } from './ui';

export type Msg = { id: string; mine: boolean; text: string; author?: string };

type Props = {
  palette: Palette;
  initial: Msg[];
  placeholder?: string;
  myAvatar?: boolean;       // muestra tu avatar junto a tus mensajes
  quickReplies?: string[];
  safeBottom?: boolean;     // true cuando la pantalla no tiene barra de pestañas
};

function Bubble({ m, p, myAvatar }: { m: Msg; p: Palette; myAvatar?: boolean }) {
  const showAvatar = !m.mine || myAvatar;
  return (
    <View style={[styles.row, m.mine && { flexDirection: 'row-reverse' }]}>
      {showAvatar && <Avatar size={26} />}
      <View style={styles.bubbleWrap}>
        {!m.mine && !!m.author && <Text style={[styles.author, { color: p.ink }]}>{m.author}</Text>}
        <View style={[styles.bubble, { backgroundColor: p.primary }, shadow(p.ink)]}>
          <Text style={[styles.text, { color: p.ink }]}>{m.text}</Text>
        </View>
      </View>
    </View>
  );
}

export default function Chat({ palette: p, initial, placeholder, myAvatar, quickReplies, safeBottom }: Props) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState('');
  const [chips, setChips] = useState(quickReplies);
  const listRef = useRef<FlatList<Msg>>(null);

  const send = (t: string) => {
    const v = t.trim();
    if (!v) return;
    setMessages((m) => [...m, { id: String(Date.now()), mine: true, text: v }]);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => <Bubble m={item} p={p} myAvatar={myAvatar} />}
      />

      {chips && (
        <View style={styles.chips}>
          {chips.map((c) => (
            <Pressable
              key={c}
              style={[styles.chip, { borderColor: p.accent }]}
              onPress={() => {
                setChips(undefined);
                send(c);
              }}
            >
              <Text style={[styles.chipText, { color: p.ink }]}>{c}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={[styles.inputBar, { paddingBottom: safeBottom ? insets.bottom + 10 : 10 }]}>
        <View style={[styles.inputWrap, shadow(p.ink)]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor="#8A8A9A"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => send(text)}
          />
          <Pressable style={[styles.send, { backgroundColor: p.button }]} onPress={() => send(text)}>
            <Icon name="arrow-up" size={22} color={p.ink} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleWrap: { maxWidth: '78%' },
  author: { fontFamily: BODY_BOLD, fontSize: 10, opacity: 0.7, marginBottom: 3, marginLeft: 6 },
  bubble: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  text: { fontFamily: BODY, fontSize: 13 },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#FFFFFF' },
  chipText: { fontFamily: BODY_BOLD, fontSize: 11 },
  inputBar: { paddingHorizontal: 12, paddingTop: 4 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingLeft: 16,
    paddingRight: 6,
    height: 52,
  },
  input: { flex: 1, fontFamily: BODY, fontSize: 14, color: '#2A1F4D' },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});