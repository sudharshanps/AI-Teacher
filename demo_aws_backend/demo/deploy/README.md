# Deploying this backend to an AWS EC2 instance

This backend now has 3 pieces of "premium" AWS integration built in:

- `POST /api/s3/upload`, `GET /api/s3/list`, `GET /api/s3/download/{key}`, `DELETE /api/s3/{key}` — S3 file storage
- `POST /api/items`, `GET /api/items`, `GET /api/items/{id}`, `DELETE /api/items/{id}` — DynamoDB CRUD
- `GET /health` — health check endpoint

## 1. Create the AWS resources (one-time, via the AWS Console)

1. **S3 bucket** — S3 console → Create bucket → give it a globally-unique name.
2. **DynamoDB table** — DynamoDB console → Create table:
   - Table name: `demo_items` (or your own — update `aws.dynamodb.table` in `application.properties`)
   - Partition key: `id` (String)
3. **EC2 instance** — launch an Amazon Linux 2023 instance (t3.micro is fine for a demo).
   - Attach an **IAM role** to the instance with permissions to access the bucket/table above (see policy below). This lets the app authenticate without any hardcoded keys.
   - Open port **8080** (and 22 for SSH) in the instance's security group.
4. Install Java 21 on the instance:
   ```bash
   sudo dnf install -y java-21-amazon-corretto
   ```

### Minimal IAM policy for the instance role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::YOUR_BUCKET_NAME", "arn:aws:s3:::YOUR_BUCKET_NAME/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:DeleteItem", "dynamodb:Scan"],
      "Resource": "arn:aws:dynamodb:*:*:table/demo_items"
    }
  ]
}
```

## 2. Configure your bucket/table names

Edit `src/main/resources/application.properties`:

```properties
aws.region=us-east-1
aws.s3.bucket=YOUR_BUCKET_NAME
aws.dynamodb.table=demo_items
```

## 3. Deploy

From your local machine (with the `.pem` key for the instance):

```bash
cd demo
./deploy/deploy-to-ec2.sh <ec2-public-dns-or-ip> /path/to/key.pem ec2-user
```

This will:
1. Build the jar locally with `./mvnw clean package`
2. Copy the jar to the instance
3. Install/enable a `systemd` service (`deploy/demo.service`) so the app runs in the background and restarts automatically on crash or reboot
4. Start (or restart) the service

## 4. Verify

```bash
curl http://<ec2-public-dns>:8080/health
curl http://<ec2-public-dns>:8080/api/items
```

## Manual alternative (no script)

```bash
scp -i key.pem target/demo-0.0.1-SNAPSHOT.jar ec2-user@<host>:~/app/
ssh -i key.pem ec2-user@<host>
java -jar ~/app/demo-0.0.1-SNAPSHOT.jar
```

## Security note

`SecurityConfig.java` currently leaves `/api/**` open with no authentication so the
demo works immediately. Before exposing this to the public internet, add real
authentication (JWT/OAuth2/API key) and restrict write endpoints (`POST`/`DELETE`).
