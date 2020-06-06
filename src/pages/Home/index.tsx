import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  ImageBackground,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import styles, { stylesSelectPicker } from './styles';
import PickerSelect from 'react-native-picker-select';
import IbgeRepository from '../../repositories/IbgeRepository';
import IPickerSelectItem from '../../interfaces/entities/IPickerSelectItem';

const homeBackground = require('../../assets/home-background.png');
const logo = require('../../assets/logo.png');

const Home = () => {
  const navigation = useNavigation();

  const ibgeRepository = new IbgeRepository;

  const [ufs, setUfs] = useState<IPickerSelectItem[]>([]);
  const [cities, setCities] = useState<IPickerSelectItem[]>([]);
  
  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');

  useEffect(() => {
    ibgeRepository.getUfs().then(ufs => {
      const serialized = ufs.map(uf => {
        return {
          value: uf.uf,
          label: uf.name,
        };
      });

      setUfs(serialized);
    })
  }, []);

  useEffect(() => {
    ibgeRepository.getCitiesByUf(selectedUf).then(cities => {
      const serialized = cities.map(city => {
        return {
          value: city.name,
          label: city.name,
        };
      });
      setCities(serialized);
    });
  }, [selectedUf]);

  function handleChangeUf(value: string, index: number) {
    setSelectedUf(value);
  }

  function handleChangeCity(value: string, index: number) {
    setSelectedCity(value);
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf,
    });
  }

  return (
    <ImageBackground
      source={homeBackground}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={logo}/>
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>

      <PickerSelect
        style={stylesSelectPicker}
        onValueChange={handleChangeUf}
        placeholder={{value: '0', label: 'Selecione o Estado', }}
        items={ufs}
      />

      <PickerSelect
        style={stylesSelectPicker}
        onValueChange={handleChangeCity}
        placeholder={{value: '0', label: 'Selecione a Cidade', }}
        items={cities}
      />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
            <Icon name="arrow-right" color="#FFFFFF"/>
            </Text>
          </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;