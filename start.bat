@echo off
echo The server is being started!! NOTE: The server will automatically restart on crash/kill!
:main
node start.js
echo The server either CRASHED or was killed... Starting a force restart.
goto main
