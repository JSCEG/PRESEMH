$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open('c:\Proyectos\46.-Indicadores Eficiencia Energetica\20251125 Indicadores PRESEMH.xlsx')
    $sheetsToReview = @()
    foreach ($sheet in $wb.Sheets) {
        if ($sheet.Name -like "I *") {
            $sheetsToReview += $sheet.Name
        }
    }

    foreach ($sheetName in $sheetsToReview) {
        Write-Output "--- SHEET: $sheetName ---"
        $sheet = $wb.Sheets.Item($sheetName)
        
        # Get Headers (First row)
        $headers = @()
        for ($col = 1; $col -le 10; $col++) {
            $val = $sheet.Cells.Item(1, $col).Text
            if ($val) { $headers += $val }
        }
        $headerStr = $headers -join ", "
        Write-Output "Headers: $headerStr"

        # Get first 3 data rows to see values
        for ($r = 2; $r -le 5; $r++) {
            $rowData = @()
            for ($c = 1; $c -le $headers.Count; $c++) {
                $rowData += $sheet.Cells.Item($r, $c).Text
            }
            $rowStr = $rowData -join " | "
            Write-Output "Row $r : $rowStr"
        }
        Write-Output ""
    }
    $wb.Close($false)
}
finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
