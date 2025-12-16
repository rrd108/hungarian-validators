#!/bin/bash

# Script to publish the package with test validation
# Usage: ./scripts/publish.sh [patch|minor|major]

set -e  # Exit on any error

VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Error: Version type must be one of: patch, minor, major"
  exit 1
fi

# Check npm/pnpm authentication
echo "🔐 Checking npm authentication..."
if ! pnpm whoami &>/dev/null; then
  echo "❌ Error: Not logged into npm. Please run 'pnpm login' first."
  exit 1
fi
NPM_USER=$(pnpm whoami)
echo "✅ Logged into npm as: $NPM_USER"

# Check GitHub CLI authentication
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &>/dev/null; then
  echo "❌ Error: Not logged into GitHub CLI. Please run 'gh auth login' first."
  exit 1
fi
GITHUB_USER=$(gh api user --jq .login 2>/dev/null || echo "authenticated")
echo "✅ Logged into GitHub as: $GITHUB_USER"

echo "Running version script (includes tests)..."
./scripts/version.sh $VERSION_TYPE

if [ $? -ne 0 ]; then
  echo "Error: Version script failed. Aborting publish."
  exit 1
fi

echo "Publishing to npm..."
pnpm publish

echo "Publish completed successfully!"

