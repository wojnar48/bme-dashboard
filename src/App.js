import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paho from 'paho-mqtt';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  layout: {
    marginTop: theme.spacing.unit * 2,
  },
  appBar: {
    position: 'relative',
  },
  toolbarTitle: {
    flex: 1,
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  }
});

class App extends Component {
  // TODO(SW): Move the client config into a separate file
  client = new Paho.Client(process.env.REACT_APP_MQTT_BROKER_URL, 8083, 'dashboard');

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

    this.client.connect({ onSuccess: this.handleSuccessfulConnect, useSSL: true });
  }

  render() {
    const { classes } = this.props;
    const { thermometer, barometer, hygrometer } = this.state;

    return (
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
            <Grid item sm={6} md={4} lg={2}>
              <Card>
                <CardHeader
                  className={classes.cardHeader}
                  titleTypographyProps={{ align: 'center' }}
                  title='Thermometer'
                  />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2' align='center'>
                    {`${thermometer} Fahr`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={6} md={4} lg={2}>
              <Card>
                <CardHeader
                  className={classes.cardHeader}
                  titleTypographyProps={{ align: 'center' }}
                  title='Barometer'
                  />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2' align='center'>
                    {`${barometer} kPa`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={6} md={4} lg={2}>
              <Card>
                <CardHeader
                  className={classes.cardHeader}
                  titleTypographyProps={{ align: 'center' }}
                  title='Hygrometer'
                  />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='h2' align='center'>
                    {`${hygrometer} %`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </section>
      </main>
    );
  }
}

export default withStyles(styles)(App);
