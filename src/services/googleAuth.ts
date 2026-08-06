// services/googleAuth.ts
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true,
});

export async function signInWithGoogle() {
  if (!WEB_CLIENT_ID) {
    throw new Error('Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID com o Web client ID do Firebase.');
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { data } = await GoogleSignin.signIn();

  if (!data?.idToken) throw new Error('Google Sign-In falhou: idToken ausente');

  const googleCredential = GoogleAuthProvider.credential(data.idToken);
  const userCredential = await signInWithCredential(getAuth(), googleCredential);

  return userCredential.user;
}

export async function signOutGoogle() {
  await GoogleSignin.signOut();
  await signOut(getAuth());
}
