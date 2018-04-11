#!/bin/bash 
# Decrypt Github Deploy key for the Semantic Release package to be able to push tags 
# Ubuntu-14.04

/usr/bin/openssl aes-256-cbc -K $encrypted_d09c1c3e25e0_key -iv $encrypted_d09c1c3e25e0_iv -in git_deploy_key.enc -out /tmp/git_deploy_key -d
/bin/chmod 600 /tmp/git_deploy_key
/usr/bin/ssh-keygen -p -P "${SSH_PASSPHRASE}" -N "" -f /tmp/git_deploy_key
eval "$(ssh-agent -s)"
/usr/bin/setsid ssh-add /tmp/git_deploy_key 
ssh-add -l
## Deploy
npx semantic-release
##
/usr/bin/pkill ssh-agent && echo "successfully killed ssh agent"

