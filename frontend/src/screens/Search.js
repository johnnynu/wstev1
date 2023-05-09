import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Searchbar, Appbar, RadioButton } from "react-native-paper";
import SearchFunc from "../components/SearchFunc";
import { db } from "../components/firebase";
import {
    collection,
    getDocs,
} from "firebase/firestore";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("ingredients");

    const onChangeSearch = (query) => setSearchQuery(query);

    const onSearchTypeChange = (type) => setSearchType(type);

    const handleButtonClick = async () => {
        const currentDate = new Date();
        const threeWeeksFromNow = new Date(currentDate.getTime() + (21 * 24 * 60 * 60 * 1000));
        const pantryRef = collection(db, "pantryDev");
        const snapshot = await getDocs(pantryRef);
        const expiringItems = snapshot.docs.filter(
            (doc) => doc.data().expirationDate.toDate() <= threeWeeksFromNow
        );
        const query = expiringItems.reduce(
            (accumulator, currentItem) => `${accumulator} ${currentItem.data().name}`,
            ""
        ).trim();
        setSearchQuery(query);
    };

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
                <TouchableOpacity onPress={handleButtonClick} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Prioritize Expiring Items For Me!
                    </Text>
                </TouchableOpacity>
            </View>
            <SearchFunc props={{ searchQuery, searchType }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    searchContainer: {
        paddingHorizontal: 10,
        paddingTop: 10
    },
    searchBar: {
        borderRadius: 25,
        backgroundColor: "#f0f0f0",
        elevation: 4
    },
    button: {
        backgroundColor: "#3498db",
        width: "75%",
        borderRadius: 25,
        padding: 15,
        margin: 25,
        alignSelf: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"

    }
});

export default Search;
