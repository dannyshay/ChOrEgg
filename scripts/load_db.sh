#!/bin/bash
sudo docker cp ../data choregg_db:/data
sudo docker exec -it choregg_db mongorestore -d choregg data/data
