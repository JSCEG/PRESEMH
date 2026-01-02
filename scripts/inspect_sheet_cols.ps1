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
        Write-Output "--- SHEET: $($sheet.Name) ---"
        for ($r = 1; $r -le 5; $r++) {
            $rowVals = @()
            for ($c = 1; $c -le 20; $c++) {
                $v = $sheet.Cells.Item($r, $c).Value2
                if ($v -eq $null) { $v = "" }
                $rowVals += "$v"
            }
            Write-Output "R$r : $($rowVals -join ' | ')"
        }
    }
    $wb.Close($false)
}
finally {
    $excel.Quit()
}
