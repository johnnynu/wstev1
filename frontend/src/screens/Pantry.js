import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Modal } from "react-native";
import {
    Button,
    Card,
    Title,
    Paragraph,
    Appbar,
    IconButton,
    TouchableRipple
} from "react-native-paper";
import { app, db } from "../components/firebase";
import {
    collection,
    orderBy,
    getDocs,
    doc,
    deleteDoc
} from "firebase/firestore";

const Pantry = ({ navigation }) => {
    const [pantryItems, setPantryItems] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "pantryDev"),
                    orderBy("expirationDate")
                );
                const items = [];
                const expiring = [];
                const currentDate = new Date();
                querySnapshot.forEach((doc) => {
                    const itemData = { id: doc.id, ...doc.data() };
                    items.push(itemData);
                    const expirationDate = new Date(
                        itemData.expirationDate.seconds * 1000
                    );
                    const timeDiff = expirationDate.getTime() - currentDate.getTime();
                    const daysDiff = timeDiff / (1000 * 3600 * 24);
                    if (daysDiff <= 21) {
                        expiring.push(itemData);
                    }
                });
                setPantryItems(items);
                setExpiringItems(expiring);
            } catch (error) {
                console.error("Error getting documents: ", error);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "pantryDev", id));
            setPantryItems(pantryItems.filter((item) => item.id !== id));
            setExpiringItems(pantryItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    const handleModalClose = (response, item) => {
        try {
            console.log("before first item");
            setShowModal(true);
            
            console.log("after first item");
            if (response === "No") {
                handleDelete(item.id);

            } else if (response === "Yes") {
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error in the closing Modal ", error);
        }


    }

    const renderItem = ({ item }) => {
        const expirationDate = new Date(item.expirationDate.seconds * 1000);
        const timeDiff = expirationDate.getTime() - new Date().getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        return (
            <>
                <TouchableRipple
                    onPress={() => navigation.navigate("PantryItem", { item })}
                    style={styles.card}
                >
                    <Card>
                        <Card.Content style={styles.cardContent}>
                            <View style={styles.itemInfo}>
                                <Title style={styles.itemTitle}>{item.name}</Title>
                                <Paragraph style={styles.itemDate}>
                                    Expires: {expirationDate.toDateString()}
                                </Paragraph>
                            </View>
                            <IconButton
                                icon="close"
                                size={20}
                                onPress={() => handleDelete(item.id)}
                                style={styles.deleteButton}
                            />
                        </Card.Content>
                    </Card>
                </TouchableRipple>

            </>
        );
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Your Pantry" />
            </Appbar.Header>
            {pantryItems.length === 0 ? (
                <View style={styles.emptyPantryContainer}>
                    <Image
                        source={require("./IceCreamDoodle.png")}
                        style={{ width: 200, height: 200 }}
                    />
                    <Text style={styles.title}>Your Pantry is Empty!</Text>
                    <Text style={styles.subtitle}>
                        Get started by adding items to your pantry.
                    </Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={pantryItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                        {expiringItems.map((item) => {
                            const expirationDate = new Date(item.expirationDate.seconds * 1000);
                            const timeDiff = expirationDate.getTime() - new Date().getTime();
                            const daysDiff = timeDiff / (1000 * 3600 * 24);
                            console.log(item.name);
                            if (daysDiff <= 21) {
                                return (
                                    <Modal
                                        key={item.id}
                                        visible={showModal}
                                        transparent={true}
                                    >
                                        <View style={styles.centeredView}>
                                            <View style={styles.modalView}>
                                                <Text style={styles.modalText}>
                                                    Is {item.name} still in stock?
                                                </Text>
                                                <Button
                                                    onPress={() => {
                                                        handleModalClose("Yes", item);
                                                        
                                                    }}
                                                    style={styles.modalButton}
                                                >
                                                    Yes
                                                </Button>
                                                <Button
                                                    onPress={() => {
                                                        handleModalClose("No", item);
                                                    }}
                                                    style={styles.modalButton}
                                                >
                                                    No
                                                </Button>
                                            </View>
                                        </View>
                                    </Modal>
                                );
                            } else {
                                return null;
                            }
                        })}
                          
                </>
            )}
            <Button
                mode="contained"
                onPress={() => navigation.navigate("AddItem")}
                style={styles.addButton}
            >
                Add Items
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    emptyPantryContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    },
    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20
    },
    addButton: {
        width: "100%", // Set the button width to 80% of the screen width
        alignSelf: "center", // Align the button to the center
        marginTop: 20,
        marginBottom: 10
    },
    list: {
        width: "100%",
        marginTop: 10
    },
    listContent: {
        paddingBottom: 20
    },
    card: {
        marginBottom: 10,
        marginHorizontal: 20
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemInfo: {
        flexDirection: "column"
    },
    itemDate: {
        fontSize: 14,
        color: "#999"
    },
    deleteButton: {
        position: "absolute",
        top: 0,
        right: 0,
        margin: 0
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    modalButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    modalButton: {
        width: "45%",
    }
});

export default Pantry;