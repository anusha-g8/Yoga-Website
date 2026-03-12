#!/bin/bash

# Configuration
INSTANCE_NAME="yoga-staging-server"
REGION="eu-central-1"
KEY_NAME="yoga-key"
AMI_ID="ami-0cf4768e2f1e520c5" # Amazon Linux 2023 in eu-central-1
INSTANCE_TYPE="t3.micro"
SG_NAME="yoga-staging-sg"

echo "Checking for existing Security Group..."
SG_ID=$(aws ec2 describe-security-groups \
    --group-names $SG_NAME \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null)

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
    echo "Creating new Security Group: $SG_NAME..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name $SG_NAME \
        --description "SG for Yoga Staging Backend" \
        --region $REGION \
        --query 'GroupId' --output text)
    
    echo "Authorizing SG ingress rules..."
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $REGION
    # Staging backend uses port 5005 according to README.md and docker-compose.yml
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 5005 --cidr 0.0.0.0/0 --region $REGION
    # Also allow 5000 just in case
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 5000 --cidr 0.0.0.0/0 --region $REGION
else
    echo "Using existing Security Group: $SG_ID"
fi

echo "Launching EC2 Instance: $INSTANCE_NAME..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SG_ID \
    --user-data "#!/bin/bash
                 dnf update -y
                 dnf install -y docker git
                 systemctl start docker
                 systemctl enable docker
                 usermod -aG docker ec2-user
                 curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
                 chmod +x /usr/local/bin/docker-compose" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query 'Instances[0].InstanceId' --output text \
    --region $REGION)

if [ -n "$INSTANCE_ID" ]; then
    echo "Instance Successfully Launched: $INSTANCE_ID"
    echo "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION
    
    PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region $REGION)
    
    echo "---------------------------------------------------"
    echo "EC2 Staging Server is Ready!"
    echo "Public IP: $PUBLIC_IP"
    echo "SSH Command: ssh -i $KEY_NAME.pem ec2-user@$PUBLIC_IP"
    echo "---------------------------------------------------"
    
    echo "Preparing to deploy staging backend..."
    # Wait for SSH to be ready
    echo "Waiting for SSH to be ready (approx 30s)..."
    sleep 30
    
    # Create app directory on the instance
    ssh -i $KEY_NAME.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP "mkdir -p ~/app"
    
    # Copy files to the instance (excluding node_modules)
    echo "Uploading code to EC2..."
    rsync -avz -e "ssh -i $KEY_NAME.pem -o StrictHostKeyChecking=no" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'frontend/node_modules' \
        --exclude 'backend/node_modules' \
        ./ ec2-user@$PUBLIC_IP:~/app/
    
    # Deploy using docker-compose
    echo "Starting services on EC2..."
    ssh -i $KEY_NAME.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP "cd ~/app && docker-compose --env-file .env.staging up -d --build" || \
    ssh -i $KEY_NAME.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP "cd ~/app && sudo docker compose --env-file .env.staging up -d --build"
    
    echo "---------------------------------------------------"
    echo "Staging Deployment Complete!"
    echo "Backend API: http://$PUBLIC_IP:5005/api/health"
    echo "---------------------------------------------------"
else
    echo "Failed to launch instance."
fi
