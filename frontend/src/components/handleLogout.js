import { Auth } from "firebase/auth";

export const handleLogout = async (navigation) => {
  await auth.signOut();
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }]
  });
};
