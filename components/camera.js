import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import styles from './style';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import { getResults } from '../store/results';

class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cameraPermission: null, scanned: false };
    this.handleBarCodeScanned = this.handleBarCodeScanned.bind(this);
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ cameraPermission: status });
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.props.getResults(data, this.props.bannedItems);
    this.props.navigation.navigate('Results');
  };

  render() {
    const { cameraPermission, scanned } = this.state;
    if (cameraPermission !== 'granted') {
      //navigate to settings
      return (
        <View style={styles.container}>
          <Text>Please turn on camera permissions for this app.</Text>
        </View>
      );
    }
    return (
      <View style={styles.barCodeScanner}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    bannedItems: state.bannedItems,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getResults: (barCode, bannedItems) =>
      dispatch(getResults(barCode, bannedItems)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Camera);
