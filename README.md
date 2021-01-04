**NOTE: Everything here is PROOF OF CONCEPT. I don't plan on supporting this code so if you want to use it then no problem but use it at your own risk.**

# Disco Cube Daemon

The service that runs on the cube. It communicates with the admin app via Firebase.

The admin app repo can be found here: https://github.com/mikecann/disco-cube-admin/tree/master

## Config

Configuration is stored in `/src/config.ts` you should copy `/src/example.local.config.json` to `/src/local.config.json` and fill in the values.

## Setup

1. `yarn install` should get all the dependencies downloaded
2. `yarn dev` should start building in watch mode

## Note

This is designed to run on the cube or linux therefore it might not work correctly on windows. Probably it should be contained in a docker container but oh well, a project for another day.
