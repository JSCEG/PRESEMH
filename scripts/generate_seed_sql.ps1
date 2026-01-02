$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open('c:\Proyectos\46.-Indicadores Eficiencia Energetica\20251125 Indicadores PRESEMH.xlsx')
    $sheet = $null
    foreach ($s in $wb.Sheets) {
        if ($s.Name -like "*Valores reales municipales*") {
            $sheet = $s
            break
        }
    }

    if ($sheet) {
        $lines = @()
        $lines += "INSERT INTO public.municipalities (cvegeo, name, state) VALUES"
        
        $entries = @()
        for ($r = 5; $r -le 2500; $r++) {
            $cvegeo = $sheet.Cells.Item($r, 2).Value2
            $state = $sheet.Cells.Item($r, 3).Value2
            $name = $sheet.Cells.Item($r, 4).Value2
            
            # Skip empty or separator rows
            if (!$cvegeo -or $cvegeo -eq "" -or $cvegeo -eq "-") { continue }
            
            $cleanName = "$name".Replace("'", "''")
            $cleanState = "$state".Replace("'", "''")
            
            $entries += "('$cvegeo', '$cleanName', '$cleanState')"
        }
        
        $sql = $lines[0] + "`n" + ($entries -join ",`n") + "`nON CONFLICT (cvegeo) DO UPDATE SET name = EXCLUDED.name, state = EXCLUDED.state;"
        
        [System.IO.File]::WriteAllText('c:\Proyectos\46.-Indicadores Eficiencia Energetica\scripts\seed_municipalities.sql', $sql, [System.Text.Encoding]::UTF8)
        Write-Output "Successfully generated seed_municipalities.sql with $($entries.Count) entries."
    }
    $wb.Close($false)
}
finally {
    $excel.Quit()
}
