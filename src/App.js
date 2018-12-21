import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paho from 'paho-mqtt';
import { Typography } from '@material-ui/core';

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
      <main className="App">
        <CssBaseline />
        <Grid container justify='center' spacing={40}>
          <Grid item sm={6} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  Temperature
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={6} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  Pressure
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={6} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  Humidity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </main>
    );
  }
}

export default App;
