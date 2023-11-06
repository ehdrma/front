import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const Learning = ({ route }) => {
    const { article } = route.params;
    const navigation = useNavigation();
    const [isTranslated, setIsTranslated] = useState(true);
    const [showOriginal, setShowOriginal] = useState(true);
    const [bodyContent, setBodyContent] = useState(article.body);
    const [isLoading, setIsLoading] = useState(false);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setBodyContent(showOriginal ? article.body : isTranslated ? article.translatedText : article.body);
    }, [showOriginal, isTranslated, article]);

    const handleMenuPress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleBackPress = () => {
        if (sound) {
            sound.unloadAsync(); // 화면을 벗어날 때 음원을 해제합니다.
        }
        navigation.goBack();
    };

    const handleTranslateToggle = async () => {
        setShowOriginal(!showOriginal);
    };

    const handlePlayAudio = async () => {
        setIsLoading(true);
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
                setIsPlaying(!isPlaying);
            } else {
                const response = await fetch('http://192.168.219.107:5000/text-to-speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: article.body,
                    }),
                });

                if (response.ok) {
                    const { audioUrl } = await response.json();
                    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
                    setSound(sound);
                    await sound.playAsync();
                    setIsPlaying(true);
                } else {
                    const errorResponse = await response.json();
                    Alert.alert('음성 변환 오류', errorResponse.error);
                }
            }
        } catch (error) {
            console.error('음성 변환 오류:', error);
            Alert.alert('음성 변환 오류', '음성 변환 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                    <Image source={require('./assets/menu.png')} style={styles.menu} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Image source={require('./assets/back.png')} style={styles.back} resizeMode="contain" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>
                    {showOriginal
                        ? article.title
                        : isTranslated
                        ? article.translatedTitle
                        : article.title}
                </Text>
                <View style={styles.bodyContainer}>
                    <Text style={styles.body}>
                        {bodyContent}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: isLoading ? '#d9d9d9' : isPlaying ? '#990011' : '#d9d9d9',
                            },
                        ]}
                        onPress={handlePlayAudio}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#990011" />
                        ) : (
                            <Text
                                style={[
                                    styles.buttonText,
                                    {
                                        color: isLoading ? '#ffffff' : isPlaying ? '#ffffff' : '#282828',
                                    },
                                ]}
                            >
                                {isLoading ? '음성 변환 중...' : isPlaying ? '일시 정지' : '원어 듣기'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: showOriginal ? '#d9d9d9' : isTranslated ? '#990011' : '#d9d9d9',
                            },
                        ]}
                        onPress={handleTranslateToggle}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: showOriginal ? '#282828' : isTranslated ? '#ffffff' : '#282828',
                                },
                            ]}
                        >
                            {showOriginal ? '번역 보기' : isTranslated ? '원문 보기' : '번역 보기'}
                        </Text>
                    </TouchableOpacity>
                    
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF6F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 85,
        marginBottom: 7,
    },
    menuButton: {
        left: 30,
        width: 40,
        height: 40,
    },
    backButton: {
        right: 25,
        width: 40,
        height: 40,
    },
    menu: {
        width: '100%',
        height: '100%',
    },
    back: {
        width: '100%',
        height: '100%',
    },
    scrollViewContent: {
        padding: 25,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        letterSpacing: 1,
    },
    bodyContainer: {
        backgroundColor: '#fff',
        padding: 23,
        borderRadius: 10,
        elevation: 5,
    },
    body: {
        fontSize: 16,
        letterSpacing: 1.5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    button: {
        borderRadius: 25,
        paddingVertical: 11,
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default Learning;
