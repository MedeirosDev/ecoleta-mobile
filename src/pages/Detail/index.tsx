import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { composeAsync as MailComposerComposeAsync } from 'expo-mail-composer';
import PointRepository from '../../repositories/PointRepository';
import IPoint from '../../interfaces/entities/IPoint';
import IDetailRouteParams from '../../interfaces/routeParams/IDetailRouteParams';
import styles from './styles';

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pointId } = route.params as IDetailRouteParams;

  const pointRepository = new PointRepository;
  const [point, setPoint] = useState<IPoint>({} as IPoint);

  
  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleWhatsappClick() {
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text=Tenho interesse em coleta de resíduos`);
  }

  function handleMailClick() {
    MailComposerComposeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [ point.email ],
    })
  }

  useEffect(() => {
    pointRepository.get(pointId).then(point => {
      setPoint(point);
    })
  }, []);

  if (!point) {
    return <View />
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34CB79"/>
          </TouchableOpacity>

          <Image style={styles.pointImage} source={{uri: point.image}}/>

          <Text style={styles.pointName}>{point.name}</Text>
          { point.items && (
              <Text style={styles.pointItems}>
                { point.items.map(item => item.title).join(', ') }
              </Text>
          ) }

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>{point.city}, {point.uf}</Text>
          </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsappClick}>
          <FontAwesome name="whatsapp" size={20} color="#FFFFFF"/>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleMailClick}>
          <Icon name="mail" size={20} color="#FFFFFF"/>
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
};

export default Detail;