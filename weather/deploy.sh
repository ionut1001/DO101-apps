#!/bin/bash

set -e
# to build the image: docker build -t docker-weather .

OWM_API_KEY=12a52a02b3b0bc7e7a60796a3d9f08b3
export OWM_API_KEY

 docker run -p 8081:8080 \
        --env OWM_API_KEY=$OWM_API_KEY \
        -d \
        --name weather-app \
        docker-weather