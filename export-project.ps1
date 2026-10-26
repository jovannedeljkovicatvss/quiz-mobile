# export-project.ps1 — izvozi ceo projekat u jedan TXT fajl

param(
    [string]$Output = "project-export.txt"
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

# Folderi koje preskačemo
$ExcludeDirs = @(
    "node_modules", ".expo", ".git", ".vscode", ".idea",
    "dist", "build", "web-build", ".next", "coverage", ".cache"
)

# Ekstenzije koje preskačemo (binarni / generisani)
$ExcludeExts = @(
    "png","jpg","jpeg","gif","webp","bmp","ico","svg",
    "ttf","otf","woff","woff2","eot",
    "mp3","mp4","wav","mov","avi","mkv",
    "zip","tar","gz","rar","7z",
    "pdf","doc","docx","xls","xlsx",
    "lock","log"
)

# Fajlovi koje preskačemo po imenu
$ExcludeFiles = @(
    "package-lock.json","yarn.lock","pnpm-lock.yaml",
    ".DS_Store","Thumbs.db"
)

$OutPath = Join-Path $Root $Output

Write-Host "▶ Izvozi se projekat: $Root"
Write-Host "▶ Izlazni fajl: $Output"

$writer = New-Object System.IO.StreamWriter($OutPath, $false, [System.Text.UTF8Encoding]::new($false))

function Write-Line([string]$text = "") {
    $script:writer.WriteLine($text)
}

$count = 0
$bytes = 0

try {
    Write-Line "================================================================"
    Write-Line "PROJECT EXPORT"
    Write-Line "Root: $Root"
    Write-Line "Date: $((Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss")) UTC"
    Write-Line "================================================================"
    Write-Line ""

    Get-ChildItem -Path $Root -Recurse -File -Force | ForEach-Object {
        $file = $_
        $rel  = $file.FullName.Substring($Root.Length + 1).Replace('\','/')

        # preskoči sam izlazni fajl
        if ($file.FullName -eq $OutPath) { return }

        # preskoči ako je u isključenom folderu
        $parts = $rel.Split('/')
        foreach ($p in $parts) {
            if ($ExcludeDirs -contains $p) { return }
        }

        # preskoči po imenu
        if ($ExcludeFiles -contains $file.Name) { return }

        # preskoči .env*
        if ($file.Name -like ".env*") { return }

        # preskoči po ekstenziji
        $ext = $file.Extension.TrimStart('.').ToLower()
        if ($ExcludeExts -contains $ext) { return }

        # heuristika: preskoči binarne fajlove (proveri prvih 8KB)
        $fs = [System.IO.File]::OpenRead($file.FullName)
        try {
            $buf = New-Object byte[] ([Math]::Min(8192, $fs.Length))
            $n = $fs.Read($buf, 0, $buf.Length)
            for ($i = 0; $i -lt $n; $i++) {
                if ($buf[$i] -eq 0) { return }  # null bajt = binarno
            }
        } finally {
            $fs.Close()
        }

        $count++
        $bytes += $file.Length

        Write-Line "================================================================"
        Write-Line "FILE: $rel"
        Write-Line "SIZE: $($file.Length) bytes"
        Write-Line "================================================================"
        $content = [System.IO.File]::ReadAllText($file.FullName)
        Write-Line $content
        if (-not $content.EndsWith("`n")) { Write-Line "" }
        Write-Line ""
    }
} finally {
    $writer.Close()
}

Write-Host "✅ Gotovo."
Write-Host "   Fajlova: $count"
Write-Host "   Veličina: $([Math]::Round($bytes/1KB,1)) KB"
Write-Host "   Izlaz: $OutPath"