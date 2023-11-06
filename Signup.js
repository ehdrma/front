import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const Signup = ({}) => {
    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://172.30.72.8:5000/api/signup', {
                email: email,
                password: password,
            });

            // 회원가입 성공 처리
            navigation.navigate('SignComplete');
        } catch (error) {
            // 회원가입 실패 처리
            Alert.alert('회원가입 실패', '이미 가입된 이메일 주소입니다.');
        }
    };

    const handleBackPress = () => {
        navigation.goBack(); // 뒤로 가기
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>회원가입</Text>

            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Image source={require('./assets/back.png')} style={styles.back} resizeMode="contain" />
            </TouchableOpacity>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>이메일</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="이메일을 입력하세요."
                        onChangeText={setEmail} value={email} />
                </View>
            </View>

            <Text style={styles.inputLabel}>비밀번호</Text>
            <TextInput
                style={styles.textInput}
                placeholder="비밀번호를 입력하세요."
                secureTextEntry={true}
                onChangeText={setPassword} value={password} />
            <TextInput
                style={styles.textInput}
                placeholder="비밀번호를 다시 한번 입력하세요."
                secureTextEntry={true}
            />

            <View style={styles.space}></View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>가입하기</Text>
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
        paddingTop: windowHeight * 0.15,
    },
    header: {
        color: '#990011',
        fontSize: windowWidth * 0.06,
        fontWeight: '800',
        alignSelf: 'flex-start',
        marginBottom: windowHeight * 0.05,
    },
    backButton: {
        position: 'absolute',
        right: windowWidth * 0.1,
        top: windowHeight * 0.142,
    },
    back: {
        width: windowWidth * 0.09,
        height: windowHeight * 0.05,
    },
    formContainer: {
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        marginBottom: windowHeight * 0.02,
    },
    inputLabel: {
        color: '#6e686c',
        fontSize: windowWidth * 0.04,
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: windowWidth * 0.01,
        marginTop: windowHeight * 0.01,
    },
    textInput: {
        width: '100%',
        height: windowHeight * 0.065,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 7,
        marginTop: windowHeight * 0.007,
        paddingHorizontal: windowWidth * 0.02,
        fontSize: windowWidth * 0.04,
    },
    space: {
        height: windowHeight * 0.15,
    },
    signupButton: {
        width: '100%',
        height: windowHeight * 0.065,
        backgroundColor: '#fcf6f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    signupButtonText: {
        color: '#990011',
        fontSize: windowWidth * 0.04,
        fontWeight: 'bold',
    },
});

export default Signup;
