# REQUIRES FFMPEG
bitrateset="128k"
for i in *.flac
do
  ffmpeg -i "$i" -b:a ${bitrateset} "${i%*.flac}.mp3"
done

for i in *.m4a
do
  ffmpeg -i "$i" -b:a ${bitrateset} "${i%*.m4a}.mp3"
done

for i in *.opus
do
  ffmpeg -i "$i" -b:a ${bitrateset} "${i%*.opus}.mp3"
done
