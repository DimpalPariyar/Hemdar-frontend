#!/bin/bash

sudo cp /home/ec2-user/.env /home/ec2-user/backend-app/
#give permission for everything in the backend-app directory
sudo chmod -R 777 /home/ec2-user/backend-app

#navigate into our working directory where we have all our github files
cd /home/ec2-user/backend-app

# export MONGODB_URI=`aws ssm get-parameter --name "MONGODB_URI" --with-decryption --region ap-south-1 | jq -r .Parameter.Value`
#add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # loads nvm bash_completion (node is in path now)

#install node modules
npm install
npm install forever -g

#start our node app in the background
forever bin/www >/dev/null 2>app.err.log </dev/null &

#restart web-server
sudo service nginx restart
