# ================================
# Local CI/CD Script for Windows
# Node.js + Minikube + PowerShell
# ================================

$ErrorActionPreference = "Stop"

Write-Host "Switching Docker to Minikube environment..."
minikube docker-env | Invoke-Expression

# 1. Build Docker image
$IMAGE_NAME = "btech:dev"
Write-Host "Building Docker image $IMAGE_NAME ..."
docker build -t $IMAGE_NAME .

# 2. Update deployment.yaml image
Write-Host "Updating deployment.yaml with image $IMAGE_NAME ..."
(Get-Content deployment.yaml) `
    -replace "image: .*", "image: $IMAGE_NAME" |
    Set-Content deployment.yaml

# 3. Apply deployment and service
Write-Host "Applying Kubernetes deployment and service..."
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

# 4. Rollout restart
Write-Host "Restarting deployment..."
kubectl rollout restart deployment/node-deployment

# 5. Show pod status
Write-Host "Deployment status:"
kubectl get pods -o wide

# 6. Show service info
Write-Host "Service info:"
kubectl get svc

# (Optional) Delete service if needed
# Write-Host "Restarting service..."
# kubectl delete svc node-

Write-Host "CI/CD process completed successfully."
