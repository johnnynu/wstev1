import { useState } from "react";
import { View } from "react-native";
import { Title, Searchbar, Appbar } from "react-native-paper";
import SearchFunc from "../components/SearchFunc";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Search" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      <Searchbar onChangeText={onChangeSearch} value={searchQuery} />
      <SearchFunc props={searchQuery} />
    </View>
  );
};

export default Search;
