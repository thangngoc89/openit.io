#/bin/bash -e

eval $(docker-machine env do)
docker-compose -f prod.yml up -d --build
eval $(docker-machine env -u)
