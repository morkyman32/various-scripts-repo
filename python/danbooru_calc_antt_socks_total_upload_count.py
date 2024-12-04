import requests 

query="#810100 or #831677"
user_ids=[810100,831677]

socks_per_page=20

response=[]
page_cnt=1

while (len(response) == 20 or page_cnt==1):
    response = requests.get('https://danbooru.donmai.us/bans.json?commit=Search&page='+str(page_cnt)+'&search%5Border%5D=id_desc&search%5Breason_matches%5D=%23810100+or+%23831677')
    response=response.json()
    page_cnt=page_cnt+1
    #print(response)
    print(len(response))
    for item in response:
        user_ids.append(item['user_id'])
        with open("output.txt", "a") as f:
            f.write('a[data-user-id="'+str(item['user_id'])+'"]:after, ')

# exit()
uploads_count=0
deletes_count=0

for user_id in user_ids:
    response = requests.get('https://danbooru.donmai.us/users/'+str(user_id)+".json")
    username = response.json()["name"]

    query1="user:"+username
    query2="user:"+username+" status:deleted"
    response = requests.get('https://danbooru.donmai.us/counts/posts.json?tags='+query1)
    uploads_count+=response.json()["counts"]["posts"]
    response = requests.get('https://danbooru.donmai.us/counts/posts.json?tags='+query2)
    deletes_count+=response.json()["counts"]["posts"]
    print('https://danbooru.donmai.us/counts/posts.json?tags='+query1)
    print(uploads_count,deletes_count)
