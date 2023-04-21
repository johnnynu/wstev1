import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Title, Card, Paragraph, Appbar } from "react-native-paper";

const PantryItem = ({ route, navigation }) => {
  const { item } = route.params;
  const expirationDate = new Date(item.expirationDate.seconds * 1000);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={item.name} />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.name}</Title>
          <Paragraph>Expires: {expirationDate.toDateString()}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    margin: 20,
    marginTop: 40
  }
});

export default PantryItem;
