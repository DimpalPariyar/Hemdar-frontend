#!/bin/bash

#give permission for everything in the admin-panel directory
sudo chmod -R 777 /home/ec2-user/admin-panel

#navigate into our working directory where we have all our github files
cd /home/ec2-user/admin-panel

export AWS_DEFAULT_REGION="ap-south-1"
export AWS_REGION="ap-south-1"
export DD_ENV="dev"
export DD_LOGS_INJECTION="true"

#add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#yarn commands
yarn
yarn build

#restart web-server
sudo service nginx restart
