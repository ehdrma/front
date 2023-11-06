import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // AsyncStorage에서 사용자 정보를 확인하여 로그인 상태인지 체크
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // 사용자 정보가 있다면 Home 화면으로 이동 (자동 로그인)
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('자동 로그인 중 오류 발생:', error);
      }
    };

    // 화면이 마운트될 때 드로어를 닫음
    navigation.dispatch(DrawerActions.closeDrawer());

    // 자동 로그인 체크 함수 호출
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.30.72.8:5000/api/login', {
        email: email,
        password: password,
      });

      // 로그인 성공 시 사용자 정보를 AsyncStorage에 저장 (자동 로그인을 위해)
      await AsyncStorage.setItem('userToken', 'userTokenValue');

      // 로그인 성공 처리
      navigation.navigate('Home');

    } catch (error) {
      // 로그인 실패 처리
      Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/newnihon_logo.png')} style={styles.logo} />

      <Text style={styles.customText}>언어 학습과 현지 사회에 대한 이해를 한 번에!</Text>

      <View style={styles.space1}></View>

      <TextInput style={styles.textInput} placeholder="이메일을 입력하세요." onChangeText={setEmail} value={email} />
      <TextInput style={styles.textInput} placeholder="비밀번호를 입력하세요." secureTextEntry onChangeText={setPassword} value={password} />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.space2}></View>

      <TouchableOpacity onPress={navigateToSignup}>
        <Text style={styles.additionalText}>회원가입이 필요한가요?</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.22,
  },
  logo: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.05,
  },
  customText: {
    color: '#990011',
    fontSize: windowWidth * 0.04,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: windowHeight * 0.02,
  },
  additionalText: {
    color: '#6e686c',
    fontSize: windowWidth * 0.038,
    fontWeight: '600',
    marginTop: windowHeight * 0.02,
  },
  textInput: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.065,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 7,
    marginTop: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.02,
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.005,
  },
  loginButton: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.065,
    backgroundColor: '#fcf6f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.025,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#990011',
    fontSize: windowWidth * 0.045,
    fontWeight: 'bold',
  },
  space1: {
    height: windowHeight * 0.05,
  },
  space2: {
    height: windowHeight * 0.24,
  },
});

export default Login;
