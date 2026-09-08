#!/usr/bin/env bash
set -euo pipefail

ACCOUNT_ID="${1:?AWS account ID required}"
REGION="${2:-us-east-1}"
REPOSITORY="${3:-shopcloud-backend}"

REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

aws ecr describe-repositories --repository-names "$REPOSITORY" --region "$REGION" >/dev/null 2>&1 || \
aws ecr create-repository --repository-name "$REPOSITORY" --region "$REGION"

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"

docker build -t "$REPOSITORY:latest" ./backend
docker tag "$REPOSITORY:latest" "$REGISTRY/$REPOSITORY:latest"
docker push "$REGISTRY/$REPOSITORY:latest"

echo "ECR image: $REGISTRY/$REPOSITORY:latest"
