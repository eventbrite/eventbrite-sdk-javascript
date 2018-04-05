#Contributing

Thank you for your interest in contributing to Eventbrite's Javascript SDK!

If you'd like to contribute, we strongly recommend creating or commenting on an issue regarding your ideas or changes before getting started. 

## Workflow

### Setup
1. Fork the repository
2. Clone your new forked repository to your local computer
3. Set the eventbrite repository as your branches upstream branch
`git remote add upstream https://github.com/eventbrite/eventbrite-sdk-javascript.git`
4. navigate to the root directory of your newly cloned repository 
(for mac `cd /path/to/eventbrite-sdk-javascript`)
5. `yarn install` to install local dependencies

### Using branches to submit changes
To work on changes to the eventbrite repository, create a new branch on your local reposity. `git checkout -b <your-new-branch-name>`
You can name your branch whatever you'd like as long as the PR title conforms with our [PR title guidelines]()

### Keeping your local repo up to date
To ensure your branch never gets out of sync with Eventbrite's master, ensure that you have your upstream set properly (see the Setup step)
1. `git checkout master` (you may have to stash or commit your local changes if on a new branch)
2. `git pull upstream master`
3. `git checkout <your-new-branch-name>`
4. `git rebase master`
5. If you've stashed changes, unstash them now, otherwise your branch should now be up to date

Always try to keep your master 'clean' by only pulling changes directly from upstream into your master branch and rebasing those changes onto your working branch.

It is always a good idea to pull the upstream branch in to your master branch before creating a new feature branch to work from. This will minimize the chances of encountering merge conflicts.

## Filing bugs

## Submitting changes

### Fixing bugs
If you've found a bug from our issues list that you'd like to fix, please comment on the issue to let others know you'd like to work on it. 

While implementing your fix, please try to change as little code as possible. This helps speed up the review process and helps diminish the chance of additional bugs. 

Once your fix is done, please make sure that your changes are fully covered by one or more unit tests.

Please check to make sure that your changes are documented properly (inline comments for interesting lines, READMEs, etc.)

Please run `yarn validate` to ensure that all of the tests pass, the code is linted and that your changes are typescript compliant. 

Finally, please submit a pull request, noting the bug issue that you are resolving in the 'Description' section of your github pull request. 

### Submitting features or improvements
If you'd like to submit changes to the SDK that are non trivial, please first discuss the changes you wish to implement in our github issue tracker [here](https://github.com/eventbrite/eventbrite-sdk-javascript/issues). 

