#!/bin/bash

# Script to version the package with test validation
# Usage: ./scripts/version.sh [patch|minor|major]
# This script ensures tests and build pass before versioning

set -e  # Exit on any error

VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Error: Version type must be one of: patch, minor, major"
  exit 1
fi

# Check GitHub CLI authentication (needed for creating releases)
echo "🔐 Checking GitHub authentication..."
if ! gh auth status &>/dev/null; then
  echo "❌ Error: Not logged into GitHub CLI. Please run 'gh auth login' first."
  exit 1
fi
GITHUB_USER=$(gh api user --jq .login 2>/dev/null || echo "authenticated")
echo "✅ Logged into GitHub as: $GITHUB_USER"

echo "🔍 Running tests before versioning..."
pnpm test

if [ $? -ne 0 ]; then
  echo "❌ Error: Tests failed. Aborting version bump."
  exit 1
fi

echo "✅ Tests passed. Building..."
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Error: Build failed. Aborting version bump."
  exit 1
fi

echo "✅ Build passed. Bumping version ($VERSION_TYPE)..."
# Read current version before bumping
CURRENT_VERSION=$(grep -oP '"version":\s*"\K[^"]+' package.json)

# Parse version components
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

# Bump version based on type
case $VERSION_TYPE in
  patch)
    PATCH=$((PATCH + 1))
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Update package.json version manually to avoid triggering preversion hook
# (we already ran tests and build)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS uses BSD sed
  sed -i '' "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" package.json
else
  # Linux uses GNU sed
  sed -i "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/" package.json
fi

TAG="v${NEW_VERSION}"
echo "📦 Bumped version: $CURRENT_VERSION → $NEW_VERSION"

echo "🏷️  Creating git commit and tag: $TAG"
git add package.json pnpm-lock.yaml
git commit -m "chore: bump version to $NEW_VERSION" || true
git tag -a "$TAG" -m "Release $TAG"

echo "📤 Pushing changes and tags..."
git push && git push --tags

echo "🚀 Creating GitHub release..."
gh release create $TAG --title "$TAG" --generate-notes

echo "✅ Version bump completed successfully! New version: $NEW_VERSION"

