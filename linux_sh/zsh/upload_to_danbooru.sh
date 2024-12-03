#!/bin/zsh

auth_file="auth_danbooru.txt"

username=$(cat $auth_file | head -n 2 | tail -n 1)
api_key=$(cat $auth_file | head -n 3 | tail -n 1)
destination=$(cat $auth_file | head -n 1 | tail -n 1)
destination="https://$destination/uploads.json"

filetoup="$1"

echo "{'source':'${filetoup}'}"

curl -X POST --header "Authorization: Basic $(printf "%s" "$username:$api_key" | base64)" -d "{\"source\":\"${filetoup}\"}" -H "Content-Type: application/json" ${destination}
