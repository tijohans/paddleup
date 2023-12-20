# PaddleUp! Table Tennis Dashboard

This project was created as part of the course IDG2100 Full Stack development at NTNU Gjøvik.

Made by:

- Thor Ivar Nirisen Johansen
- Nicolas Laukemann
- Håvard Larsen

## Getting Started

To get started with this project all you need to do is run `npm run init` in the root folder of the project. This script is designed to setup and run both the front-end and the back-end of the project in one simple command. 

If you would like to set up the database locally, we have included the dummy data for the database in the `db` folder. Make sure you modify the `.env` file accordingly. 

The database is already set up and running on MongoDB atlas, and the `.env` file is modified and set up to connect to this automatically once the back-end is running. The `.env` file is uploaded to the submission on Blackboard. 

#### Prerequisites

1. Stable internet connection
2. Node installed on your machine

The script / application will use node to install all the dependencies of the project.

#### Steps

Assuming you are in the root folder of the project and running a unix based operating system (MacOS, Linux), run the following commands: 

1. `npm run init`

This command will install all dependencies in both the front-end and back-end, and run the dev servers for both.

2. `npm run storybook`

This command will open the storybook for some of the components

#### Troubleshooting

If the scripts won't stop running after closing the terminal you may need to run the command: `killall node`. This command will kill all instances of node running locally on your machine. 

If you for some reason cannot close all instances of node, you can find the PID number of the service running on the ports, which in this case most likely be between `5173` and `5179` for the front end, and will be `4005` for the backend. Then you can run the command `lsof -i :<portnumber>` and then run `kill <PID number>`

# Sources:

react-hook-form:
https://react-hook-form.com/get-started#Quickstart

Password checking in react-hook-form:
https://stackoverflow.com/questions/70480928/how-to-validate-password-and-confirm-password-in-react-hook-form-is-there-any-v

For authenticating with JWT: 
https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens

Table tennis component is taken from oblig 1 by Nicolas Laukemann:
https://github.com/ntnu-design/idg2100-2023-oblig1-nxtseq

Backend code is taken mostly from oblig 2 by Thor Ivar Nirisen Johansen:
https://github.com/ntnu-design/idg2100-2023-oblig2-tijohans

We use code from oblig 3 as well by Thor & Nicolas:
https://github.com/ntnu-design/idg2100-2023-oblig3-divine-beats

Socket.io:
https://www.youtube.com/watch?v=djMy4QsPWiI

Nodemailer:
https://www.youtube.com/watch?v=CrdMFZIYoEY&t

Storybook with react-router:
https://stackoverflow.com/questions/58909666/storybook-w-react-router-you-should-not-use-link-outside-router

Swagger:
https://medium.com/@adarsh_d/streamline-your-node-js-api-with-swagger-a-step-by-step-guide-ea684db14847
https://swagger.io/docs/

react-confirm-alert:
https://www.npmjs.com/package/react-confirm-alert

react-toastify:
https://www.npmjs.com/package/react-toastify
