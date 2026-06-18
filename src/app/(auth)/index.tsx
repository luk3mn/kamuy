import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSignIn } from "@/hooks/api/use-auth";
import { TouchableOpacity, View } from "react-native";

export default function Auth() {
    const { mutate: signIn, isPending, error } = useSignIn();

    const redirectUri = 'com.hiddenfy://oauthredirect';
    const scope = 'user-read-private user-read-email user-read-playback-state user-read-currently-playing user-read-recently-played';

    
    return (
        <ThemedView className="flex-1">
            <View className="flex-1"></View>
            <TouchableOpacity onPress={() => signIn()} className="bg-accent mb-14 rounded-2xl w-2/3 h-16 items-center justify-center self-center">
                <ThemedText>Login com Spotify</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    )
}