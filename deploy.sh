eval $(docker-machine env openit)
docker-compose -f docker-compose.yml -f prod.yml up -d --build
eval $(docker-machine env -u)
