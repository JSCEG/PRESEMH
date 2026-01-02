$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open('c:\Proyectos\46.-Indicadores Eficiencia Energetica\20251125 Indicadores PRESEMH.xlsx')
    
    # We'll use indices based on previous list_sheets.ps1 output where they appeared
    # 1: Portada
    # ...
    # 21: I Marginación
    # 22: I Índice de pobreza
    # 23: I Años prom. esc.
    # 24: I Número de escuelas
    # 25: I Acceso a salud
    
    $indices = @(21, 22, 23, 24, 25)
    
    foreach ($idx in $indices) {
        $sheet = $wb.Sheets.Item($idx)
        Write-Output "=== SHEET: $($sheet.Name) ==="
        for ($r = 1; $r -le 15; $r++) {
            $rowVals = @()
            for ($c = 1; $c -le 8; $c++) {
                $v = $sheet.Cells.Item($r, $c).Value2
                if ($v -eq $null) { $v = "" }
                $rowVals += "$v"
            }
            Write-Output "R$r : $($rowVals -join ' | ')"
        }
        Write-Output ""
    }
    $wb.Close($false)
}
finally {
    $excel.Quit()
}
