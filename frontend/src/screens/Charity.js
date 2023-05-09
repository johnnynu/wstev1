import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

// MapScreen component
const Charity = () => {
  // State variables
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [charities, setCharities] = useState([]);
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  
  // Ref for the MapView component
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Request permission to access user's location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Function to handle searching for nearby charities
  const handleSearch = async (latitude, longitude) => {
    try {
      // Send a GET request to the Google Places API to get nearby charities
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&keyword=charity&type=point_of_interest&key=AIzaSyCHajOPzQ21YPdBdR8O3dSdco4KhokQAoY`
      );
      // Update the charities state variable with the response data
      setCharities(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle changes to the address TextInput
  const handleAddressChange = (value) => {
    setAddress(value);
  };

  // Function to handle changes to the zip TextInput
  const handleZipChange = (value) => {
    setZip(value);
  };

  // Function to handle searching for a location by address
  const handleSearchByAddress = async () => {
    if (!address) return;
  
    try {
      // Send a GET request to the Google Geocoding API to get the latitude and longitude of the entered address
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&region=us&key=AIzaSyCHajOPzQ21YPdBdR8O3dSdco4KhokQAoY`;
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry.location;
      // Set the location state variable to the latitude and longitude of the entered address
      setLocation({ coords: { latitude: lat, longitude: lng } });
      // Search for nearby charities based on the latitude and longitude of the entered address
      handleSearch(lat, lng);
      // Animate the MapView to the location of the entered address
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle searching for a location by zip code
  const handleSearchByZip = async () => {
    if (!zip) return;
  
    try {
      // Send a GET request to the Google Geocoding API to get the latitude and longitude of the entered zip code
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&region=us&key=AIzaSyCHajOPzQ21YPdBdR8O3dSdco4KhokQAoY`;
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry.location;
      // Search for nearby charities based on the latitude and longitude of the entered zip code
      setLocation({ coords: { latitude: lat, longitude: lng } });
      handleSearch(lat, lng);
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    //Styles
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          // Set the initial region to the user's current location
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // Iterate over each charity and create a Marker for it
        >
          {charities.map((charity) => (
            <Marker
              key={charity.place_id}
              coordinate={{
                latitude: charity.geometry.location.lat,
                longitude: charity.geometry.location.lng,
              }}
              title={charity.name}
              description={charity.vicinity}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      <View style={{ position: 'absolute', top: 50, left: 20, right: 20 }}>
        <TextInput
          placeholder="Enter your address"
          value={address}
          onChangeText={handleAddressChange}
        />
        <Button title="Search by Address" onPress={handleSearchByAddress} />
        <TextInput
          placeholder="Enter your zip code"
          value={zip}
          onChangeText={handleZipChange}
        />
        <Button title="Search by Zip Code" onPress={handleSearchByZip} />
      </View>
    </View>
  );
};

export default Charity;
