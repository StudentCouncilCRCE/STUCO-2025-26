#!/bin/bash
set -euo pipefail

# Quality setting for WebP (0–100)
QUALITY=100

# Pick converter: cwebp > magick > error
if command -v cwebp >/dev/null 2>&1; then
  converter="cwebp"
elif command -v magick >/dev/null 2>&1; then
  converter="magick"
else
  echo "❌ Error: Neither 'cwebp' nor 'magick' (ImageMagick) found. Install one and retry."
  exit 1
fi

# Find all PNG and JPG/JPEG images recursively
find . -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0 |
  while IFS= read -r -d '' img; do
    webp_file="${img%.*}.webp"

    echo "Converting: $img"

    if [ "$converter" = "cwebp" ]; then
      if cwebp -q "$QUALITY" "$img" -o "$webp_file"; then
        echo "✅ Converted: $img -> $webp_file"
        rm -f -- "$img"
      else
        echo "❌ Failed: $img"
        rm -f -- "$webp_file"
      fi
    else
      if magick "$img" -quality "$QUALITY" "$webp_file"; then
        echo "✅ Converted: $img -> $webp_file"
        rm -f -- "$img"
      else
        echo "❌ Failed: $img"
        rm -f -- "$webp_file"
      fi
    fi
  done
