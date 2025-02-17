# COC ATLAS Web Interface

A web interface built to support and simplify the testing process.

## TODO
- Integrate database for easy access to new and old data
  - Will allow the downloading of any data stored on a per-session basis
- Integrate other sensors to our external device to give more life and application to the interface
  - This simply requires progress in our project
- Make the graph dropdowns switch datasets and colors 

## Features
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


## Navigating the Interface

### Downloding Log Files

Downloading log files is a very simple process. All you need to do is navigate to the log section and click on the download button.

  ![downloadLog](https://github.com/user-attachments/assets/975a75bb-37f7-48e1-9c69-6b1456194f66)

In response, a file will be downloaded to the default location of the computer. It should be titled with the current date and time.

When you open it, you'll see the first line contains instructions on the format:
  
``` [Real World Time] [Runtime] (tags): msg ```
- The Real World Time is the time (in your time zone) that the message was logged.
- The runtime is the time the server has been for at the time of the log
- The tags are any of the following:
  - ``` !!: Err, !: Warning, C: Connection, D: Data ```
- The msg is the message (I know, it should be more clear)

### Bonus Features 
###### Cool stuff that isn't quite necessary.

- Click ``` Shift + R ``` to open up the reference image used to design the interface
- Open the settings and click ` Light Mode ` to access light mode (that is, if you don't appreciate your eyeballs)
