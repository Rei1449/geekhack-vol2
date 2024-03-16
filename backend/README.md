docker-composeで環境作成後、postgresqlでマイグレーションを実行するやり方

1.docker-compose.ymlがあるディレクトリに移動し、次のコマンドを実行

docker-compose exec backend sh

2.下記コマンドでsrcディレクトリに移動

cd src

3.下記コマンドを実行し、backend内のsrc.migration.versions内にあるマイグレーションファイルを実行

alembic upgrade head

4.postgresql内に入り、テーブルが作成されているかの確認をする(下記コマンドで確認できる)

docker-compose exec db psql -U postgres
\d
