#!/bin/zsh

script_name=howru.sh
for pid in $(pidof -x $script_name); do
    if [ $pid != $$ ]; then
        kill -9 $pid
    fi
done

my_interval=1250

mkdir ~/Documents/dhda_jrnl/
mkdir ~/Documents/dhda_jrnl/screenshots/

routine () {

   scrot ~/"Documents/dhda_jrnl/screenshots/%Y-%m-%d %H:%M:%S.png"
   mpv ~/.local/share/sounds/water.mp3 &> /dev/null &
   python - << EOF

import wx
import os
import datetime
from pathlib import Path
home = Path.home()

dirname=f"{home}/Documents/dhda_jrnl"
print(dirname)
if (not os.path.exists(dirname)):
    os.mkdir(dirname)

datetime_frmt=datetime.datetime.now().strftime('%Y-%m-%d')
journal_txt_path=f"{dirname}/[{datetime_frmt}].txt"
print(journal_txt_path)

def onButton(event):
    print("Button pressed.")

app = wx.App()
frame = wx.Frame(None, -1, 'win.py')
frame.SetDimensions(0,0,200,50)
# Create text input
dlg = wx.TextEntryDialog(frame, 'Wellness check.\nHow are you feeling?','Text Entry')
dlg.SetValue("")
time=datetime.datetime.now().strftime('%H:%M:%S')
if dlg.ShowModal() == wx.ID_OK:
    text_to_append=dlg.GetValue()
    with open(journal_txt_path, "a") as file1:
        file1.write("------\n"+time+"\n------\n"+text_to_append + "\n\n")
else:
    text_to_append="** User has decided not to write anything... **"
    with open(journal_txt_path, "a") as file1:
        file1.write("------\n"+time+"\n------\n"+text_to_append + "\n\n")

dlg.Destroy()

EOF
}

routine
while
do
   sleep $my_interval &&
   routine
done &
