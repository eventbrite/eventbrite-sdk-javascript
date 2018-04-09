#!/bin/bash 
# Decrypt Github Deploy key for the Semantic Release package to be able to push tags 
# Ubuntu-14.04

# Make sure only the current user can read the private key- 
/usr/bin/openssl aes-256-cbc -K "${encrypted_ba12a3340263_key}" -iv "${encrypted_ba12a3340263_iv}" -in git_deploy_key.enc -out /tmp/git_deploy_key -d 
# Make sure only the current user can read the private key
/bin/chmod 600 /tmp/git_deploy_key
# Create a script to return the passphrase environment variable to ssh-add
/bin/echo 'echo ${SSH_PASSPHRASE}' > /tmp/askpass && chmod +x /tmp/askpass
# Start the authentication agent
eval "$(/usr/bin/ssh-agent -s)"
# Add the key to the authentication agent
DISPLAY=":0.0" SSH_ASKPASS="/tmp/askpass" /usr/bin/setsid ssh-add /tmp/git_deploy_key </dev/null
# semantic-relase #placeholder 

echo -e "Script, and processes spawned:\n$(ps -ef|grep $$)\n\n"
/usr/bin/pkill ssh-agent && echo "Successfully killed ssh-agent"
echo -e "All processes running: $(ps -ef)"
exit 0
