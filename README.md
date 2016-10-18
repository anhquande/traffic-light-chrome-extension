# Traffic Light Chrome Extension
This simple extension serves as a boilerplate project to boost the development of other chrome extensions.
## What is built?
This extension adds an icon next to the chrome address bar. 
When users click on the app icon, 3 colored bulbs (RED, YELLOW, GREEN) of a traffic light appears.
Each bulb is associated to a url which can be specified in the settings (the setting button is located below the traffic light).
When users click on a bulb, chrome will make a HTTP request (GET or POST) to the associated url. 
System notification is used to inform the users about the process. 

## How to build?
* git clone 
* bower install bootstrap
        