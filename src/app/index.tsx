
import { ThemedView } from '@/components/themed-view';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView className='flex-1 items-center justify-center'>
      {/* <ThemedView className='flex-1 items-center justify-center gap-2'>
        <AnimatedIcon />
        <ThemedText type="title" className='text-center'>
          Bem Vindo ao&nbsp;Kamuy
        </ThemedText>
        <Text className='text-4xl text-center text-white'>Kamuy</Text>
      </ThemedView> */}
      <View className="bg-background">
        <Text className="text-primary">Hello</Text>
        <View className="bg-surface rounded-xl">
          <Text className="text-muted">Subtitle</Text>
        </View>
      </View>
    </ThemedView>
  );
}