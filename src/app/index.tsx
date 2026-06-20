
import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { Text } from 'react-native';

export default function HomeScreen() {
  const { login, getValidToken, isReady } = useSpotifyAuth();


  // useFocusEffect(
  //   useCallback(() => {
  //     router.push('/(auth)');
  //   }, [])
  // );

  // if (!isReady) {
  //   return (
  //     <ThemedView className="flex-1">
  //       <View className="flex-1"></View>
  //       <TouchableOpacity onPress={login} disabled={!isReady} className="bg-accent mb-14 rounded-2xl w-2/3 h-16 items-center justify-center self-center">
  //         <ThemedText>Login com Spotify</ThemedText>
  //       </TouchableOpacity>
  //     </ThemedView>
  //   )
  // }

  return (
    <ThemedView className='flex-1 items-center justify-center'>
      <ThemedView className='flex-1 items-center justify-center gap-2'>
        <AnimatedIcon />
        <ThemedText type="title" className='text-center'>
          Bem Vindo ao&nbsp;Kamuy
        </ThemedText>
        <Text className='text-4xl text-center text-white'>Kamuy</Text>
      </ThemedView>
    </ThemedView>
  );
}