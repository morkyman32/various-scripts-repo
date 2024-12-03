import requests
import json
import pprint
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
from datetime import datetime

prominent_sockers=[
    {
        "username":"coaxcof", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1218601+%29&page="
    },
    {
        "username":"7annette997", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28810100+or+831677%29&page="
    },
    {
        "username":"AgusEXXX", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%281055275%29&page="
    },
    {
        "username":"sonicsucks20", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28439892%29&page="
    },
    {
        "username":"Kirb Porn", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+586886+%29&page="
    },
    {
        "username":"UN.SUNG", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1138300+%29&page="
    },
    {
        "username":"user 1166006", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1166006+%29&page="
    },
    {
        "username":"nadie22", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1117529+%29&page="
    },
    {
        "username":"michaelbyk16", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+831306+%29&page="
    },
    {
        "username":"Evillona57", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+981754+%29&page="
    },
    {
        "username":"darkimp72", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+945920+%29&page="
    },
    {
        "username":"Lucas 89", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1092610+%29&page="
    },
    {
        "username":"SydBarrett", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+965798+%29&page="
    },
    {
        "username":"greenfield", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+542664+%29&page="
    },
    {
        "username":"ChanMyaeAungThu", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+838083+%29&page="
    },
    {
        "username":"nutsmi", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+822718+%29&page="
    },
    {
        "username":"Darkmetaknight", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+(615218 or 612269 or 557157)+%29&page="
    },
    {
        "username":"SukaSuka", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+981485+%29&page="
    },
    {
        "username":"Ishinashi", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1062962+%29&page="
    },
    {
        "username":"Metal-Tyrannoid", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+555458+%29&page="
    },
    {
        "username":"Provence", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+525419+%29&page="
    },
    {
        "username":"Leonxu", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+565130+%29&page="
    },
    {
        "username":"SamoanPup", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+579083+%29&page="
    },
    {
        "username":"Duke Dirtfarmer", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+606395+%29&page="
    },
    {
        "username":"Juan.Dela.Cruz", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+574220+%29&page="
    },
    {
        "username":"Niankobayashi/Alice666", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+740900+%29&page="
    },
    {
        "username":"welkukazama", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+180616+%29&page="
    },
    {
        "username":"beefbeans", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1057830+%29&page="
    },
    {
        "username":"Hitchi", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+734532+%29&page="
    },
    {
        "username":"omhomh8", 
        "urlprefix":"https://danbooru.donmai.us/mod_actions.json?commit=Search&search%5Bcategory%5D=user_ban&search%5Bdescription_matches%5D=sockpuppet+%28+1112200+%29&page="
    },

]

def calculate_usersock(urlsearch):
    check50=True
    check20=True
    check10=True
    check5=True


    maxRecordsPerPage=20
    sum=0
    page=1
    url=urlsearch+str(page)
    datas=json.loads(requests.get(url).text)
    first_sock_create_date="?"
    last_sock_create_date="?"

    if(len(datas)!=0):
        last_sock_create_date=datas[0]["created_at"]
        first_sock_create_date=datas[len(datas)-1]["created_at"]
        #print(last_sock_create_date)

    currentNum=len(datas)
    sum=sum+currentNum
    while(currentNum!=0):
        page=page+1
        url=urlsearch+str(page)
        datas=json.loads(requests.get(url).text)
        currentNum=len(datas)
        sum=sum+currentNum
        print(currentNum, page)

        if(currentNum==maxRecordsPerPage):
            
            if(check50):
                SKIPurl=urlsearch+str(page+50)
                SKIPcurrentNum=len(json.loads(requests.get(SKIPurl).text))
                if(SKIPcurrentNum==maxRecordsPerPage):
                    page=page+50
                    sum=sum+50*maxRecordsPerPage
                    print(SKIPcurrentNum, page)
                    continue
                else:
                    check50=False

            if(check20):
                SKIPurl=urlsearch+str(page+20)
                SKIPcurrentNum=len(json.loads(requests.get(SKIPurl).text))
                if(SKIPcurrentNum==maxRecordsPerPage):
                    page=page+20
                    sum=sum+20*maxRecordsPerPage
                    print(SKIPcurrentNum, page)
                    continue
                else:
                    check20=False

            if(check10):
                SKIPurl=urlsearch+str(page+10)
                SKIPcurrentNum=len(json.loads(requests.get(SKIPurl).text))
                if(SKIPcurrentNum==maxRecordsPerPage):
                    page=page+10
                    sum=sum+10*maxRecordsPerPage
                    print(SKIPcurrentNum, page)
                    continue
                else:
                    check10=False

            if(check5):
                SKIPurl=urlsearch+str(page+5-1)
                SKIPcurrentNum=len(json.loads(requests.get(SKIPurl).text))
                if(SKIPcurrentNum==maxRecordsPerPage):
                    page=page+5-1
                    sum=sum+(5-1)*maxRecordsPerPage
                    print(SKIPcurrentNum, page)
                    continue
                else:
                    check5=False

    if((page>1) and (currentNum==0)):
        url=urlsearch+str(page-1)
        datas=json.loads(requests.get(url).text)
        first_sock_create_date=datas[len(datas)-1]["created_at"]

    return {"s":sum,"f":first_sock_create_date,"l":last_sock_create_date}

def create_sock_production_chart(data):
  """
  Creates a horizontal bar chart for sock production data.

  Args:
      data: A list of dictionaries, where each dictionary has keys 'username' and 'socks_produced'.
  """

  sorted_data = sorted(data, key=lambda item: item['socks_produced'], reverse=True)

  usernames = [item['username'] for item in sorted_data]
  socks_produced = [item['socks_produced'] for item in sorted_data]

  plt.figure(figsize=(10, 6))
  plt.barh(usernames, socks_produced, color='lightcoral')

  plt.xlabel('Number of Socks Produced')
  plt.ylabel('Username')
  plt.title('Sock Production by User (Most to Least)')

  plt.xlim(0, max(socks_produced) + 100)  # Set x-axis limits slightly beyond max value
  locator = ticker.MultipleLocator(100)  # Create a locator for every 100 units
  plt.gca().invert_yaxis()  

  plt.grid(axis='x', linestyle='--', alpha=0.6)

  plt.tight_layout()
  plt.show()

def dtext_table_string(data):
    mystr=""
    mystr=mystr='''
    [table]
        [thead]
            [tr]
            [th colspan="3" align="center"]Table[/th]
            [/tr]
            [tr align="center"]
            [th]Username[/th]
            [th]Socks produced[/th]
            [th]First sock create date[/th]
            [th]Latest sock create date[/th]
            [/tr]
        [/thead]
        [tbody]
    '''
    for socker in socker_stats:
        mystr=mystr+f"""
        [tr]
            [td align="left"]{socker["username"]}[/td]
            [td align="right"]{socker["socks_produced"]}[/td]
            [td align="center"]{ datetime.strptime(socker["first_sock_create_date"], "%Y-%m-%dT%H:%M:%S.%f%z").strftime("%Y-%m-%d   %H:%M:%S") }[/td]
            [td align="center"]{ datetime.strptime(socker["last_sock_create_date"], "%Y-%m-%dT%H:%M:%S.%f%z").strftime("%Y-%m-%d   %H:%M:%S") }[/td]
        [/tr]
        """
# [td align="center"]{ datetime.strptime(socker["first_sock_create_date"], "%Y-%m-%dT%H:%M:%S.%f%z").strftime("%Y-%m-%d   %H:%M:%S") }[/td]
# [td align="center"]{ datetime.strptime(socker["last_sock_create_date"], "%Y-%m-%dT%H:%M:%S.%f%z").strftime("%Y-%m-%d   %H:%M:%S") }[/td]

    mystr=mystr+"[/tbody][/table]"
    return mystr

socker_stats=[]

for socker in prominent_sockers:
    print("Calculating data for "+socker["username"]+"...")
    calculateddata=calculate_usersock(socker["urlprefix"])
    socker_stats.append( {"username":socker["username"], "socks_produced": calculateddata["s"],"first_sock_create_date":calculateddata["f"],"last_sock_create_date":calculateddata["l"] } )

socker_stats = sorted(socker_stats, key=lambda item: item['socks_produced'], reverse=True)

#create_sock_production_chart(socker_stats)
print(dtext_table_string(socker_stats))
#pprint.pprint(socker_stats)
