import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Button, View, ScrollView, TextInput, Platform, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [cards, setCards] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const createNewCard = () => {
    setCards([...cards, { images: [], title: '', description: '' }]);
  };

  const addImageToCard = async (cardIndex) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Image Picker Result:', result); // Log the entire result

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Image URI:', uri); // Log the URI
      const newCards = [...cards];
      newCards[cardIndex].images.push(uri);
      setCards(newCards);
    }
  };

  const updateCardText = (cardIndex, field, value) => {
    const newCards = [...cards];
    newCards[cardIndex][field] = value;
    setCards(newCards);
  };

  const handleImagePress = (uri) => {
    setEnlargedImage(uri);
  };

  const handleCloseModal = () => {
    setEnlargedImage(null);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {cards.map((card, index) => (
          <ThemedView key={index} style={styles.cardContainer}>
            <TextInput
              style={styles.cardTitle}
              placeholder="Product Title"
              value={card.title}
              onChangeText={(text) => updateCardText(index, 'title', text)}
            />
            <TextInput
              style={styles.cardDescription}
              placeholder="Product description goes here. It can be a brief detail about the product."
              value={card.description}
              onChangeText={(text) => updateCardText(index, 'description', text)}
              multiline
            />
            <View style={styles.imageGrid}>
              {card.images.map((imageUri, imgIndex) => (
                <TouchableOpacity key={imgIndex} onPress={() => handleImagePress(imageUri)}>
                  <Image source={{ uri: imageUri }} style={styles.cardImage} />
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Add Image" onPress={() => addImageToCard(index)} />
            <View style={styles.buttonContainer}>
              <Button title="Buy" onPress={() => {}} />
              <Button title="Ask Price" onPress={() => {}} />
            </View>
          </ThemedView>
        ))}
        <Button title="Create a New Good" onPress={createNewCard} style={styles.createNewGoodButton} />
      </ScrollView>
      {enlargedImage && (
        <Modal transparent={true} visible={true} onRequestClose={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalBackground} onPress={handleCloseModal}>
              <Image source={{ uri: enlargedImage }} style={styles.enlargedImage} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  cardContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  createNewGoodButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  enlargedImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
});