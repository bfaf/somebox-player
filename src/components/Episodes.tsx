import React, { ReactElement, useEffect, useState } from 'react';
import {
    StyleSheet,
    Modal,
    SafeAreaView,
    View,
    Text,
    Pressable,
    FlatList,
    Platform,
} from 'react-native';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { selectMovieById } from '../redux/slices/moviesSlice';
import { useNavigate } from 'react-router-dom';
// import { useNavigation } from '@react-navigation/native';

type EpisodeProps = {
    show: boolean;
    movieId: number;
    setShowModal: (showModal: boolean) => void;
};

const Episodes = ({ show = false, movieId, setShowModal }: EpisodeProps) => {
    const [itemFocus, setItemFocus] = useState({});
    const webNavigate = useNavigate();
    // const stackNavigate = useNavigation();
    const movieData = useSelector((state: RootState) =>
        selectMovieById(state, movieId),
    );
    const episodes = movieData && (movieData.moviesSeries || []);
    let sortedEpisodes = [...episodes || []];
    // if (episodes) {
    //     sortedEpisodes = episodes.sort((a, b) => {
    //         if (a.id > b.id) {
    //             return 1;
    //         }
    //         if (a.id < b.id) {
    //             return -1;
    //         }

    //         return 0;
    //     });
    // }

    useEffect(() => {
        return () => setItemFocus({});
    }, []);

    const onItemPress = (item): void => {
        console.log('Selected item id', item.id);
        if (Platform.OS === 'web') {
            webNavigate(`/video/${movieId}/${item.id}/false`);
        } else {
            // stackNavigate.navigate('Player', { movieId, continuePlaying: false });
        }
    };

    const onItemFocus = (item, isFocused: boolean): void => {
        setItemFocus({
            [item.filename]: isFocused,
        });
    };

    const renderItem = ({ item, index }: any): ReactElement<any, any> => {
        if (Platform.OS === 'web') {
            return (
                <Pressable style={itemFocus[item.filename] ? styles.buttonHovered : styles.button} onPress={() => onItemPress(item)} onHoverIn={() => onItemFocus(item, true)} onHoverOut={() => onItemFocus(item, false)}>
                    <Text>{item.filename}</Text>
                </Pressable>
            );
        }
        else {
            return (
                <Pressable style={itemFocus[item.filename] ? styles.buttonHovered : styles.button} onPress={() => onItemPress(item)} onFocus={() => onItemFocus(item, true)} onBlur={() => onItemFocus(item, false)} tvFocusable={index === 0}>
                    <Text>{item.filename}</Text>
                </Pressable>
            );
        }
    };

    return (
        <SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={show}
                onRequestClose={() => {
                    setShowModal(false);
                }}>
                <View style={styles.background}>
                    <View style={styles.content}>
                        <View>
                            <Text>Select an episode</Text>
                        </View>
                        <View style={styles.viewContent}>
                            <View>
                                <FlatList
                                    data={sortedEpisodes}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.filename}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        opacity: 0.5,
    },
    content: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flexDirection: 'column',
    },
    viewContent: {
        flexDirection: 'row',
    },
    button: {
        marginRight: 16,
        padding: 8,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    buttonHovered: {
        marginRight: 16,
        padding: 8,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#6200ee',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    buttonTextHovered: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});

export default Episodes;
