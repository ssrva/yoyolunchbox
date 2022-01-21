import * as React from 'react'
import { useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Text, View } from '../../components/Themed'
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const styles = StyleSheet.create({
    main: {
        backgroundColor: "white",
        flex: 1,
        display: "flex",
        flexDirection: "column-reverse"
    },
    map: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderColor: "#D1D1D1",
        borderWidth: 1
    },
    container: {
        
    },
    dataContainer: {
        margin: 20,
        padding: 10,
        shadowColor: "#171717",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderRadius: 5
    },
    title: {
        fontWeight: "600",
        color: "#696969",
        marginBottom: 10
    }
});

const AddAddress = (props) => {

    const [userCoordinates, setUserCoordinates] = useState<Object>({
        latitude: 13.067439, longitude: 80.237617
    })

    return (
        <View style={styles.main}>
            <MapView
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: userCoordinates.latitude,
                    longitude: userCoordinates.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
                onPress={(coordinates) => {
                    setUserCoordinates({
                    latitude: coordinates.nativeEvent.coordinate.latitude,
                    longitude: coordinates.nativeEvent.coordinate.longitude
                    })
                }}
                style={styles.map}>
            <Marker
                coordinate={{
                latitude : userCoordinates.latitude ,
                longitude : userCoordinates.longitude
                }}
                title="User Location"/>
            </MapView>
            
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
                <View style={styles.dataContainer}>
                    <Text style={styles.title}>Fill your address below</Text>
                    <Input
                        multiline
                        textStyle={{ height: 64 }}
                        placeholder="Full address" />
                    <Button>Add address</Button>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

export default AddAddress;
