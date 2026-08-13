import { HomeDashboard } from '@/components/home-dashboard';
import { useMe } from '@/hooks/api/use-auth';
import { useRecentlyPlayedTracks } from '@/hooks/api/use-player';
import { getAuth } from '@react-native-firebase/auth';

export default function HomeScreen() {
  const { data: profile } = useMe();
  const { data: songs, error: errorSongs, refetch: refreshSongs } = useRecentlyPlayedTracks();
  console.log('songs', songs?.items);
  const firebaseUser = getAuth().currentUser;

  return (
    <HomeDashboard
      avatarUrl={profile?.images?.[0]?.url ?? firebaseUser?.photoURL}
      displayName={profile?.display_name ?? firebaseUser?.displayName ?? 'Luke'}
    />
  );
}
