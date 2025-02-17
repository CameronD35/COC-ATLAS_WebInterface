# COC ATLAS Web Interface

### This interface includes:
- A dynamic chat log built for errors, connections, warnings, and standard messages
  - For performance purposes, the max amount of log messages displayed on the interface is 50. However, it can be customized in the interface settings 
  - While the messages are visually displayed using the client-side, the server contains the log for the entire session
  - A copy of the sessions log can be downloaded at any point 
- Customizable graphs built to handle rapidly changing data
  - The domain of the graphs can be modified through the interface settings. The default is 30 points per graph for performance
  - As stated in the *TODO*, all data from every session will later be stored in a database and downloadable via the interface
- An express.js server with socket.io to handle WebSockets
- The ability to monitor connection to an external source via ethernet
  - For our mission (ATLAS), the ethernet cable connects any laptop to a Jetson Orin Nano
  - To configure a linux device to detect for a connection to the server opened for this interface go to the [Network Checker Repo](https://github.com/CameronD35/networkDaemon)
    - You will also find a python file that sends data to the server at a set interval as well (only works for linux devices)
    - You can the customize data transmission interval via the interface settings
- The ability to hook checkboxes to functions on the aforementioned remote device
  - For our project, we are currently in the midst of determining if this is a helpful or realistic feature
- A 3D render that accepts rotation in the [Quaternion](https://en.wikipedia.org/wiki/Quaternion) format

<br></br>

## Navigating the Interface
