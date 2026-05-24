
import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView className='flex-1 items-center justify-center'>
      <ThemedView className='flex-1 items-center justify-center gap-2'>
        <AnimatedIcon />
        <ThemedText type="title" className='text-center'>
          Bem Vindo ao&nbsp;Kamuy
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}