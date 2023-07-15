
# Add the public remote repository
git remote add public ../WeekGolfGit


# Get the data of the public
git fetch public

# Merge it
git merge public/main --strategy-option=theirs --allow-unrelated-histories

# Checkout in case of
git checkout --theirs .


# Remove the public
git remote rm public

# Commit
git add *
git commit -m "Pulling from public repo"
