gamejssum=$(echo "sha384-"$(openssl dgst -sha384 -binary game.js | openssl base64 -A))
playerjssum=$(echo "sha384-"$(openssl dgst -sha384 -binary player.js | openssl base64 -A))
gamestatejssum=$(echo "sha384-"$(openssl dgst -sha384 -binary gamestate.js | openssl base64 -A))
rendererjssum=$(echo "sha384-"$(openssl dgst -sha384 -binary renderer.js | openssl base64 -A))
resourcesjssum=$(echo "sha384-"$(openssl dgst -sha384 -binary resources.js | openssl base64 -A))
utilsjssum=$(echo "sha384-"$(openssl dgst -sha384 -binary utils.js | openssl base64 -A))
stylecsssum=$(echo "sha384-"$(openssl dgst -sha384 -binary style.css | openssl base64 -A))
powerupsjssum=$(echo "sha384-"$(openssl dgst -sha384 -binary powerups.js | openssl base64 -A))
linejssum=$(echo "sha384-"$(openssl dgst -sha384 -binary line-segments-intersect.js | openssl base64 -A))

srijson="{\"gamejssum\": \"$gamejssum\", \"playerjssum\": \"$playerjssum\", \"gamestatejssum\": \"$gamestatejssum\", \"rendererjssum\": \"$rendererjssum\", \"resourcesjssum\": \"$resourcesjssum\", \"utilsjssum\": \"$utilsjssum\", \"stylecsssum\": \"$stylecsssum\", \"powerupsjssum\": \"$powerupsjssum\", \"linejssum\": \"$linejssum\"}"

echo $srijson > /tmp/srihashes

j2 -f json index.html.j2 /tmp/srihashes > index.html
