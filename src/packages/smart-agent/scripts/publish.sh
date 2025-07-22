#!/bin/bash

# Smart Agent Publishing Script
set -e

echo "🚀 Publishing Smart Agent to GitHub Packages..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the smart-agent directory."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Commit them first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Ask for version bump type
echo "🏷️  Select version bump:"
echo "1. patch (1.0.0 -> 1.0.1)"
echo "2. minor (1.0.0 -> 1.1.0)"
echo "3. major (1.0.0 -> 2.0.0)"
echo "4. custom"
echo "5. skip version bump"

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "📦 Bumping patch version..."
        npm version patch --no-git-tag-version
        ;;
    2)
        echo "📦 Bumping minor version..."
        npm version minor --no-git-tag-version
        ;;
    3)
        echo "📦 Bumping major version..."
        npm version major --no-git-tag-version
        ;;
    4)
        read -p "Enter version (e.g., 1.2.3): " custom_version
        echo "📦 Setting version to $custom_version..."
        npm version $custom_version --no-git-tag-version
        ;;
    5)
        echo "⏭️  Skipping version bump..."
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Get current version
VERSION=$(node -p "require('./package.json').version")
echo "📋 Current version: $VERSION"

# Clean and build
echo "🧹 Cleaning previous build..."
npm run clean 2>/dev/null || true

echo "🔧 Installing dependencies..."
npm install

echo "🏗️  Building package..."
npm run build

# Type check
echo "🔍 Type checking..."
npm run type-check

# Run tests if available
if npm run test --silent 2>/dev/null; then
    echo "🧪 Running tests..."
    npm test
else
    echo "ℹ️  No tests found, skipping..."
fi

# Check if user is authenticated with GitHub
echo "🔐 Checking GitHub authentication..."
if ! npm whoami --registry=https://npm.pkg.github.com 2>/dev/null; then
    echo ""
    echo "⚠️  You need to authenticate with GitHub Packages first:"
    echo ""
    echo "1. Create a GitHub Personal Access Token with 'write:packages' scope:"
    echo "   https://github.com/settings/tokens/new?scopes=write:packages"
    echo ""
    echo "2. Login to GitHub Packages:"
    echo "   npm login --registry=https://npm.pkg.github.com"
    echo ""
    echo "3. Or add to your ~/.npmrc:"
    echo "   @saas-template:registry=https://npm.pkg.github.com"
    echo "   //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE"
    echo ""
    read -p "Press Enter after authentication is complete..."
fi

# Final confirmation
echo ""
echo "📦 Ready to publish @saas-template/smart-agent@$VERSION"
echo "📍 Registry: https://npm.pkg.github.com"
echo ""
read -p "Proceed with publishing? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Publishing..."
    
    # Set registry for this publish
    npm publish --registry=https://npm.pkg.github.com
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully published @saas-template/smart-agent@$VERSION"
        echo ""
        echo "📝 To install in other projects:"
        echo "   npm install @saas-template/smart-agent@$VERSION"
        echo ""
        echo "🔗 Package URL:"
        echo "   https://github.com/your-username/saas-template/packages"
        echo ""
        
        # Ask if user wants to create a git tag
        read -p "Create git tag for this version? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git tag "smart-agent-v$VERSION"
            echo "🏷️  Created tag: smart-agent-v$VERSION"
            
            read -p "Push tag to remote? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push origin "smart-agent-v$VERSION"
                echo "📤 Pushed tag to remote"
            fi
        fi
        
    else
        echo "❌ Publishing failed!"
        exit 1
    fi
else
    echo "❌ Publishing cancelled."
    exit 1
fi

echo ""
echo "🎉 All done!"