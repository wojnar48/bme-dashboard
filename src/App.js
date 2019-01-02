import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paho from 'paho-mqtt';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Gauge from 'react-svg-gauge';
import { withStyles } from '@material-ui/core/styles';


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = (theme) => ({
  layout: {
    marginTop: theme.spacing.unit * 8,
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  gaugeValue: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '40px',
    color: theme.palette.grey[400],
  }
});

const gaugeValueStyle =  {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '30px',
  fill: '#BDBDBD'
};

const topLabelStyle =  {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '20px',
  fill: '#BDBDBD'
};

const minMaxLabelStyle = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fill: '#BDBDBD'
};

class App extends Component {
  // TODO(SW): Move the client config into a separate file
  client = new Paho.Client(
    process.env.REACT_APP_MQTT_BROKER_URL,
    parseInt(process.env.REACT_APP_MQTT_BROKER_PORT, 10),
    'bme-dashboard'
  );

  state = {
    thermometer: '',
    barometer: '',
    hygrometer: '',
  };

  handleSuccessfulConnect = () => {
    console.log('Connected to MQQT broker');

    this.client.subscribe('bme:gauge');
  };

  handleIncomingMessage = (message) => {
    const { topic, payloadString } = message;

    switch (topic) {
      case 'bme:gauge':
        const data = JSON.parse(payloadString);

        this.setState({
          thermometer: data.temperature,
          barometer: data.pressure,
          hygrometer: data.humidity,
        });

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

    this.client.connect({ onSuccess: this.handleSuccessfulConnect, useSSL: false });
  }

  render() {
    const { classes } = this.props;
    const { thermometer, barometer, hygrometer } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <main>
          <CssBaseline />
          <AppBar position="static" color="default" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                BME Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
          <section className={classes.layout}>
            <Grid container justify='center' spacing={40}>
              <Card>
                <CardContent>
                  <Gauge
                    value={thermometer}
                    color='#FFE082'
                    label='Thermometer'
                    width={300}
                    height={200}
                    valueLabelStyle={gaugeValueStyle}
                    topLabelStyle={topLabelStyle}
                    minMaxLabelStyle={minMaxLabelStyle}
                  />
                  <Typography color='textSecondary' component='p' align='center'>
                    {`temperature (F)`}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Gauge
                    value={barometer}
                    color='#A5D6A7'
                    label='Barometer'
                    min={50}
                    max={150}
                    width={300}
                    height={200}
                    valueLabelStyle={gaugeValueStyle}
                    topLabelStyle={topLabelStyle}
                    minMaxLabelStyle={minMaxLabelStyle}
                  />
                  <Typography color='textSecondary' component='p' align='center'>
                    {`pressure (kPa)`}
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Gauge
                    value={hygrometer}
                    color='#81D4FA'
                    label='Hygrometer'
                    width={300}
                    height={200}
                    valueLabelStyle={gaugeValueStyle}
                    topLabelStyle={topLabelStyle}
                    minMaxLabelStyle={minMaxLabelStyle}
                  />
                  <Typography color='textSecondary' component='p' align='center'>
                    {`humidity (%)`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </section>
        </main>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
