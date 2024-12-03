import requests
import sys
import json
import os
import os.path
import pathlib
import base64

# api_key_query_str -> "username:auth_key"
# read u_auth_key && python danbooru_bk.py "${u_auth_key}"

domain_address="danbooru.donmai.us"
dir_save="danbooru_bkp/"

api_key_query_str=''
uname_api_key=''
try:
    uname_api_key=sys.argv[1]
    api_key_query_str=f'--header "Authorization: Basic $(printf "%s" "{uname_api_key}" | base64)"'
    auth = (uname_api_key.split(":")[0], uname_api_key.split(":")[1])
except IndexError:
    api_key_query_str = ''

search_query="fav:yooyooko -favgroup:any"

try:
    os.mkdir(f"{dir_save}")
except Exception:
    pass

response=["firstelem"]
page_cnt=1
while len(response)>0:
    if(uname_api_key!=''):
        response = requests.get(f'https://{domain_address}/posts.json?tags={search_query}+&limit=200&page={page_cnt}',auth=auth,verify=False)
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
            if ((not os.path.isfile(f"{dir_save}/{str(item['id'])}{pathlib.Path(item['file_url']).suffix}")) and (not os.path.isfile(f"{dir_save}/{str(item['id'])}.avif"))):
                os.system(f"curl '{item['file_url']}' >> {dir_save}/{item['id']}{pathlib.Path(item['file_url']).suffix} --insecure")
        except KeyError:
            pass
    page_cnt=page_cnt+1
