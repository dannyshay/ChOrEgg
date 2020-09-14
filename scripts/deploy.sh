#!/bin/bash
sudo docker build -t danny624/choregg:latest ./
sudo docker push danny624/choregg:latest
sudo git push origin master
