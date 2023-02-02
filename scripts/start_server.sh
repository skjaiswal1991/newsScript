#!/bin/bash
# sudo chmod 755 /var/www/server.js # optional
# this will restart app/server on instance reboot
#crontab -l | { cat; echo "@reboot pm2 start npm --name "newsScript" -- start"; } | crontab -
#give permissions 777
sudo chmod -R 777 /var/www/html/newsScript
#install dependecies
cd /var/www/html/newsScript/ && npm install
#Check server running or not accordingly start or reload server
pm2 describe newsScript > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  pm2 start npm --name "newsScript" -- start
else
  pm2 reload newsScript
fi;

#save pm2
pm2 save
