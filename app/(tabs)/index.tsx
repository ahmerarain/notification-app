import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Text, Button, Platform } from 'react-native';
import RNAndroidNotificationListener from 'react-native-android-notification-listener';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    checkPermission();
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const status = await RNAndroidNotificationListener.getPermissionStatus();
      setHasPermission(status !== 'denied');
    } else {
      setHasPermission(true);
    }
  };

  const requestPermission = () => {
    if (Platform.OS === 'android') {
      RNAndroidNotificationListener.requestPermission();
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await AsyncStorage.getItem('notifications');
      if (data) {
        setNotifications(JSON.parse(data));
      }
    } catch (e) {
      console.log('Error loading notifications', e);
    }
  };

  const clearNotifications = async () => {
    await AsyncStorage.removeItem('notifications');
    setNotifications([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.appTitle}>{item.app}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Notifications</ThemedText>

      {!hasPermission && (
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.permissionText}>App needs permission to read notifications.</ThemedText>
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      )}

      <View style={styles.controls}>
        <Button title="Refresh" onPress={loadNotifications} />
        <Button title="Clear All" onPress={clearNotifications} color="red" />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  permissionContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  permissionText: {
    color: '#c62828',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  appTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  }
});
