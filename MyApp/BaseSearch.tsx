import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  TextInput,
} from 'react-native';

/**
 * Interface containing the prop definitions for BaseSearch component
 * @prop {array} data - This prop accepts the array of objects on which serach action will be performed.
 * @prop {string | string[]} searchCriteria - This prop provides the search criteria in the given data.
 * @prop {function} getFilteredData - This functions takes a callback to return the filtered data based on serchCriteria and searchText.
 * @prop {function} onSearchTextValueChange - This function onchage search text a callback to return the searchText.
 * @prop placeholderText -This prop used to override the default palceholderText of the input.
 * @prop conatinerStyle - Optional style for the search container
 * @prop accessibilityLabel - accessibilityLabel used to be identified by the automation scripts.
 * @prop textAccessibilityLabel - accessibilityLabel used to be identified TextInput by the automation scripts.
 * @prop textInputContainerStyle - Optional style for the text input container
 */
export interface BaseSearchProps {
  searchCriteria: string | string[];
  placeholderText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  textAccessibilityLabel?: string;
  textInputContainerStyle?: StyleProp<ViewStyle>;
  onSearchTextValueChange?: (value: string) => void;
}

/**
 * State for BaseSearch component
 * @param {string} searchText - To maintain the text entered in search field
 */
export interface BaseSearchState {
  searchText: string;
}
/**
 * This is the BaseSearch component. Use this to get filtered data based the text entered.
 */
export class BaseSearch extends Component<BaseSearchProps, BaseSearchState> {
  /**
   * Sets Default Props
   */
  static defaultProps: Partial<BaseSearchProps> = {
    searchCriteria: '',
    accessibilityLabel: 'SearchAction',
    textAccessibilityLabel: 'SearchInput',
  };

  /**
   * Constructor for the BaseSearch class
   * @param {BaseSearchProps} props - Defined props passed as parameters
   */
  constructor(props: BaseSearchProps) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  render() {
    const {placeholderText, accessibilityLabel, textAccessibilityLabel} =
      this.props;
    const {searchText} = this.state;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View
          style={[
            styles.textInputContainer,
            this.props.textInputContainerStyle,
          ]}>
          <TextInput
            style={styles.textInput}
            value={searchText}
            onChangeText={(searchText: string) => {
              this.setState({searchText});
            }}
            placeholder={placeholderText || 'search'}
            accessibilityLabel={textAccessibilityLabel}
          />
          <TouchableWithoutFeedback
            accessibilityLabel={accessibilityLabel}
            onPress={() => {
              if (searchText !== '') {
                this.props.onSearchTextValueChange &&
                  this.props.onSearchTextValueChange(searchText);
              }
            }}>
            <Image
              source={require('./Images/search.png')}
              style={{width: 20, height: 20}}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.8,
    maxHeight: 54,
  },
  baseTextInputContainerStyle: {
    flex: 1,
  },
  textInput: {
    width: '100%',
  },
};
