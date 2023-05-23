for Database:
```bash
docker pull postgres
```

```bash
docker run --name some-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```

for ngrok:
```bash
ngrok http 8080
```

for webhook:
```bash
# POST REQUEST in POSTMAN on:
https://api.telegram.org/botTOKEN/setWebhook?
# with param: url NGROK_URL/update
```


