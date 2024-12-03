# Running this script will look through your posts on a domain ran by Danbooru's software on {my_domain}
# for any edits made by anyone other than the uploader themselves.
# The two configurable parameters are below.

my_domain="danbooru.donmai.us"
my_uid="1211591"

import os
import requests
import json
from pprint import pprint
import base64

try:
    os.remove("tagedit_reports.html")
except:
    print("")

ids_to_check=[]
edits_to_lookat=[]
my_username=requests.get(f"https://danbooru.donmai.us/users/{my_uid}.json").json()['name']

slimit=200
page_cnt=1
search_query=f"user:{my_username}"
while(True):
    #print(f"https://danbooru.donmai.us/posts.json?tags={search_query}&page={page_cnt}&limit={slimit}")
    response = requests.get(f"https://danbooru.donmai.us/posts.json?tags={search_query}&page={page_cnt}&limit={slimit}").json()
    page_cnt=page_cnt+1
    for item in response:
        ids_to_check.append(item['id'])
    if(len(response)<slimit):
        break

cnt=0
for pid in ids_to_check:
    cnt=cnt+1
    print(f"{cnt} / {len(ids_to_check)}")
    url = f"https://danbooru.donmai.us/post_versions.json?search[post_id]={pid}"
    print(url)
    response = requests.get(url)
    data = response.json()
    for item in data:
        if(item['updater_id']!=int(my_uid) and item['version']!=1):
            item['updater_name'] = requests.get(f"https://danbooru.donmai.us/users/{item['updater_id']}.json").json()['name']
            post_info=requests.get(f"https://danbooru.donmai.us/posts/{item['post_id']}.json").json()
            if(("media_asset" in post_info.keys()) and ("variants" in post_info['media_asset'].keys()) ):
                item['post_thumbnail'] = post_info['media_asset']['variants'][0]['url']
                item['post_thumbnail_b64'] = (base64.b64encode(requests.get(item['post_thumbnail']).content)).decode("utf-8")
            else:
                item['post_thumbnail'] = ""
                item['post_thumbnail_b64'] = ""
            edits_to_lookat.append(item)

#pprint(edits_to_lookat)

edits_to_lookat=sorted(edits_to_lookat, key=lambda d: d['updated_at'])

html_to_out='''<div id="p-standard-listing">


  <table class="striped autofit" id="post-versions-table" width="100%">
    <thead>
      <tr>
        <th width="1%" class="post-version-select-column">
          <label><input type="checkbox" id="post-version-select-all-checkbox"
              class="post-version-select-checkbox"></label>
        </th>
        <th width="1%" class="post-column">
          Post
        </th>
        <th width="1%" class="version-column">
          Version
        </th>
        <th width="40%" class="tags-column">
          Tags
        </th>
        <th width="40%" class="edits-column">
          Edits
        </th>
        <th width="5%" class="changes-column">
          Changes
        </th>
        <th width="5%" class="updated-column">
          Updated
        </th>
        <th width="5%" class="action-column">
        </th>
      </tr>
    </thead>
    <tbody>'''

for edit in edits_to_lookat:
    html_to_out+=f'''

<tr id="post-version-{edit['id']}" data-id="{edit['id']}" data-post-id="{edit['id']}" data-updater-id="{edit['updater_id']}"
        data-updated-at="2024-11-26 14:51:45 +0100" data-rating-changed="true" data-parent-id="null"
        data-parent-changed="true" data-source-changed="true" data-version="1">
        <td class="post-version-select-column">
          <input type="checkbox" class="post-version-select-checkbox" disabled="">

        </td>
        <td class="post-column">
          <article id="post_8487149"
            class="post-preview post-status-pending post-preview-fit-fixed post-preview-180 blacklisted"
            data-id="8487149"
            data-tags="1other ^_^ aqua_hair black_necktie blue_sky closed_eyes collared_shirt gem_uniform_(houseki_no_kuni) glint grass highres houseki_no_kuni necktie open_mouth phosphophyllite shirt short_hair sitting sky smile white_shirt yoshioka_suke"
            data-rating="g" data-flags="pending" data-score="0" data-uploader-id="1070698">
            <div class="post-preview-container">
              <a class="post-preview-link" draggable="false" href="https://{my_domain}/posts/{edit['post_id']}">
                <img src="data:image/jpg;base64, {edit['post_thumbnail_b64']}" width="180" height="180" style='object-fit:contain;' draggable="false">
              </a>
            </div>
          </article>

        </td>
        <td class="version-column">
          <a href="/post_versions?search%5Bpost_id%5D=8487149&amp;type=current#post-version-60520499">8487149.1</a>

        </td>
        <td class="tags-column col-expand">
          <div>
            <b>Rating:</b> {edit['rating']}
            <b>Parent:</b> {edit['parent_id']}
          </div>
          <div>
            <b>Tags:</b>

            {edit['tags']}

          </div>
          <div>
            {edit['source']}
          </div>

        </td>
        <td class="edits-column col-expand">
          <span class="diff-list">
                <span style='color:green;'>{ ' '.join(edit['added_tags']) }</span><br>
                <span style='color:red;'>{' '.join(edit['removed_tags'])}</span><br>
                {edit['rating'] if edit['rating_changed'] else ""}<br>
                {edit['source'] if edit['source_changed'] else ""}<br>
          </span>

        </td>
        <td class="changes-column">
          <div class="version-statuses" data-altered="false"></div>

        </td>
        <td class="updated-column">
          <a class="user" data-user-id="{edit['updater_id']}" data-user-name="{edit['updater_name']}" data-user-level="32"
            href="https://{my_domain}/users/{edit['updater_id']}">{edit['updater_name']}</a>
          <div><time datetime="{edit['updated_at']}" title="{edit['updated_at']}">{edit['updated_at']}</time></div>
        </td>
        <td class="action-column">
        </td>
      </tr>    

    '''

html_to_out+='''</tbody>
  </table>
</div>'''

html_to_out=f'''
<html>
    <head>
        <link rel="stylesheet" href="https://danbooru.donmai.us/packs/css/application-8368ccdd.css">
    </head>
    <body>
        {html_to_out}
    </body>
</html>
'''

with open('tagedit_reports.html', 'a') as the_file:
    the_file.write(html_to_out)
