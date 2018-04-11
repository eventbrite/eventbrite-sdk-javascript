#!/bin/bash 
# Decrypt Github Deploy key for the Semantic Release package to be able to push tags 
# Ubuntu-14.04
# Decrypt key 
/usr/bin/openssl aes-256-cbc -K $encrypted_d09c1c3e25e0_key -iv $encrypted_d09c1c3e25e0_iv -in git_deploy_key.enc -out /tmp/git_deploy_key -d
# Make sure only the current user can read the private key- 
/bin/chmod 600 /tmp/git_deploy_key
#Remove passphrase from key 
/usr/bin/ssh-keygen -p -P "${SSH_PASSPHRASE}" -N "" -f /tmp/git_deploy_key
# Start the authentication agent
eval "$(ssh-agent -s)"
# Add the key to the authentication agent
/usr/bin/setsid ssh-add /tmp/git_deploy_key 

# semantic-relase #placeholder 

ssh-add -l
/usr/bin/pkill ssh-agent && echo "successfully killed ssh agent"

