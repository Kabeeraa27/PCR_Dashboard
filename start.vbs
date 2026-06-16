Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c node server.js", 0, False
WScript.Sleep 3000
WshShell.Run "http://localhost:3001"