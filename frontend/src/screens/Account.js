import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Appbar, List, Switch, Checkbox, Menu } from "react-native-paper";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase";

const Account = ({ navigation }) => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [calorieCount, setCalories] = React.useState(50);
    const [menuVisible, setMenuVisible] = React.useState(false);
    const [selections, setSelections] = React.useState({
        option1: false,
        option2: false,
        option3: false,
    });

    const toggleOption = (option) => {
        setSelections({ ...selections, [option]: !selections[option] });
    };

    const handleMenuPress = () => {
        setMenuVisible(true);
    };

    const handleMenuDismiss = () => {
        setMenuVisible(false);
    };

    // Reference to Firestore collection
    const collectionRef = collection(db, 'pantry');

    React.useEffect(() => {
        console.log('setting up listener...');
        const unsubscribe = onSnapshot(
            query(collectionRef, where('deleted', '==', true)),
            (snapshot) => {
                console.log('snapshot received:', snapshot);
                snapshot.docChanges().forEach((change) => {
                    console.log('document change:', change.type, change.doc.data());
                    // handle document changes here
                });
            },
            (error) => {
                console.error('error getting snapshot:', error);
            }
        );

        return () => {
            console.log('cleaning up listener...');
            unsubscribe();
        };
    }, []);
    // Watch for changes in the collection
    React.useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collectionRef, where("deleted", "==", true)),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "removed") {
                        console.log("item removed");
                        const deletedItem = change.doc.data();
                        // Check if the item expired and was removed or was consumed.
                        const currentDate = new Date();
                        const expiration = new Date(deletedItem.expirationDate);
                        console.log(expiration)
                        if (expiration > currentDate) {
                            setCalories((count) => count + deletedItem.number);
                        }
                    }
                });
            }
        );

        return unsubscribe;
    }, []);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        console.log
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Account" />
                <Appbar.Action icon="menu" onPress={handleMenuPress} />
                <Menu
                    visible={menuVisible}
                    onDismiss={handleMenuDismiss}
                    anchor={<Appbar.Action icon="dots-vertical" />}>
                    <Menu.Item
                        title="Today"
                        onPress={() => toggleOption('option1')}
                        checked={selections.option1}
                        status={selections.option1 ? 'checked' : 'unchecked'}
                    />
                    <Menu.Item
                        title="Past Week"
                        onPress={() => toggleOption('option2')}
                        checked={selections.option2}
                        status={selections.option2 ? 'checked' : 'unchecked'}
                    />
                    <Menu.Item
                        title="Past Month"
                        onPress={() => toggleOption('option3')}
                        checked={selections.option3}
                        status={selections.option3 ? 'checked' : 'unchecked'}
                    />
                </Menu>
            </Appbar.Header>

            <List.Section>
                <List.Item
                    title="Calories Consumed"
                    titleStyle={{ fontSize: 24 }}
                    right={() => (
                        <Switch
                            value={isEnabled}
                            onValueChange={toggleSwitch}
                        />
                    )}
                //   descriptionStyle={{ marginTop:  }}
                />
                {!isEnabled && (
                    <List.Item
                        title={calorieCount.toString()}
                        titleStyle={{ fontSize: 24, marginTop: -40 }}
                        description="Items"
                        descriptionStyle={{ marginLeft: 10 }}
                    />
                )}
            </List.Section>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to Wste</Text>
                <Text style={styles.subtitle}>
                    Manage your pantry and discover new recipes.
                </Text>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate("Pantry")}
                    style={styles.button}
                >
                    Go to Pantry
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },
    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 40
    },
    button: {
        width: "100%",
        alignSelf: "center"
    }
});

export default Account;
