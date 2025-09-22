# PowerShell Script: Convert PNG/JPG to WebP and delete originals
# Requires: cwebp (from Google's libwebp tools) available in PATH

# Quality setting (0–100)
$QUALITY = 100

# Get all PNG, JPG, JPEG files recursively
Get-ChildItem -Recurse -Include *.png, *.jpg, *.jpeg | ForEach-Object {
    $img = $_.FullName
    $webpFile = [System.IO.Path]::ChangeExtension($img, "webp")

    # Run cwebp conversion
    $process = Start-Process -FilePath "cwebp" -ArgumentList "-q $QUALITY `"$img`" -o `"$webpFile`"" -NoNewWindow -PassThru -Wait -RedirectStandardOutput "$null" -RedirectStandardError "$null"

    if ($process.ExitCode -eq 0) {
        Write-Output "Converted: $img -> $webpFile"
        Remove-Item -Force $img
    } else {
        Write-Output "Failed to convert: $img"
    }
}
