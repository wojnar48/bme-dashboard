![dashboard_main][dashboard_gauges]

### Overview
[LIVE DEMO](https://pacific-earth-60125.herokuapp.com/)

The UI was created using `create-react-app` and displays real-time temperature, pressure, humidity and air quality (IN PROGRESS) sensor data
(see the `Hardware` section below for more details on the hardware setup). I used the `React Material UI` library for styling the dashboard components and
the `react-svg-gauge` library to style the individual sensor gauges.


### Hardware
The BME280 (thermometer, barometer and hygrometer) and SDS011 (air quality - NOT YET IMPLEMENTED) sensors are mounted to a Tessel 2 development board (the sensor code is [here](https://github.com/wojnar48/tessel)) that runs continuously on my desk in untethered mode. The board communicates with the UI dashboard using the MQTT protocol via a MQTT broker server which I implemented myself (see the below `MQTT Broker Server` section below for more details on the server setup). In the coming days I intend to build a weather-resistant case for the hardware so that
I can gather outdoor environment data outside my window. I am particularly interested to see if air quality in my neighborhood (Greenpoint, Brooklyn) changes during a given time period.
If I am able to observe fluctuations, I plan to distrubute several similar sensor kits throughout Greenpoint to see if observed air quality varies based on location.
I will make all of the data publicly available.

### MQTT Broker Server
The server runs on an newly provisioned AWS EC2 Ubuntu 16.04 instance. It uses the popular open-source Eclipse Mosquitto library (https://mosquitto.org/) to implement `v3.1` of the
MQTT protocol. Messages to and from the server are encrypted over TLS using `letsencrypt` certificates.

## TODOs
* [] Add a gauge to display readings from the SDS011 air quality sensor once it is added to the board
* [] Implement API logic to store/fetch historical sensor data
* [] Add a chart to display historical sensor values for the data collected
* [] Build a weather-resistant case for the hardware that can be mounted outdoors

[dashboard_gauges]: docs/images/sensor_gauges.png