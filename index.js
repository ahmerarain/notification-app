import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import { ExpoRoot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const headlessNotificationListener = async ({ notification }) => {
    if (notification) {
        try {
            const current = await AsyncStorage.getItem('notifications');
            const parsed = current ? JSON.parse(current) : [];
            parsed.unshift(JSON.parse(notification));
            await AsyncStorage.setItem('notifications', JSON.stringify(parsed));
        } catch (e) {
            console.log("Error saving notification", e);
        }
    }
};

AppRegistry.registerHeadlessTask(RNAndroidNotificationListenerHeadlessJsName, () => headlessNotificationListener);

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
