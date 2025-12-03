#!/bin/bash

# === Local CI/CD Script for Node.js + Minikube ===

set -e

# 1. Use Minikube Docker daemon
echo "Switching Docker to Minikube environment..."
eval $(minikube docker-env)

# 2. Build Docker image
IMAGE_NAME=btech:dev
echo "Building Docker image $IMAGE_NAME..."
docker build -t $IMAGE_NAME .

# 3. Update deployment.yaml image (optional)
echo "Updating deployment.yaml with image $IMAGE_NAME..."
sed -i "s|image: .*|image: $IMAGE_NAME|" deployment.yaml

# 4. Apply deployment and service
echo "Applying Kubernetes deployment and service..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 5. Rollout restart to pick up new image
echo "Restarting deployment..."
kubectl rollout restart deployment node-deployment

# 6. Show pod status
echo "Deployment status:"
kubectl get pods -o wide

# 7. Show service info
echo "Service info:"
kubectl get svc
