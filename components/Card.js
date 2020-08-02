import React, { Component, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { IconButton, Caption, Subheading, Title, Snackbar  } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Card(props) {
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const item = props.item

    useEffect(() => {
        
    }, [])

    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.card__cover}>
                <Image style={styles.coverImage} source={{ uri: item.image_url ? item.image_url : 'https://picsum.photos/240/340' }}></Image>
                <LinearGradient 
                    start={[0.5,0.5]}
                    colors={['#faa21d', '#f6cf06']}
                    style={styles.card__coverDesription}
                >
                    <IconButton
                    
                        style={styles.icon}
                        icon="calendar"
                        color="white"
                        size={26}

                    />
                    <Title style={styles.card__coverDesription_day}>12</Title>
                    <View> 
                        <Text style={styles.card__coverDesription_year}>ФЕВРАЛЯ</Text>
                        <Text style={styles.card__coverDesription_year}>2020</Text>
                    </View>

                </LinearGradient>
            </View>
            <View style={styles.card__info}>
                <View style={styles.card__header}>
                    <View style={styles.card__ratings}>
                        {[1, 2, 3, 4, 5].map(elem => {
                            return (
                               
                                    
                               
                                <IconButton
                                    style={styles.icon}
                                    icon={elem <= Math.round(item.rating) ?  "star" : "star-outline" }
                                    color="orange"
                                    size={26}
                                />
                              
                            )
                        })}
                    </View>
                    <Text>{item.rating}</Text>
                    <Caption> Оценки: {item.rating_count}</Caption>
                </View>
                <View style={styles.card__title}>
                    <Subheading>{item.title}</Subheading>
                </View>

                <View style={styles.card__footer}>
                    <IconButton
                        style={styles.icon}
                        icon={"clock-outline"}
                        color="#94a4b4"
                        size={26}
                        
                    />
                    <Text>{item.time_count ? item.time_count : 0} ч.</Text>

                </View>
            </View>

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginBottom: 30,
        width: '100%',
    },
    card__cover: {
        borderRadius: 8,
        overflow: 'hidden',
        width: 120,
        maxHeight:200,
        
    },
    coverImage: {
      height:'100%',
      width:'100%'
    },
    card__info: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        paddingHorizontal: 20,
        width: '100%',
       
        flex: 1,
    },
    card__title: {
        maxHeight:100,
        flex:1,
        overflow:'hidden',
        width: '100%',
    },
    card__header: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card__ratings: {
        flexDirection: 'row'
    },
    card__footer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    card__coverDesription: {
        height: 50,
        backgroundColor: 'orange',
        position: "absolute",
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    card__coverDesription_year:{
        fontSize:10,
        fontWeight:'bold',
        textAlign:'right'
    },
    card__coverDesription_day:{
        fontSize:24,
        marginLeft:-8,
        marginRight:8,
    },
    icon: {
        margin: 0,
        padding: 0,
        marginLeft: -10,
    },
    rating: {
        margin: 0,
        padding: 0
    }
})