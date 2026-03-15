# Fetch English-Kabyle pairs from HuggingFace Tatoeba-Translations dataset
# License: CC-BY 2.0 FR (Tatoeba Project)
# This script downloads rows in batches and filters for English source sentences

$outputFile = Join-Path $PSScriptRoot "..\src\data\tatoeba_words.json"
$examplesFile = Join-Path $PSScriptRoot "..\src\data\tatoeba_examples.json"
$batchSize = 100
$maxBatches = 200  # Up to 20,000 rows to scan
$allEngPairs = @()

Write-Host "Fetching Tatoeba English-Kabyle pairs from HuggingFace..."

for ($i = 0; $i -lt $maxBatches; $i++) {
    $offset = $i * $batchSize
    $url = "https://datasets-server.huggingface.co/rows?dataset=Tamazight-NLP%2FTatoeba-Translations&config=default&split=train&offset=$offset&length=$batchSize"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers @{"Accept"="application/json"} -TimeoutSec 15
        $rows = $response.rows
        
        if ($rows.Count -eq 0) { break }
        
        foreach ($row in $rows) {
            $r = $row.row
            if ($r.source_lang -eq "eng" -and ($r.target_lang -eq "kab" -or $r.target_lang -eq "ber")) {
                $allEngPairs += @{
                    english = $r.source_string
                    tamazight = $r.target_string
                    lang = $r.target_lang
                    src_id = $r.id_src
                    tgt_id = $r.id_tgt
                }
            }
        }
        
        Write-Host "Batch $($i+1)/$maxBatches (offset $offset): Found $($allEngPairs.Count) English pairs so far"
        
        # Early exit if we have enough
        if ($allEngPairs.Count -ge 500) {
            Write-Host "Reached 500 pairs, stopping."
            break
        }
    }
    catch {
        Write-Host "Error at batch $($i+1): $_"
        Start-Sleep -Seconds 2
        continue
    }
    
    # Rate limiting
    Start-Sleep -Milliseconds 300
}

Write-Host "`nTotal English-Kabyle pairs found: $($allEngPairs.Count)"

# Deduplicate by target string and extract unique words
$uniqueWords = @{}

foreach ($pair in $allEngPairs) {
    $tam = $pair.tamazight.Trim()
    $eng = $pair.english.Trim()
    # Extract individual words from Tamazight sentence for dictionary entries
    $words = $tam -split '\s+' | Where-Object { $_.Length -ge 2 }
    
    foreach ($word in $words) {
        $lower = $word.ToLower()
        if (-not $uniqueWords.ContainsKey($lower)) {
            $uniqueWords[$lower] = @{
                tamazight = $word
                sentences = @()
            }
        }
    }
    
    # Store full sentence pair as example
    # Map it to each word in the sentence
    foreach ($word in $words) {
        $lower = $word.ToLower()
        if ($uniqueWords[$lower].sentences.Count -lt 3) {
            $uniqueWords[$lower].sentences += @{
                tamazight = $tam
                english = $eng
            }
        }
    }
}

# Build word entries JSON
$entries = @()
foreach ($key in $uniqueWords.Keys | Sort-Object) {
    $w = $uniqueWords[$key]
    $entries += @{
        tamazight = $w.tamazight
        examples = $w.sentences
    }
}

# Build examples JSON (sentence pairs for example display)
$examplesList = $allEngPairs | ForEach-Object {
    @{
        tamazight = $_.tamazight
        english = $_.english
    }
} | Select-Object -First 300

# Write output
$entries | ConvertTo-Json -Depth 5 | Set-Content -Path $outputFile -Encoding UTF8
Write-Host "Wrote $($entries.Count) word entries to $outputFile"

$examplesList | ConvertTo-Json -Depth 5 | Set-Content -Path $examplesFile -Encoding UTF8
Write-Host "Wrote $($examplesList.Count) example sentences to $examplesFile"
