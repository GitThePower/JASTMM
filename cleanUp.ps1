Get-ChildItem bin -Recurse | Where{$_.Name -Match ".+\.(d\.t|j)s"} | Remove-Item
Get-ChildItem lib -Recurse | Where{$_.Name -Match ".+\.(d\.t|j)s"} | Remove-Item
Get-ChildItem local-config -Recurse | Where{$_.Name -Match ".+\.(d\.t|j)s"} | Remove-Item
Get-ChildItem test/lib -Recurse | Where{$_.Name -Match ".+\.(d\.t|j)s"} | Remove-Item