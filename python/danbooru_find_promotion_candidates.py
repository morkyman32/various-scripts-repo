#curl "https://raw.githubusercontent.com/mdpakk/my-scripts-repo/refs/heads/main/python/danbooru_find_promotion_candidates.py" | python

import requests
from datetime import datetime

web_domain="danbooru.donmai.us"

def write_output(text):
    filename="output.csv"
    with open(filename, "a") as f:
            f.write(text+"\n")
            print(text)

response=[]
candidates=[]
page_cnt=1

write_output(f"user_id,user_name,upload_count,deletion_percentage,60days_upload_count,60days_count_perc,post_update_count,related_tags,deserved_role")
browsing_by_uploads=True
browsing_by_postedits=True

while ( ((len(response) == 20) or page_cnt==1) and browsing_by_uploads ):
    response = requests.get(f'https://{web_domain}/users.json?commit=Search&page='+str(page_cnt)+'&search%5Blevel%5D=20&search%5Border%5D=post_upload_count')
    response=response.json()
    page_cnt=page_cnt+1
    #print(response)
    #print(len(response))
    for item in response:
        #print(item)
        user_data=requests.get(f'https://{web_domain}/users/'+str(item['id']) + ".json" ).json()
        deletion_count=requests.get(f'https://{web_domain}/counts/posts.json?tags='+'user:'+user_data['name']+' status:deleted' ).json()['counts']['posts']
        deletion_percentage= (deletion_count / user_data["post_upload_count"]) * 100
        deletion_percentage=round(deletion_percentage,2)

        uploads_last60days_count=requests.get(f'https://{web_domain}/counts/posts.json?tags=user:{user_data['name']} age:<=60d').json()['counts']['posts']
        uploads_last60days_count_deleted=requests.get(f'https://{web_domain}/counts/posts.json?tags=user:{user_data['name']} age:<=60d status:deleted').json()['counts']['posts']
        if(uploads_last60days_count==0):
            uploads_last60days_count_perc=0
        else:
            uploads_last60days_count_perc=round((uploads_last60days_count_deleted / uploads_last60days_count) * 100,2)

        latest_upload_date=requests.get(f'https://{web_domain}/posts.json?tags=user:'+user_data['name'] ).json()[0]['created_at'][0:19].replace("T"," ")
        latest_upload_date=datetime.strptime(latest_upload_date,"%Y-%m-%d %H:%M:%S")
        days_since_last_upload=(datetime.now() - latest_upload_date).days
        is_uploader_active=(days_since_last_upload < 30 and uploads_last60days_count >= 10)
        #print(latest_upload_date, days_since_last_upload, is_uploader_active)

        neg_response = requests.get(f'https://{web_domain}/user_feedbacks.json?commit=Search&search%5Bcategory%5D=negative&search%5Buser_name%5D={user_data['name']}').json()
        recently_negged=False
        if(len(neg_response))==0:
            recently_negged=False
        else:
            latest_negged_date=neg_response[0]['created_at'][0:19].replace("T"," ")
            latest_negged_date=datetime.strptime(latest_negged_date,"%Y-%m-%d %H:%M:%S")
            days_since_last_negged=(datetime.now() - latest_negged_date).days
            if(days_since_last_negged<=180):
                recently_negged=True

        related_tags_array=requests.get(f'https://{web_domain}/related_tag.json?commit=Search&search%5Bquery%5D=user:{user_data['name']}').json()["related_tags"]
        related_tags_str=""
        for item in related_tags_array:
            related_tags_str=related_tags_str+f"{item["tag"]["name"]} ({ round(item["frequency"]*100,2) }%) | "
            if(item["frequency"]<0.3):
                break

        if(user_data['post_upload_count']<500):
            browsing_by_uploads=False
            break
        if( user_data['post_upload_count']>=600 and (not recently_negged) and ((deletion_percentage<5 and user_data["post_upload_count"]>=1000) or (uploads_last60days_count_perc<=1)) and user_data['is_banned']==False and is_uploader_active):
            #print(f"{user_data['name']} (id: {item['id']}): {deletion_percentage}% of {user_data['post_upload_count']} uploads, last 60 days: {uploads_last60days_count_perc}% of {uploads_last60days_count} uploads: CONTRIBUTOR")
            write_output(f"{user_data['id']},{user_data['name']},{user_data['post_upload_count']},{deletion_percentage}%,{uploads_last60days_count},{uploads_last60days_count_perc}%,{user_data['post_update_count']},{related_tags_str},CONTRIBUTOR")
        elif( user_data['post_upload_count']>=600 and (not recently_negged) and (deletion_percentage<30) and user_data['is_banned']==False and is_uploader_active):
            write_output(f"{user_data['id']},{user_data['name']},{user_data['post_upload_count']},{deletion_percentage}%,{uploads_last60days_count},{uploads_last60days_count_perc}%,{user_data['post_update_count']},{related_tags_str},BUILDER")
        elif((not recently_negged) and (uploads_last60days_count_perc<20 and uploads_last60days_count>=100) and user_data['is_banned']==False and is_uploader_active):
            write_output(f"{user_data['id']},{user_data['name']},{user_data['post_upload_count']},{deletion_percentage}%,{uploads_last60days_count},{uploads_last60days_count_perc}%,{user_data['post_update_count']},{related_tags_str},PROMISING")
        #elif((not recently_negged) and user_data['is_banned']==False):
            #write_output(f"{user_data['id']},{user_data['name']},{user_data['post_upload_count']},{deletion_percentage}%,{uploads_last60days_count},{uploads_last60days_count_perc}%,{user_data['post_update_count']},{related_tags_str},MEMBER")
