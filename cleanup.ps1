$f = "c:\Users\rosha\Desktop\RAO Projects\BOOK STORE ADMIN\frontend\src\components\Navbar\Navbar.jsx"
$lines = Get-Content $f
$before = $lines[0..816]
$after = $lines[966..($lines.Length-1)]
$result = $before + $after
Set-Content -Path $f -Value $result -Encoding UTF8
Write-Host "Done. Removed lines 818-967. New total: $($result.Length)"
