# Fetch Tamazight words + definitions from Wiktionary API
# License: CC-BY-SA 4.0 / GFDL (Wiktionary)
# Fetches Central Atlas Tamazight lemmas + Kabyle lemmas and extracts English definitions

param(
    [int]$MaxWords = 500
)

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outputFile = Join-Path $PSScriptRoot "..\src\data\wiktionary_words.json"
$allWords = @()
$processedTitles = @{}

function Get-CategoryMembers {
    param([string]$Category, [int]$Limit = 500)
    
    $members = @()
    $cmcontinue = $null
    
    do {
        $params = "action=query&list=categorymembers&cmtitle=$Category&cmlimit=500&format=json"
        if ($cmcontinue) { $params += "&cmcontinue=$cmcontinue" }
        
        $url = "https://en.wiktionary.org/w/api.php?$params"
        try {
            $resp = Invoke-RestMethod -Uri $url -UseBasicParsing -TimeoutSec 15
            $members += $resp.query.categorymembers
            $cmcontinue = $resp.continue.cmcontinue
        } catch {
            Write-Host "  Error fetching category: $_"
            break
        }
        
        Start-Sleep -Milliseconds 200
    } while ($cmcontinue -and $members.Count -lt $Limit)
    
    return $members
}

function Get-WordDefinition {
    param([string]$Title)
    
    $encodedTitle = [System.Uri]::EscapeDataString($Title)
    $url = "https://en.wiktionary.org/w/api.php?action=parse&page=$encodedTitle&prop=wikitext&format=json"
    
    try {
        $resp = Invoke-RestMethod -Uri $url -UseBasicParsing -TimeoutSec 15
        $wikitext = $resp.parse.wikitext.'*'
        
        if (-not $wikitext) { return $null }
        
        # Extract English definitions from wikitext
        # Look for lines starting with # that contain definition text
        $definitions = @()
        $lines = $wikitext -split "`n"
        $inTamazight = $false
        
        foreach ($line in $lines) {
            if ($line -match "^==Central Atlas Tamazight==" -or $line -match "^==Kabyle==" -or $line -match "^==Berber==" -or $line -match "^==Tamazight==") {
                $inTamazight = $true
            }
            elseif ($line -match "^==[^=]" -and $inTamazight) {
                break
            }
            
            if ($inTamazight -and $line -match "^#\s+(.+)") {
                $def = $Matches[1]
                # Clean wiki markup
                $def = $def -replace '\{\{[^}]*\}\}', ''
                $def = $def -replace '\[\[([^\]|]*\|)?([^\]]*)\]\]', '$2'
                $def = $def -replace "'''", ''
                $def = $def -replace "''", ''
                $def = $def.Trim()
                if ($def.Length -gt 1 -and $def -notmatch "^[\{\}]") {
                    $definitions += $def
                }
            }
        }
        
        return $definitions -join "; "
    } catch {
        return $null
    }
}

# Categories to scrape
$categories = @(
    "Category:Central_Atlas_Tamazight_lemmas",
    "Category:Kabyle_lemmas"
)

Write-Host "=== Wiktionary Tamazight Dictionary Fetcher ==="
Write-Host "License: CC-BY-SA 4.0 / GFDL"
Write-Host ""

foreach ($cat in $categories) {
    Write-Host "Fetching category: $cat"
    $members = Get-CategoryMembers -Category $cat -Limit $MaxWords
    Write-Host "  Found $($members.Count) entries"
    
    $count = 0
    foreach ($member in $members) {
        $title = $member.title
        
        # Skip already processed
        if ($processedTitles.ContainsKey($title)) { continue }
        $processedTitles[$title] = $true
        
        # Skip non-word entries (categories, templates, etc.)
        if ($title -match "^(Category|Template|Appendix|Module):") { continue }
        if ($title.Length -lt 2) { continue }
        
        $definition = Get-WordDefinition -Title $title
        
        if ($definition -and $definition.Length -gt 1) {
            $allWords += @{
                tifinagh = $title
                definition = $definition
            }
            $count++
            Write-Host "  [$count] $title -> $definition"
        }
        
        Start-Sleep -Milliseconds 300
        
        if ($allWords.Count -ge $MaxWords) { break }
    }
    
    if ($allWords.Count -ge $MaxWords) { break }
}

Write-Host ""
Write-Host "Total words with definitions: $($allWords.Count)"

# Write output
$allWords | ConvertTo-Json -Depth 5 -Compress:$false | Set-Content -Path $outputFile -Encoding UTF8
Write-Host "Wrote to $outputFile"
