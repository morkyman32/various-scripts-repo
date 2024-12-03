#!/bin/zsh

pomodoro_time=25 # minutes
break_time=5 # minutes

ding_cmd="espeak 'ding. time for a break'"
ding_brk_cmd="espeak 'break is over'"

while true
do
  sleep $((${pomodoro_time}*60)) && sh -c "${ding_cmd}"
  sleep $((${break_time}*60)) && sh -c "${ding_brk_cmd}"
done
