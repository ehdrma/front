import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Learning = ({ route }) => {
    const { article } = route.params;
    const navigation = useNavigation();
    const [isTranslated, setIsTranslated] = useState(true);
    const [showOriginal, setShowOriginal] = useState(true);
    const [bodyContent, setBodyContent] = useState(article.body);

    useEffect(() => {
        setBodyContent(showOriginal ? article.body : isTranslated ? article.translatedText : article.body);
    }, [showOriginal, isTranslated, article]);

    const handleMenuPress = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleBackPress = () => {
        navigation.goBack();
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
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                <TouchableOpacity
                    style={styles.translateButton}
                    onPress={() => setShowOriginal(!showOriginal)}
                >
                    <View style={[styles.translateButtonInner, { backgroundColor: showOriginal ? '#990011' : '#d9d9d9' }]}>
                        <Text style={[styles.translateButtonText, { color: showOriginal ? '#ffffff' : '#282828' }]}>
                            {showOriginal ? '번역보기' : isTranslated ? '원문보기' : '번역보기'}
                        </Text>
                    </View>
                </TouchableOpacity>
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
    translateButton: {
        marginTop: 15,
        alignSelf: 'flex-end',
    },
    translateButtonInner: {
        borderRadius: 25,
        paddingVertical: 11,
        paddingHorizontal: 16,
    },
    translateButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default Learning;
