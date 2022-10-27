# Docker
## Sumarry
- [Docker](#docker)
  - [Sumarry](#sumarry)
  - [Organization](#organization)
    - [Dockerfile](#dockerfile)
    - [build.sh](#buildsh)
    - [launch.sh](#launchsh)

## Organization
Each directory in Docker has 3 files

### Dockerfile
This is the Dockerfile to create the docker image.
If you dont know what Docker is, click <a href="https://www.docker.com/">here</a>

### build.sh
This bash script builds the docker image that is described in the Dockerfile

### launch.sh
This bash script is runned from the docker image.
It's with this script that the programs in WeekGolf are executed.