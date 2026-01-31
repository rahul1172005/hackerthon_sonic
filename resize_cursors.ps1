
Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )

    try {
        $img = [System.Drawing.Image]::FromFile($InputPath)
        $newImg = New-Object System.Drawing.Bitmap($Width, $Height)
        $graph = [System.Drawing.Graphics]::FromImage($newImg)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($img, 0, 0, $Width, $Height)
        $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        $img.Dispose()
        $newImg.Dispose()
        $graph.Dispose()
        Write-Host "Successfully resized $InputPath to $OutputPath"
    }
    catch {
        Write-Error "Failed to resize $InputPath : $_"
    }
}

$startDir = "c:\Users\Raja\OneDrive\Desktop\hackersonic\public"
$cursor = Join-Path $startDir "Grey Electric Animated--cursor--SweezyCursors.png"
$pointer = Join-Path $startDir "Grey Electric Animated--pointer--SweezyCursors.png"
$cursorOut = Join-Path $startDir "cursor-small.png"
$pointerOut = Join-Path $startDir "pointer-small.png"

Resize-Image -InputPath $cursor -OutputPath $cursorOut -Width 32 -Height 32
Resize-Image -InputPath $pointer -OutputPath $pointerOut -Width 32 -Height 32
