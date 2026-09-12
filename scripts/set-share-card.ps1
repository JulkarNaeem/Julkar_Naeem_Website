Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Steel Detailer\.gemini\antigravity-ide\brain\c3cb8893-6a74-4a5c-ba9e-d5213b038cd4\.user_uploaded\media_1789210436599.png"
$dstOg = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og.png"
$dstSquare = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og-square.png"
$dstFull = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og-full.png"

# Save full 1024x1024 as well
Copy-Item $src $dstFull -Force

$bmp = [System.Drawing.Bitmap]::FromFile($src)

# 640x640 is standard web preview resolution (< 300KB)
$size = 640
$optBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($optBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($bmp, 0, 0, $size, $size)
$g.Dispose()
$bmp.Dispose()

$optBmp.Save($dstOg, [System.Drawing.Imaging.ImageFormat]::Png)
$optBmp.Save($dstSquare, [System.Drawing.Imaging.ImageFormat]::Png)
$optBmp.Dispose()

$len = (Get-Item $dstOg).Length
Write-Output "Final share card PNG size (640x640): $len bytes"
