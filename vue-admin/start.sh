#拉取代码
git pull
#安装依赖
npm install --registry=https://registry.npm.taobao.org/ && npm run build
#删除容器
docker rm -f Vue-Admin &> /dev/null
#启动容器
docker run -d --restart=no-failure:5 \
-p 8081:80 \
-v $PWD\dist:/usr/share/nginx/html \
--name Vue-Admin nginx