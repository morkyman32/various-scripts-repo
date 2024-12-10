# This script backs up every danbooru (or any other configurable domain) post under the search_query which can be specified below

import requests
import sys
import json
import os
import os.path
import pathlib
import base64

# api_key_query_str -> "username:auth_key"
# read u_auth_key && python danbooru_bk.py "${u_auth_key}"

search_query="(user:swpedia.nt) status:any"
domain_address="gaybooru.app"
dir_save="gaybooru_bkp/"

api_key_query_str=''
uname_api_key=''
api_key=''
username=''
try:
    uname_api_key=sys.argv[1]
    api_key_query_str=f'--header "Authorization: Basic $(printf "%s" "{uname_api_key}" | base64)"'
    auth = (uname_api_key.split(":")[0], uname_api_key.split(":")[1])
    api_key=uname_api_key.split(":")[1]
    username=uname_api_key.split(":")[0]
except IndexError:
    api_key_query_str = ''

try:
    os.mkdir(f"{dir_save}")
except Exception:
    pass

response=["firstelem"]
page_cnt=1
while len(response)>0:
    if(uname_api_key!=''):
        print(f'https://{domain_address}/posts.json?tags={search_query}+&limit=200&page={page_cnt}&api_key={api_key}&login={username}')
        response = requests.get(f'https://{domain_address}/posts.json?tags={search_query}+&limit=200&page={page_cnt}&api_key={api_key}&login={username}',verify=False)
    else:
        response = requests.get(f'https://{domain_address}/posts.json?tags={search_query}+&limit=200&page={page_cnt}',verify=False)
    response=response.json()
    print(f'https://{domain_address}/posts.json?tags={search_query}+&page={page_cnt}')
    for item in response:
        #print(item)
        if(not os.path.isfile(f"{dir_save}/{str(item['id'])}.json")):
            f = open(f"{dir_save}/{item['id']}.json", "a")
            f.write(json.dumps(item))
            f.close()
        try:
            if ((not os.path.isfile(f"{dir_save}/{str(item['id'])}{pathlib.Path(item['file_url']).suffix}")) and (not os.path.isfile(f"{dir_save}/{str(item['id'])}.avif")) and (not os.path.isfile(f"{dir_save}/{str(item['id'])}.avif.ync")) and (not os.path.isfile(f"{dir_save}/{str(item['id'])}.mp4.ync")) and (not os.path.isfile(f"{dir_save}/{str(item['id'])}.json"))):
                os.system(f"curl '{item['file_url']}' >> {dir_save}/{item['id']}{pathlib.Path(item['file_url']).suffix} --insecure")
        except KeyError:
            pass
    page_cnt=page_cnt+1
