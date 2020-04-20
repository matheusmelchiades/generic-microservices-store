#!/bin/bash

log_service_name()
{
  SERVICE_NAME=$1
  SERVICE_FUNC=$2

  echo ""
  echo "################################################"
  echo "### Service $SERVICE_NAME testing $SERVICE_FUNC"
  echo "################################################"
  echo ""
}

docker-compose up --build -d product store user api

log_service_name Product starting...
docker exec -it product yarn test

log_service_name Store starting...
docker exec -it store yarn test

log_service_name User starting...
docker exec -it user yarn test

log_service_name Api starting...
docker exec -it api yarn test

docker-compose stop product store user api