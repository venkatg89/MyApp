import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import {BaseSearch} from './BaseSearch';
import { getCurrentLocation } from './GeoLocationService';
import { PermissionsHelper } from './PermissionHelper';

const location = Platform.select({
  'android': PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  'ios': PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  'default': null as any
});

let permission: boolean = false

const SearchScreen = () => {
  const [searchItems, setSearchItems] = useState(() => [] as string[]);

  const onPressCurrentLocation = async () => {
    if(permission) {
      const response = await getCurrentLocation();
      console.log(response.address?.formattedAddress)
    } else {
      console.log('Permission denied.')
    }
  }

  useEffect(() => {
    const permissionAsync = async () => {
      permission = await PermissionsHelper.requestPermission(location, "Enable Location Services", `HxGN OnCall Mobile uses HxGN OnCall Dispatch | Tracker for location tracking when the app is in the foreground and background. This information is only used by the HxGN OnCall suite of products. \n\nPlease go to settings and set location permission to \"Allow all the time\" `);
    }
    permissionAsync();
  },[])

  const renderSearchItem = (searchItem: any) => {
    console.log(searchItem);
    return (
      <View
        style={{
          padding: 3,
          height: 50,
          borderBottomWidth: 0.5,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={require('./Images/search.png')}
          style={{width: 20, height: 20}}
        />
        <Text
          style={{
            fontSize: 20,
            textAlignVertical: 'center',
            color: '#0096FF',
            marginLeft: 5,
          }}>
          {searchItem.item}
        </Text>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      <BaseSearch
        key={'SearchContainer'}
        placeholderText={'Search by city, state or zip'}
        accessibilityLabel={'searchBar'}
        onSearchTextValueChange={(text: string) => {
          var newItems = [text, ...searchItems];
          setSearchItems(newItems);
        }}
      />
      <View
        style={{
          padding: 3,
          height: 50,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={require('./Images/search.png')}
          style={{width: 20, height: 20}}
        />
        <TouchableWithoutFeedback
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            onPressCurrentLocation();
          }}>
          <Text
            style={{
              fontSize: 14,
              textAlignVertical: 'center',
              color: '#0096FF',
            }}>
            {'Use current location'}
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View
        style={{
          backgroundColor: '#D3D3D3',
          padding: 10,
          height: 37,
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 14, textAlignVertical: 'center'}}>
          {'Recent Searches'}
        </Text>
      </View>
      <FlatList
        data={searchItems}
        renderItem={renderSearchItem}
        keyExtractor={(item: string, index: number) => (index + 1).toString()}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        style={{margin: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default SearchScreen;
