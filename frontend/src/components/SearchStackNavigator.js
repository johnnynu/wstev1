
import { useNavigation,NavigationContainer } from "@react-navigation/native";
import { logout } from "./firebase";
const SearchStackNavigator = () => {
    const navigation = useNavigation();
  
    const HomeHeader = () => {
      const handleLogout = async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      };
  
      const headerRight = (
        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      );
  
      return {
        headerRight
      };
    };
  
    return (
      <SearchStack.Navigator>
        <SearchStack.Screen
          name="SearchMain"
          component={Search}
          options={{ headerShown: true,
            header: () => <HomeHeader />,
          }}
        />
        <SearchStack.Screen
          name="RecipeDetails"
          component={RecipeDetails}
          options={{ title: "Recipe Details" }}
        />
      </SearchStack.Navigator>
    );
  };
  