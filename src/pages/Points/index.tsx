import React, { useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Alert
} from 'react-native';
import {
  requestPermissionsAsync as locationRequestPermissionsAsync,
  getCurrentPositionAsync as locationGetCurrentPositionAsync,
} from 'expo-location';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SvgUri } from 'react-native-svg';
import IItem from '../../interfaces/entities/IItem';
import IPoint from '../../interfaces/entities/IPoint';
import PointRepository from '../../repositories/PointRepository';
import ItemRepository from '../../repositories/ItemRepository';
import IPointsRoutesParams from '../../interfaces/routeParams/IPointsRouteParams';
import styles from './styles';

const Points = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { city, uf } = route.params as IPointsRoutesParams;

  const pointRepository = new PointRepository;
  const itemRepository = new ItemRepository;

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [items, setItems] = useState<IItem[]>([]);
  const [points, setPoints] = useState<IPoint[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    itemRepository.list().then(items => {
      setItems(items);
    });
  }, []);

  useEffect(() => {
    pointRepository.list(city, uf, selectedItems).then(points => {
      setPoints(points);
    });
  }, [selectedItems]);
  

  useEffect(() => {
    async function loadPosition() {
      const { status } = await locationRequestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Oops!', 'Precisamos da sua permissão para carregar sua localização');
        return;
      }

      const location = await locationGetCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);
  
  
  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(pointId: number) {
    navigation.navigate('Detail', { pointId });
  }

  function handleSelectItem(itemId: number) {
    const alreadySelected = selectedItems.findIndex(item => item === itemId) >= 0;

    if (alreadySelected) {
      const fielteredItems = selectedItems.filter(item => item !== itemId);
      setSelectedItems(fielteredItems);
    } else {
      setSelectedItems([ ...selectedItems, itemId ]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79"/>
        </TouchableOpacity>

        <Text style={styles.title}>😄 Bem Vindo!</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {
            initialPosition[0] !== 0 && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}
              >
                {
                  points.map(point => (
                    <Marker
                      key={String(point.id)}
                      style={styles.mapMarker}
                      onPress={() => handleNavigateToDetail(point.id)}
                      coordinate={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}
                    >
                      <View style={styles.mapMarkerContainer}>
                        <Image style={styles.mapMarkerImage} source={{uri: point.image}}/>
                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                      </View>
                    </Marker>
                  ))
                }
              </MapView>
            )
          }
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {
            items.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {},
                ]}
                activeOpacity={0.6}
                onPress={() => handleSelectItem(item.id)}
              >
                <SvgUri width={42} height={42} uri={item.image_url}/>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

export default Points;