import React, { Component } from 'react';
import Paho from 'paho-mqtt';

class App extends Component {
  // TODO(SW): Move the client config into a separate file
  client = new Paho.Client(process.env.REACT_APP_MQTT_BROKER_URL, 3033, 'dashboard');

  state = {
    thermometer: '',
    barometer: '',
    hygrometer: '',
  };

  handleSuccessfulConnect = () => {
    console.log('Connected to MQQT broker');

    this.client.subscribe('bme:thermometer');
    this.client.subscribe('bme:barometer');
    this.client.subscribe('bme:hygrometer');
  };

  handleIncomingMessage = (message) => {
    const { topic, payloadString } = message;

    switch (topic) {
      case 'bme:thermometer':
        this.setState({ thermometer: payloadString });
        return;
      case 'bme:barometer':
        this.setState({ barometer: payloadString });
        return;
      case 'bme:hygrometer':
        this.setState({ hygrometer: payloadString });
        return;
      default:
        return;
    }
  };

  handleConnectionLost = (response) => {
    if (response.errorCode !== 0) {
      console.log(`connection lost: ${response.errorMessage}`);
    }
  };

  componentDidMount() {
    // Setup handlers for connection lost and new messages
    this.client.onConnectionLost = this.handleConnectionLost;
    this.client.onMessageArrived = this.handleIncomingMessage;

    this.client.connect({ onSuccess: this.handleSuccessfulConnect });
  }

  render() {
    return (
      <div className="App">
        <div>{`thermometer ${this.state.thermometer}`}</div>
        <div>{`barometer ${this.state.barometer}`}</div>
        <div>{`hygrometer ${this.state.hygrometer}`}</div>
      </div>
    );
  }
}

export default App;
