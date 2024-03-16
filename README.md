git clone後、以下の手順をするとdockerで環境構築を行えます。

1.docker-compose.ymlがあるディレクトリに移動し、次のコマンドを実行

docker-compose build

2.build後、frontendディレクトリに移動し下記コマンドを実行

docker run --rm -v ${PWD}:/app -w /app node:18-alpine yarn install

3.frontend内にnode_modulesが生成されたことを確認したらdocker-compose.ymlがあるディレクトリに移動し次のコマンドを実行

docker-compose build --no-cache

4.最後に下記コマンドを実行するとdockerが立ち上がり開発が行えるようになります。

docker-compose up
