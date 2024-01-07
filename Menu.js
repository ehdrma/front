import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SideMenu({ navigation }) {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home');

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Login' }
          ],
        })
      );
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const renderDrawerItem = (label, routeName) => {
    return (
      <View
        style={[
          styles.drawerItemContainer,
          selectedMenuItem === routeName && styles.selectedItemContainer,
        ]}
      >
        <DrawerItem
          label={label}
          labelStyle={{ fontSize: windowWidth * 0.05, color: '#282828', fontWeight: 'bold' }}
          onPress={() => {
            if (routeName === 'Review') {
              navigation.navigate('Review');
            } else {
              navigation.navigate(routeName);
            }
            setSelectedMenuItem(routeName);
          }}
        />
      </View>
    );
  };

  return (
    <DrawerContentScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar hidden={false} />
      <View style={{ backgroundColor: '#990011', paddingVertical: windowHeight * 0.08, paddingHorizontal: windowWidth * 0.05, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Text style={{ color: '#fff', fontSize: windowWidth * 0.07, fontWeight: 'bold' }}>안녕하세요!</Text>
        <Text style={{ color: '#fff', fontSize: windowWidth * 0.05, fontWeight: 'bold', marginTop: windowHeight * 0.0228 }}>권동금님.</Text>
      </View>
      <View style={{ marginTop: windowHeight * 0.03, paddingHorizontal: windowHeight * 0.02 }}>
        {renderDrawerItem('학습하기', 'Home')}
        {renderDrawerItem('복습하기', 'Review')}
        {renderDrawerItem('핵심 단어장', 'Vocabulary')}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: windowHeight * 0.03, marginLeft: windowWidth * 0.09 }}>
        <Text style={{ color: '#9b9b9b', fontSize: windowWidth * 0.04, fontWeight: 'bold' }} onPress={handleLogout}>로그아웃</Text>
        <View style={{ width: 2, height: windowHeight * 0.025, backgroundColor: '#d3d3d3', marginLeft: windowWidth * 0.025, borderRadius: 100 }}></View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerItemContainer: {
    marginBottom: windowHeight * 0.001,
  },
  selectedItemContainer: {
    backgroundColor: 'rgba(153, 0, 17, 0.15)',
    borderRadius: 10, 
  },
});