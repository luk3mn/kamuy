
import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Text } from 'react-native';

export default function HomeScreen() {
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