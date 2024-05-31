sudo docker build -t cm-front:latest .
# sudo docker save -o cm-front.tar cm-front:latest
sudo docker rm -f cm-fornt
sudo docker image prune -f
sudo docker run -d -p 4000:3000 --name cm-fornt --restart=always cm-front:latest