#!/bin/bash

# Script to rename all .jsx files to .tsx in the Pages directory

echo "Converting .jsx files to .tsx in Pages directory..."

# Find all .jsx files in the Pages directory and rename them to .tsx
find resources/js/Pages -name "*.jsx" -type f | while read file; do
    # Get the new filename by replacing .jsx with .tsx
    newfile="${file%.jsx}.tsx"
    
    # Rename the file
    mv "$file" "$newfile"
    
    echo "Renamed: $file -> $newfile"
done

echo "✓ All .jsx files have been renamed to .tsx"
echo ""
echo "Note: You may need to update the TypeScript types in these files:"
echo "- Add proper interface definitions for props"
echo "- Replace 'any' types with specific types"
echo "- Add return types to functions"
