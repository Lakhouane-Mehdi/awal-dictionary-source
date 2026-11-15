# Fetch English-Kabyle pairs from HuggingFace Tatoeba-Translations dataset
# License: CC-BY 2.0 FR (Tatoeba Project)
# This script downloads rows in batches and filters for English source sentences

$examplesFile = Join-Path $PSScriptRoot "..\src\data\tatoeba_examples.json"
$batchSize = 100
$startOffset = 390000  # English-Kabyle pairs start around row 400,000
$maxBatches = 200      # Scan up to 20,000 rows from that point
$allEngPairs = @()

Write-Host "Fetching Tatoeba English-Kabyle pairs from HuggingFace..."

for ($i = 0; $i -lt $maxBatches; $i++) {
    $offset = $startOffset + ($i * $batchSize)
    $url = "https://datasets-server.huggingface.co/rows?dataset=Tamazight-NLP%2FTatoeba-Translations&config=default&split=train&offset=$offset&length=$batchSize"
    
    try {
        # Windows PowerShell 5.1's Invoke-RestMethod decodes responses without a
        # charset as Windows-1252, which garbled every ɣ/ḍ/ɛ in this data.
        # Decode the raw bytes as UTF-8 explicitly.
        $raw = Invoke-WebRequest -Uri $url -Headers @{"Accept"="application/json"} -TimeoutSec 15 -UseBasicParsing
        $response = [System.Text.Encoding]::UTF8.GetString($raw.RawContentStream.ToArray()) | ConvertFrom-Json
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

# Build examples JSON (sentence pairs for example display)
$examplesList = $allEngPairs | ForEach-Object {
    @{
        tamazight = $_.tamazight
        english = $_.english
    }
} | Select-Object -First 300

# Write output
$examplesList | ConvertTo-Json -Depth 5 | Set-Content -Path $examplesFile -Encoding UTF8
Write-Host "Wrote $($examplesList.Count) example sentences to $examplesFile"
