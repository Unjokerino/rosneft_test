import React, { Component, useEffect, useState, useRef } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Animated, TouchableNativeFeedback, ActivityIndicator, RefreshControl } from 'react-native'
import { Snackbar, Button, withTheme, IconButton, Title } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card'

const HEADER_HEIGHT = 70
const MAIN_COLOR = '#292F38'
const BORDER_RAIUS = 20

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

function HomeScreen(props) {
    const { colors } = props.theme;
    const [collapsed, setcollapsed] = useState(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [cards, setcards] = useState([])
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await getData()
        setRefreshing(false);
    }, []);

    const onToggleSnackBar = () => setSnackbarVisible(!snackbarVisible);

    const onDismissSnackBar = () => setSnackbarVisible(false);

    const renderCard = ({ item }) => (
        <Card item={item} />
    );

    useEffect(() => {
        fadeIn()
        onRefresh()
    }, [])

    const lazyLoad = async () => {

        setcards([...cards, {
            id: Math.random(),
            title: 'Тестовая карточка'
        }])
    }

    const getData = async () => {

        try {
            let response = await fetch("http://jsgod.ru/api/get_courses")
            let json = await response.json()
            setcards(json)
        } catch (error) {
            setSnackbarMessage('Ошибка загрузки')
            setSnackbarVisible(true)
        }
        setcollapsed(true)
        fadeIn()

    }

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(setcollapsed(!collapsed))

    };

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => setcollapsed(!collapsed));
    };


    return (
        <View style={styles.container}>

            <View style={styles.appbar}></View>
            <View style={styles.header}>

                <LinearGradient
                    start={[0.5, 0.5]}
                    colors={['#faa21d', '#f6cf06']}
                    style={styles.header__shadow} />

                <View style={styles.header__content}>

                    <IconButton
                        icon="arrow-left"
                        color="#fff"
                        size={25}
                        onPress={() => console.log('Pressed')}
                    />
                    <Text style={[styles.text, styles.headerText, styles.header__text]}>Конфигуратор карьеры</Text>
                </View>
            </View>
            <View style={styles.player}>
                <TouchableOpacity style={styles.player__button}>
                    <IconButton

                        icon="play"
                        color="#0ca0c7"
                        size={26}
                        onPress={() => console.log('Pressed')}
                    />
                </TouchableOpacity>
                <View style={styles.player__info}>
                    <Text style={[styles.text, styles.player__text]}>Как построить карьеру в условиях Компании</Text>
                    <Text style={[styles.text, styles.player__text]}>4 мин. 30 сек.</Text>
                </View>
            </View>

            <TouchableNativeFeedback onPress={() => {
                collapsed ? fadeOut() : fadeIn()

            }}>
                <View style={styles.subHeader}>
                    <Text style={[styles.text, styles.headerText, styles.subHeader__text]}>Конфигуратор карьеры</Text>
                    <Animated.View
                        style={[styles.collapsButton,
                        {
                            transform: [{
                                rotate: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "180deg"]
                                }),
                                scale: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1]
                                }),
                            }]
                        }]}>

                        <IconButton
                            style={[styles.collapsButton__icon]}
                            icon={"chevron-up"}
                            color="#94a4b4"
                            size={26}

                        />
                    </Animated.View>
                </View>
            </TouchableNativeFeedback>

            <Animated.View style={[{
                opacity: fadeAnim
            }, !collapsed && styles.hidden, styles.cardsContainer]}>

                <Title style={styles.title}>Рекомендации</Title>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    data={cards}
                    keyExtractor={item => item.id}
                    onEndReached={lazyLoad}
                    onEndReachedThreshold={20}
                    renderItem={renderCard}

                />
            </Animated.View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Еще раз',
                    onPress: () => {
                        onRefresh()
                    },
                }}>
                {snackbarMessage}
            </Snackbar>



        </View>
    )

}

export default withTheme(HomeScreen);


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F6FC',
        flex: 1,

    },
    appbar: {
        height: 25,
        width: '100%',
        backgroundColor: MAIN_COLOR

    },
    hidden: {
        display: 'none'
    },
    collapsButton: {
        position: 'absolute',
        bottom: -25,
        left: '46%',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F6FC'

    },
    collapsButton__icon: {

        backgroundColor: MAIN_COLOR
    },
    headerText: {

    },
    title: {
        marginBottom: 10,
        marginBottom: 20
    },
    header: {

        position: 'relative',
        height: HEADER_HEIGHT,
    },
    header__content: {

        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: MAIN_COLOR,
        height: HEADER_HEIGHT - 8,
        alignItems: 'center',

        paddingHorizontal: 15,
        borderBottomLeftRadius: BORDER_RAIUS,
        borderBottomRightRadius: BORDER_RAIUS,
    },
    header__shadow: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: HEADER_HEIGHT,
        borderBottomLeftRadius: BORDER_RAIUS,
        borderBottomRightRadius: BORDER_RAIUS,
    },
    header__text: {
        color: '#fff'
    },
    player: {
        flexDirection: 'row',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',

    },
    player__info: {
        width: '80%',
        paddingHorizontal: 10
    },
    player__text: {
        flexWrap: 'wrap'
    },
    player__button: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        backgroundColor: '#fff',
        elevation: 3,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        justifyContent: 'center',
    },
    subHeader: {
        height: HEADER_HEIGHT * 1.2,
        backgroundColor: MAIN_COLOR,
        borderRadius: BORDER_RAIUS,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    subHeader__text: {
        color: '#fff'
    },
    cardsContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 40
    },

})