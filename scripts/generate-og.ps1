Add-Type -AssemblyName System.Drawing

$markPath  = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\jn-logo-mark.png"
$dstOgPath = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og.png"
$dstSquare = "C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og-square.png"

$baseBmp = [System.Drawing.Bitmap]::FromFile("C:\Users\Steel Detailer\.gemini\antigravity-ide\scratch\Julkar_Naeem_Website\public\og-backup.png")
$markBmp = [System.Drawing.Bitmap]::FromFile($markPath)

# -------------------------------------------------------------
# 1. GENERATE NEW 1200x630 OG BANNER (public/og.png)
# -------------------------------------------------------------
$bannerBmp = New-Object System.Drawing.Bitmap(1200, 630, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bannerBmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw the base image (with side 3D structures)
$g.DrawImage($baseBmp, 0, 0, 1200, 630)

# Card dimensions
[int]$panelW = 500
[int]$panelH = 460
[int]$panelX = 600 - ($panelW / 2) # 350
[int]$panelY = 315 - ($panelH / 2) # 85

# Soft backing fill over old circle
[float]$backX = 350.0
[float]$backY = 65.0
[float]$backW = 500.0
[float]$backH = 500.0
$brushBack = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 28, 38))
$g.FillEllipse($brushBack, $backX, $backY, $backW, $backH)
$brushBack.Dispose()

# Draw Architectural Card / Panel
$cardRadius = 14
$cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$d = $cardRadius * 2
$cardPath.AddArc($panelX, $panelY, $d, $d, 180, 90)
$cardPath.AddArc($panelX + $panelW - $d, $panelY, $d, $d, 270, 90)
$cardPath.AddArc($panelX + $panelW - $d, $panelY + $panelH - $d, $d, $d, 0, 90)
$cardPath.AddArc($panelX, $panelY + $panelH - $d, $d, $d, 90, 90)
$cardPath.CloseFigure()

# Fill Panel with dark steel navy gradient
$ptTop = New-Object System.Drawing.PointF(600.0, [float]$panelY)
$ptBot = New-Object System.Drawing.PointF(600.0, [float]($panelY + $panelH))
$lgb = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $ptTop,
    $ptBot,
    [System.Drawing.Color]::FromArgb(250, 18, 31, 42),
    [System.Drawing.Color]::FromArgb(255, 11, 20, 28)
)
$g.FillPath($lgb, $cardPath)
$lgb.Dispose()

# Inner blueprint grid lines inside the card
$penInnerGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255), 1.0)
for ($gx = $panelX + 30; $gx -lt ($panelX + $panelW); $gx += 40) {
    $g.DrawLine($penInnerGrid, $gx, $panelY + 10, $gx, $panelY + $panelH - 10)
}
for ($gy = $panelY + 30; $gy -lt ($panelY + $panelH); $gy += 40) {
    $g.DrawLine($penInnerGrid, $panelX + 10, $gy, $panelX + $panelW - 10, $gy)
}
$penInnerGrid.Dispose()

# Draw Card Border
$penBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 52, 70, 84), 1.5)
$g.DrawPath($penBorder, $cardPath)
$penBorder.Dispose()

# Draw subtle gold corner brackets
$penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 184, 75), 2.5)

# Top-Left corner bracket
$g.DrawLine($penGold, $panelX - 4, $panelY + 14, $panelX - 4, $panelY - 4)
$g.DrawLine($penGold, $panelX - 4, $panelY - 4, $panelX + 14, $panelY - 4)

# Top-Right corner bracket
$g.DrawLine($penGold, $panelX + $panelW + 4, $panelY + 14, $panelX + $panelW + 4, $panelY - 4)
$g.DrawLine($penGold, $panelX + $panelW + 4, $panelY - 4, $panelX + $panelW - 14, $panelY - 4)

# Bottom-Left corner bracket
$g.DrawLine($penGold, $panelX - 4, $panelY + $panelH - 14, $panelX - 4, $panelY + $panelH + 4)
$g.DrawLine($penGold, $panelX - 4, $panelY + $panelH + 4, $panelX + 14, $panelY + $panelH + 4)

# Bottom-Right corner bracket
$g.DrawLine($penGold, $panelX + $panelW + 4, $panelY + $panelH - 14, $panelX + $panelW + 4, $panelY + $panelH + 4)
$g.DrawLine($penGold, $panelX + $panelW + 4, $panelY + $panelH + 4, $panelX + $panelW - 14, $panelY + $panelH + 4)
$penGold.Dispose()
$cardPath.Dispose()

# --- DRAW CONTENT INSIDE THE CARD ---

# 1. Eyebrow Tag
$fontEyebrow = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Bold)
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 184, 75))
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center

$g.DrawString("FABRICATION-DRIVEN STEEL DETAILER", $fontEyebrow, $brushGold, 600.0, [float]($panelY + 26), $sf)
$fontEyebrow.Dispose()

# 2. Draw JN Logo Mark
$logoW = 168
$logoH = [int]($logoW / (900.0 / 658.0)) # ~123px
$logoX = 600 - ($logoW / 2)
$logoY = $panelY + 58
$g.DrawImage($markBmp, $logoX, $logoY, $logoW, $logoH)

# 3. Primary Name: JULKAR NAEEM
$fontName = New-Object System.Drawing.Font("Arial Black", 32, [System.Drawing.FontStyle]::Bold)
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 243, 241, 233))
$nameY = [float]($logoY + $logoH + 14)
$g.DrawString("JULKAR NAEEM", $fontName, $brushWhite, 600.0, $nameY, $sf)
$fontName.Dispose()

# 4. Gold Divider Line
$divY = [float]($nameY + 58)
$penDiv = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 230, 184, 75), 1.0)
$g.DrawLine($penDiv, 430.0, $divY, 770.0, $divY)
$penDiv.Dispose()

# Center diamond marker
$p1 = New-Object System.Drawing.PointF(600.0, [float]($divY - 4.0))
$p2 = New-Object System.Drawing.PointF(604.0, [float]$divY)
$p3 = New-Object System.Drawing.PointF(600.0, [float]($divY + 4.0))
$p4 = New-Object System.Drawing.PointF(596.0, [float]$divY)
$poly = [System.Drawing.PointF[]]@($p1, $p2, $p3, $p4)

$brushDivGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 184, 75))
$g.FillPolygon($brushDivGold, $poly)
$brushDivGold.Dispose()

# 5. Subtitle: STRUCTURAL STEEL DETAILER
$fontSub = New-Object System.Drawing.Font("Arial", 11.0, [System.Drawing.FontStyle]::Bold)
$brushSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 210, 218))
$subY = [float]($divY + 12.0)
$g.DrawString("S T R U C T U R A L   S T E E L   D E T A I L E R", $fontSub, $brushSub, 600.0, $subY, $sf)
$fontSub.Dispose()
$brushSub.Dispose()

# 6. Bottom verification pill
$fontPill = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Regular)
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 140, 158, 172))
$pillY = [float]($subY + 28.0)
$g.DrawString("Coordinated 3D Models  |  Fabrication Drawings  |  QA", $fontPill, $brushMuted, 600.0, $pillY, $sf)
$fontPill.Dispose()
$brushMuted.Dispose()

# Top Banner Header Bar
$fontTop = New-Object System.Drawing.Font("Consolas", 9.0, [System.Drawing.FontStyle]::Regular)
$brushTop = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 138, 154, 164))

$sfLeft = New-Object System.Drawing.StringFormat
$sfLeft.Alignment = [System.Drawing.StringAlignment]::Near
$g.DrawString("TEKLA STRUCTURES 3D // FABRICATION", $fontTop, $brushTop, 36.0, 28.0, $sfLeft)

$sfRight = New-Object System.Drawing.StringFormat
$sfRight.Alignment = [System.Drawing.StringAlignment]::Far
$g.DrawString("DHAKA, BD  |  INTERNATIONAL SUPPORT", $fontTop, $brushTop, 1164.0, 28.0, $sfRight)

$fontTop.Dispose()
$brushTop.Dispose()

# Bottom Banner Bar
$fontBot = New-Object System.Drawing.Font("Consolas", 8.5, [System.Drawing.FontStyle]::Regular)
$brushBot = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 230, 184, 75))
$g.DrawString("AISC DETAILER TRAINING SERIES  |  TEKLA STEEL FUNDAMENTALS", $fontBot, $brushBot, 36.0, 588.0, $sfLeft)

$brushBot2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 138, 154, 164))
$g.DrawString("SHOP DRAWINGS  |  ERECTION GA  |  MTO", $fontBot, $brushBot2, 1164.0, 588.0, $sfRight)
$fontBot.Dispose()
$brushBot.Dispose()
$brushBot2.Dispose()

$brushWhite.Dispose()
$brushGold.Dispose()
$sf.Dispose()
$sfLeft.Dispose()
$sfRight.Dispose()
$g.Dispose()

$baseBmp.Dispose()

# Save final 1200x630 banner
$bannerBmp.Save($dstOgPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bannerBmp.Dispose()
Write-Output "Successfully generated 1200x630 og.png"

# -------------------------------------------------------------
# 2. GENERATE DEDICATED 600x600 SQUARE SHARE CARD (public/og-square.png)
# -------------------------------------------------------------
$sqBmp = New-Object System.Drawing.Bitmap(600, 600, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gSq = [System.Drawing.Graphics]::FromImage($sqBmp)

$gSq.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSq.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSq.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$gSq.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Background deep navy gradient
$bgPt1 = New-Object System.Drawing.PointF(300.0, 0.0)
$bgPt2 = New-Object System.Drawing.PointF(300.0, 600.0)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $bgPt1,
    $bgPt2,
    [System.Drawing.Color]::FromArgb(255, 18, 31, 42),
    [System.Drawing.Color]::FromArgb(255, 10, 18, 25)
)
$gSq.FillRectangle($bgBrush, 0, 0, 600, 600)
$bgBrush.Dispose()

# Blueprint Grid on square card
$penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 255, 255, 255), 1.0)
for ($x = 40; $x -lt 600; $x += 40) {
    $gSq.DrawLine($penGrid, [float]$x, 0.0, [float]$x, 600.0)
}
for ($y = 40; $y -lt 600; $y += 40) {
    $gSq.DrawLine($penGrid, 0.0, [float]$y, 600.0, [float]$y)
}
$penGrid.Dispose()

# Architectural Outer Border with Gold Corners
$penSqBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 48, 66, 80), 1.5)
$gSq.DrawRectangle($penSqBorder, 28, 28, 544, 544)
$penSqBorder.Dispose()

$penSqGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 230, 184, 75), 2.5)
$gSq.DrawLine($penSqGold, 28.0, 48.0, 28.0, 28.0)
$gSq.DrawLine($penSqGold, 28.0, 28.0, 48.0, 28.0)

$gSq.DrawLine($penSqGold, 572.0, 48.0, 572.0, 28.0)
$gSq.DrawLine($penSqGold, 572.0, 28.0, 552.0, 28.0)

$gSq.DrawLine($penSqGold, 28.0, 552.0, 28.0, 572.0)
$gSq.DrawLine($penSqGold, 28.0, 572.0, 48.0, 572.0)

$gSq.DrawLine($penSqGold, 572.0, 552.0, 572.0, 572.0)
$gSq.DrawLine($penSqGold, 572.0, 572.0, 552.0, 572.0)
$penSqGold.Dispose()

# Header on square card
$sfSq = New-Object System.Drawing.StringFormat
$sfSq.Alignment = [System.Drawing.StringAlignment]::Center

$fontSqEyebrow = New-Object System.Drawing.Font("Arial", 10.0, [System.Drawing.FontStyle]::Bold)
$brushSqGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 184, 75))
$gSq.DrawString("TEKLA STRUCTURES SPECIALIST", $fontSqEyebrow, $brushSqGold, 300.0, 58.0, $sfSq)
$fontSqEyebrow.Dispose()

# Big JN Logo Mark on square card
$sqLogoW = 196
$sqLogoH = [int]($sqLogoW / (900.0 / 658.0)) # ~143px
$sqLogoX = 300 - ($sqLogoW / 2)
$sqLogoY = 104
$gSq.DrawImage($markBmp, $sqLogoX, $sqLogoY, $sqLogoW, $sqLogoH)

# Title: JULKAR NAEEM
$fontSqName = New-Object System.Drawing.Font("Arial Black", 32, [System.Drawing.FontStyle]::Bold)
$brushSqWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 243, 241, 233))
$sqNameY = [float]($sqLogoY + $sqLogoH + 18)
$gSq.DrawString("JULKAR NAEEM", $fontSqName, $brushSqWhite, 300.0, $sqNameY, $sfSq)
$fontSqName.Dispose()

# Divider line
$divSqY = [float]($sqNameY + 56.0)
$penDivSq = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 230, 184, 75), 1.0)
$gSq.DrawLine($penDivSq, 130.0, $divSqY, 470.0, $divSqY)
$penDivSq.Dispose()

# Center diamond on square
$sp1 = New-Object System.Drawing.PointF(300.0, [float]($divSqY - 4.0))
$sp2 = New-Object System.Drawing.PointF(304.0, [float]$divSqY)
$sp3 = New-Object System.Drawing.PointF(300.0, [float]($divSqY + 4.0))
$sp4 = New-Object System.Drawing.PointF(296.0, [float]$divSqY)
$spoly = [System.Drawing.PointF[]]@($sp1, $sp2, $sp3, $sp4)
$gSq.FillPolygon($brushSqGold, $spoly)

# Subtitle: STRUCTURAL STEEL DETAILER
$fontSqSub = New-Object System.Drawing.Font("Arial", 11.5, [System.Drawing.FontStyle]::Bold)
$brushSqSub = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 196, 206, 214))
$sqSubY = [float]($divSqY + 14.0)
$gSq.DrawString("S T R U C T U R A L   S T E E L   D E T A I L E R", $fontSqSub, $brushSqSub, 300.0, $sqSubY, $sfSq)
$fontSqSub.Dispose()
$brushSqSub.Dispose()

# Bottom details
$fontSqBot = New-Object System.Drawing.Font("Arial", 10.0, [System.Drawing.FontStyle]::Regular)
$brushSqMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 140, 158, 172))
$sqBotY = [float]($sqSubY + 28.0)
$gSq.DrawString("Coordinated 3D Models  |  Fabrication Drawings", $fontSqBot, $brushSqMuted, 300.0, $sqBotY, $sfSq)

$fontSqUrl = New-Object System.Drawing.Font("Consolas", 10.5, [System.Drawing.FontStyle]::Bold)
$gSq.DrawString("julkarnaeem.com", $fontSqUrl, $brushSqGold, 300.0, 526.0, $sfSq)

$fontSqBot.Dispose()
$fontSqUrl.Dispose()
$brushSqMuted.Dispose()
$brushSqWhite.Dispose()
$brushSqGold.Dispose()
$sfSq.Dispose()
$gSq.Dispose()

$markBmp.Dispose()

$sqBmp.Save($dstSquare, [System.Drawing.Imaging.ImageFormat]::Png)
$sqBmp.Dispose()
Write-Output "Successfully generated 600x600 og-square.png"
