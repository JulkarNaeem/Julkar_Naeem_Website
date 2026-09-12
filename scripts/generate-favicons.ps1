Add-Type -AssemblyName System.Drawing

$markPath = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\jn-logo-mark.png"
$src = [System.Drawing.Bitmap]::FromFile($markPath)

# Background color matching hero section: #101c26
$bgColor = [System.Drawing.Color]::FromArgb(255, 16, 28, 38)

function CreateFaviconBitmap([int]$size, [float]$paddingRatio, [bool]$roundedCorners) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fill background
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    if ($roundedCorners) {
        $radius = [int]($size * 0.18)
        $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $d = $radius * 2
        $path.AddArc(0, 0, $d, $d, 180, 90)
        $path.AddArc($size - $d, 0, $d, $d, 270, 90)
        $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
        $path.AddArc(0, $size - $d, $d, $d, 90, 90)
        $path.CloseFigure()
        $g.FillPath($brush, $path)
        $path.Dispose()
    } else {
        $g.Clear($bgColor)
    }
    $brush.Dispose()

    # Calculate centered logo dimensions
    $availW = $size * (1.0 - ($paddingRatio * 2))
    $availH = $size * (1.0 - ($paddingRatio * 2))
    $aspect = $src.Width / $src.Height

    $drawW = $availW
    $drawH = $availW / $aspect
    if ($drawH -gt $availH) {
        $drawH = $availH
        $drawW = $availH * $aspect
    }

    $drawX = ($size - $drawW) / 2.0
    $drawY = ($size - $drawH) / 2.0

    $destRect = New-Object System.Drawing.RectangleF($drawX, $drawY, $drawW, $drawH)
    $srcRect = New-Object System.Drawing.RectangleF(0, 0, $src.Width, $src.Height)
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $g.Dispose()
    return $bmp
}

# 1. Generate 512x512 high-res favicon.png / apple-touch-icon.png
$bmp512 = CreateFaviconBitmap 512 0.12 $false
$bmp512.Save("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\favicon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Save("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Dispose()

# 2. Generate 64x64 favicon.png and icon.png
$bmp64 = CreateFaviconBitmap 64 0.10 $false
$bmp64.Save("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp64.Save("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 3. Generate multi-size favicon.ico (32x32)
$bmp32 = CreateFaviconBitmap 32 0.08 $false
$hIcon = $bmp32.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = New-Object System.IO.FileStream("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmp32.Dispose()
$bmp64.Dispose()

$src.Dispose()

# 4. Generate self-contained SVG favicon with embedded base64 of the logo mark
$bytes = [System.IO.File]::ReadAllBytes("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\jn-logo-mark.png")
$b64 = [Convert]::ToBase64String($bytes)

# Calculate aspect ratio placement in 64x64 viewBox
# Aspect is 900 / 658 ≈ 1.3677
# Width: 52, Height: 52 / 1.3677 ≈ 38.0
# x: (64 - 52)/2 = 6, y: (64 - 38)/2 = 13
$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#101c26" rx="10"/>
  <image href="data:image/png;base64,$b64" x="6" y="13" width="52" height="38" preserveAspectRatio="xMidYMid meet"/>
</svg>
"@

[System.IO.File]::WriteAllText("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\favicon.svg", $svg)

Write-Output "All favicon assets successfully generated!"
