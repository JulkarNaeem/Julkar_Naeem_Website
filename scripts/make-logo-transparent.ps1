Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Steel Detailer\.gemini\antigravity-ide\brain\c3cb8893-6a74-4a5c-ba9e-d5213b038cd4\.user_uploaded\media_1789208811124.png"
$dstPath = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\jn-logo-mark.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height

$dst = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $p = $src.GetPixel($x, $y)
        # Check luminance: if it's dark background, make it transparent
        $lum = 0.299 * $p.R + 0.587 * $p.G + 0.114 * $p.B
        if ($lum -lt 60) {
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($lum -lt 150) {
            # Smooth anti-aliased edge
            $alpha = [int](($lum - 60) / (150 - 60) * 255)
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            # Fully opaque logo foreground
            $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
        }
    }
}

$dst.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()

Write-Output "Transparent logo saved to $dstPath"
