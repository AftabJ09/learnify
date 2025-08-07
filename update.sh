#!/bin/bash

echo "-------------------------"
echo "Enter commit message:"
read message
echo "-------------------------"

echo "📥 Pulling latest changes with rebase..."
git pull --rebase origin main

echo "📦 Staging changes..."
git add .

echo "📝 Committing changes..."
git commit -m "$message"

echo "📤 Pushing to remote..."
git push

echo "✅ Repository updated successfully!"
