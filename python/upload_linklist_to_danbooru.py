# This script uploads all links from a file containing a list of links separated by a newline character
# It checks if it was already uploaded as a media asset or a post
# auth_db.txt:
# danbooru.donmai.us (window.location.host)
# USERNAME
# API_KEY

import requests
import base64

auth_file="auth_db.txt"
url_list= "urllist.txt"

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def upload_to_danbooru(domain,auth_string):
    destination=f"https://{domain}/uploads.json"
    encoded_auth_string = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    data = {"source": link_to_upload}

    response = requests.post(
        destination,
        headers={
            "Authorization": f"Basic {encoded_auth_string}",
            "Content-Type": "application/json"
        },
        json=data
    )



with open(auth_file) as f:
    file_lines=(f.readlines())
    domain=file_lines[0].replace("\n","")
    username=file_lines[1].replace("\n","")
    api_key=file_lines[2].replace("\n","")

    auth_string = f"{username}:{api_key}"

    with open(url_list) as urlf:
        list_of_links=urlf.readlines()
        total_link_count=len(list_of_links)
        prog_counter=1
        for link_to_upload in list_of_links:
            link_to_upload=link_to_upload.replace("\n","")
            print(f"[{prog_counter}/{total_link_count}] "+link_to_upload)
            prog_counter=prog_counter+1

            # Check if asset was uploaded
            response = requests.get(f"https://{domain}/uploads.json?commit=Search&search[source_ilike]={link_to_upload}&api_key={api_key}&login={username}")
            assets_with_thesource = response.json()

            corrected_source=link_to_upload.replace("x.com","twitter.com")
            tagstring="source:{corrected_source}"

            response = requests.get(f"https://{domain}/posts.json?tags={tagstring}")
            posts_with_thesource = response.json()

            if( (len(assets_with_thesource)==0 or assets_with_thesource[0]["error"]!=None) and len(posts_with_thesource)==0):
                upload_to_danbooru(domain,auth_string)
                response = requests.get(f"https://{domain}/uploads.json?commit=Search&search[source_ilike]={link_to_upload}&api_key={api_key}&login={username}")
                assets_with_thesource = response.json()
                if(assets_with_thesource==0 or assets_with_thesource[0]["error"]!=None):
                    print(bcolors.FAIL+"FAIL! Either the processed link or API are broken." + bcolors.ENDC)
                    exit()
                print(bcolors.OKGREEN+"Link was processed." + bcolors.ENDC)
            else:
                print(bcolors.WARNING + f"Link was skipped, asset already uploaded. (https://{domain}/uploads/{assets_with_thesource[0]["id"]})" + bcolors.ENDC)
            print()
