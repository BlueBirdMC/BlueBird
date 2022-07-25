running=1
echo The server is being started!! NOTE: The server will automatically restart on crash/kill!

finish()
{
    running=0
}

trap finish SIGINT

while (( running )); do
    node start.js
    echo "The server either CRASHED or was killed... Starting a force restart."
    sleep 2
done
