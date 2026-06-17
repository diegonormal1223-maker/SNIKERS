$files = @(
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\dashboard.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\gestionusuarios.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\gestionproductos.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\gestionpedidos.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\domicilios.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\reportes.html",
    "c:\xampp\htdocs\snikers springboot\snikers\src\main\resources\static\inventario.html"
)

$authCheckLine = '    <!-- AUTH CHECK - Route Protection -->'
$authCheckScript = '    <script src="JS/auth-check.js"></script>'

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Path $file -Raw
        
        # Check if auth-check.js is already added
        if ($content -notmatch "auth-check.js") {
            # Find </head> and insert before it
            $content = $content -replace '</head>', "$authCheckLine`r`n$authCheckScript`r`n</head>"
            
            # Write back to file
            $content | Set-Content -Path $file -NoNewline
            
            Write-Host "✅ Added auth-check.js to: $(Split-Path $file -Leaf)" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Already has auth-check.js: $(Split-Path $file -Leaf)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! All protected pages now have auth-check.js" -ForegroundColor Cyan
