import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import { CommonActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SideMenu({ navigation }) {
  const handleLogout = async () => {
    try {
      // AsyncStorage에서 사용자 정보 제거 (로그아웃)
      await AsyncStorage.removeItem('userToken');
      // 로그인 화면으로 이동
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Login' } // 로그인 화면으로 이동
          ],
        })
      );
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <DrawerContentScrollView style={{ flex: 1, backgroundColor: '#fff'}}>
  <StatusBar hidden={false} />
  <View style={{ backgroundColor: '#990011',  paddingVertical: windowHeight * 0.035, paddingHorizontal: windowWidth * 0.05, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
</View>
  <View style={{ marginTop: windowHeight * 0.03, paddingHorizontal: windowHeight * 0.02 }}>
    {/* 메뉴 항목 */}
    <DrawerItem
      label="학습하기"
      labelStyle={{ fontSize: windowWidth * 0.05, color: '#282828', fontWeight: 'bold' }}
      onPress={() => navigation.navigate('Home')}
      style={{ width: windowWidth * 0.8 }}
    />
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: windowHeight * 0.03, marginLeft: windowWidth * 0.09 }}>
    <Text style={{ color: '#9b9b9b', fontSize: windowWidth * 0.04, fontWeight: 'bold' }} onPress={handleLogout}>로그아웃</Text>
    <View style={{ width: 2, height: windowHeight * 0.025, backgroundColor: '#d3d3d3', marginLeft: windowWidth * 0.025, borderRadius: 100 }}></View>
  </View>
</DrawerContentScrollView>
  );
}
