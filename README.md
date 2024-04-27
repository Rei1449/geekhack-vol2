git clone後、以下の手順をするとdockerで環境構築を行えます。

1.docker-compose.ymlがあるディレクトリに移動し、次のコマンドを実行

docker-compose build

2.build後、frontendディレクトリに移動し下記コマンドを実行

docker run --rm -v ${PWD}:/app -w /app node:18-alpine yarn install

3.frontend内にnode_modulesが生成されたことを確認したらdocker-compose.ymlがあるディレクトリに移動し次のコマンドを実行

docker-compose build --no-cache

4.最後に下記コマンドを実行するとdockerが立ち上がり開発が行えるようになります。

docker-compose up


--------
<h2>オンライン対戦機能に関わるReactコンポーネントアーキテクト</h2>
例)
<pre>
src
├── Parts
    ├── PrimaryButton.tsx
    ├── PrimaryTitle.tsx
├── Modules
    ├──　　GameFiled.tsx
    ├── GameResult.tsx
├── OnlineGame
    ├──　　Functions
        ├── Submit.ts
    └── OnLineGame.tsx
</pre>

<h3>基本的な役割</h3>
・Parts　　:ボタンやタイトルなどの最小単位のUIを担うファイル格納する  
・Modules :ゲーム中、待機中、結果発表などの固有のコンポーネントを持ち、かつPartsを利用するUIファイルを格納する  
・Functions :共通化できる処理系を持つファイルを格納する  
・OnLineGame.tsx　:ルーターで呼び出す親ファイル。Functionsを利用し、Modulesを返すファイル  
