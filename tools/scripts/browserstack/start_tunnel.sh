export BROWSER_STACK_ACCESS_KEY=`echo $BROWSER_STACK_ACCESS_KEY | rev`

node ./tools/scripts/browserstack/start_tunnel.js &
