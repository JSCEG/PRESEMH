$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open('c:\Proyectos\46.-Indicadores Eficiencia Energetica\20251125 Indicadores PRESEMH.xlsx')
    foreach ($sheet in $wb.Sheets) {
        Write-Output $sheet.Name
    }
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
