#!/bin/bash

echo "-------------------------"
echo "Enter commit message:"
read message
echo "-------------------------"

git pull origin main
git add .
git commit -m "$message"
git push
echo "Updated the repository Successfully"

