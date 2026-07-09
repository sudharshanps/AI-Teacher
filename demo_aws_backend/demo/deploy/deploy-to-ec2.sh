#!/usr/bin/env bash
# Builds the jar locally and deploys it to an EC2 instance over SSH.
#
# Usage:
#   ./deploy-to-ec2.sh <ec2-public-ip-or-dns> <path-to-pem-key> [ssh-user]
#
# Example:
#   ./deploy-to-ec2.sh ec2-1-2-3-4.compute-1.amazonaws.com ~/keys/my-key.pem ec2-user

set -euo pipefail

HOST="${1:?Usage: $0 <ec2-host> <pem-key-path> [ssh-user]}"
KEY="${2:?Usage: $0 <ec2-host> <pem-key-path> [ssh-user]}"
USER="${3:-ec2-user}"

JAR_NAME="demo-0.0.1-SNAPSHOT.jar"
REMOTE_DIR="/home/${USER}/app"

echo "==> Building jar with Maven..."
cd "$(dirname "$0")/.."
./mvnw -q clean package -DskipTests

echo "==> Ensuring remote directory exists..."
ssh -i "$KEY" "${USER}@${HOST}" "mkdir -p ${REMOTE_DIR}"

echo "==> Copying jar to EC2..."
scp -i "$KEY" "target/${JAR_NAME}" "${USER}@${HOST}:${REMOTE_DIR}/${JAR_NAME}"

echo "==> Copying systemd service file..."
scp -i "$KEY" "deploy/demo.service" "${USER}@${HOST}:/tmp/demo.service"

echo "==> Installing service and (re)starting it..."
ssh -i "$KEY" "${USER}@${HOST}" bash -s <<'EOF'
  set -e
  sudo mv /tmp/demo.service /etc/systemd/system/demo.service
  sudo systemctl daemon-reload
  sudo systemctl enable demo
  sudo systemctl restart demo
  sleep 2
  sudo systemctl status demo --no-pager || true
EOF

echo "==> Done. Check http://${HOST}:8080/health"
