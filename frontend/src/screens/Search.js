import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Title, Searchbar, Appbar, RadioButton } from "react-native-paper";
import SearchFunc from "../components/SearchFunc";

const Search = () => {
  // work review 3: so now we have two variables for search, one for the query and one for the type
  // we can use these to make the searchbar placeholder dynamic
  // we can also use these to make the search function dynamic
  // we can also use these to make the search results dynamic
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("ingredients");

  const onChangeSearch = (query) => setSearchQuery(query);

  const onSearchTypeChange = (type) => setSearchType(type);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Search" />
      </Appbar.Header>
      <View style={styles.searchContainer}>
        <Searchbar
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          placeholder={`Search by ${searchType}...`}
          placeholderTextColor="#888"
        />
        <RadioButton.Group
          onValueChange={(value) => onSearchTypeChange(value)}
          value={searchType}
        >
          <RadioButton.Item label="Ingredients" value="ingredients" />
          <RadioButton.Item label="Recipe" value="recipe" />
        </RadioButton.Group>
      </View>
      <SearchFunc props={{ searchQuery, searchType }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingTop: 10
  },
  searchBar: {
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    elevation: 4
  }
});

export default Search;
