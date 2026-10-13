import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';

export default function AppLayout() {
  return (
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="foros" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="pareja" />
    </Tabs>
  );
}