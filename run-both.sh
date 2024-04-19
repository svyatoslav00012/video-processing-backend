#install bun
#curl -fsSL https://bun.sh/install | bash # windows: powershell -c "irm bun.sh/install.ps1 | iex"
#run server
bash run-dev.sh &
cd ../video-preprocessing-web-ui
bash run-dev.sh &
cd ../video-processing-backend
