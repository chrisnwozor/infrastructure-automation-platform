#!/bin/bash
set -euo pipefail

exec > >(tee /var/log/bootstrap.log) 2>&1

echo "Starting server bootstrap..."

apt-get update
apt-get upgrade -y

apt-get install -y \
  ca-certificates \
  curl \
  git \
  nginx \
  openssl

# Install Docker
install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo ${VERSION_CODENAME}) stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update

apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

systemctl enable --now docker
usermod -aG docker ubuntu

# Clone application
APP_DIR="/opt/infrastructure-automation-platform"

rm -rf "$APP_DIR"

git clone \
  https://github.com/chrisnwozor/infrastructure-automation-platform.git \
  "$APP_DIR"

cd "$APP_DIR/backend"

# Generate deployment secrets
POSTGRES_PASSWORD="$(openssl rand -hex 24)"
JWT_SECRET="$(openssl rand -hex 32)"

cat > .env <<EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=infrastructure_platform
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/infrastructure_platform
JWT_SECRET=${JWT_SECRET}
EOF

chmod 600 .env

# Build and start API and PostgreSQL
docker compose up -d --build

# Configure Nginx
cat > /etc/nginx/sites-available/infrastructure-api <<'EOF'
server {
    listen 80;
    listen [::]:80;

    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

ln -sf \
  /etc/nginx/sites-available/infrastructure-api \
  /etc/nginx/sites-enabled/infrastructure-api

rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable --now nginx
systemctl restart nginx

echo "Waiting for API..."

for attempt in {1..30}; do
  if curl --fail --silent \
    http://127.0.0.1:3000/api/v1/health > /dev/null; then
    echo "API health check passed."
    echo "Application deployment completed."
    exit 0
  fi

  echo "Waiting for API: attempt ${attempt}/30"
  sleep 10
done

echo "API failed to become healthy."
docker compose ps
docker compose logs --tail=100
exit 1