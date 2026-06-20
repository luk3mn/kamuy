import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function CallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // expo-auth-session handles the code exchange automatically
    // this screen just needs to exist and close itself
    router.replace('/');
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}