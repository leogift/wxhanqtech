@echo off
echo ******** Auto Git ********

D:
cd D:\Wechat_JAVA
git add -A

echo Push to master
git commit -m "auto git"
echo JD s1900182514275457
echo Input user and password
git push -v --progress origin master:master
echo HQ Server
echo Input user and password
git push -v --progress develop master:master
pause
