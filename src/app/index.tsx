import { HomeDashboard } from '@/components/home-dashboard';
import { useMe } from '@/hooks/api/use-auth';
import { getAuth } from '@react-native-firebase/auth';

export default function HomeScreen() {
  const { data: profile } = useMe();
  const firebaseUser = getAuth().currentUser;

  return (
    <HomeDashboard
      avatarUrl={profile?.images?.[0]?.url ?? firebaseUser?.photoURL}
      displayName={profile?.display_name ?? firebaseUser?.displayName ?? 'Luke'}
    />
  );
}
