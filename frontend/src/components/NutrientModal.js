import React from "react";
import { Modal, Button, StyleSheet, Text, View } from "react-native";

// NutrientModal component that takes in props
const NutrientModal = ({ visible, nutrientData, onClose }) => {

  // Return a Modal component with the following content
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        {/* Title for the nutrient modal */}
        <Text style={styles.nutrientTitle}>Nutrient Information</Text>
        
        {/* Nutrient list */}
        {nutrientData && (
          <View style={styles.nutrientList}>
            {/* Iterate over each nutrient object in nutrientData */}
            {nutrientData.map((nutrient, index) => (
              <View style={styles.nutrientItem} key={index}>
                {/* Nutrient name */}
                <Text style={styles.nutrientName}>{nutrient.nutrientName}</Text>

                {/* Nutrient value and unit container */}
                <View style={styles.nutrientValueUnitContainer}>
                  {/* Nutrient value */}
                  <Text style={styles.nutrientAmount}>{nutrient.value.toFixed(2)}</Text>
                  {/* Nutrient unit */}
                  <Text style={styles.nutrientUnit}>{nutrient.unitName}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Button to close the modal */}
        <View style={styles.buttonContainer}>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

// Styles for the components in the NutrientModal component
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
    paddingTop: 30,
  },
  
  nutrientList: {
    alignItems: "center",
  },
  nutrientTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#5D3FD3",
  },
  nutrientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  nutrientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5D3FD3",
  },
  nutrientValueUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutrientAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  nutrientUnit: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#5D3FD3",
    borderRadius: 4,
    paddingVertical: 10,
  },
  buttonTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// Export the NutrientModal component
export default NutrientModal;
