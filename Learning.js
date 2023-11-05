import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, StatusBar, Dimensions, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Learning = ({ route }) => {
    const { article } = route.params;
    const navigation = useNavigation();

    const handleMenuPress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleBackPress = () => {
        navigation.goBack(); // 뒤로 가기
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                <Image source={require('./assets/menu.png')} style={styles.menu} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Image source={require('./assets/back.png')} style={styles.back} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.title}>{article.title}</Text>
            <View style={styles.bodyContainer}>
                <Text style={styles.body}>{article.body}</Text>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FCF6F5',
    },
    menuButton: {
        position: 'absolute',
        top: windowHeight * 0.1, // 메뉴 버튼의 원하는 위치 조정
        left: windowWidth * 0.07, // 메뉴 버튼의 원하는 위치 조정
    },
    menu: {
        width: windowWidth * 0.09,
        height: windowHeight * 0.047,
        zIndex: 1, // 다른 요소보다 위에 표시되도록 설정
    },

    backButton: {
        position: 'absolute',
        right: windowWidth * 0.06,
        top: windowHeight * 0.085,
    },
    back: {
        width: windowWidth * 0.11,
        height: windowHeight * 0.07,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 60,
        textAlign: 'center',
    },
    bodyContainer: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 10,
        elevation: 5,
    },
    body: {
        fontSize: 16,
    },
});

export default Learning;
