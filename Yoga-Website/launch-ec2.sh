#!/bin/bash

# Configuration
INSTANCE_NAME="yoga-prod-server"
REGION="eu-central-1"
KEY_NAME="yoga-key"
AMI_ID="ami-0cf4768e2f1e520c5" # Verified Amazon Linux 2023 in eu-central-1
INSTANCE_TYPE="t3.micro"

echo "Checking for existing Security Group..."
SG_ID=$(aws ec2 describe-security-groups \
    --group-names yoga-backend-sg \
    --region $REGION \
    --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null)

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
    echo "Creating new Security Group..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name yoga-backend-sg \
        --description "SG for Yoga Backend" \
        --region $REGION \
        --query 'GroupId' --output text)
    
    echo "Authorizing SG ingress rules..."
    aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $REGION
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
                 dnf install -y docker docker-compose-plugin
                 systemctl start docker
                 systemctl enable docker
                 usermod -aG docker ec2-user" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
    --query 'Instances[0].InstanceId' --output text \
    --region $REGION)

if [ -n "$INSTANCE_ID" ]; then
    echo "Instance Successfully Launched: $INSTANCE_ID"
    echo "Wait 2 minutes for initialization..."
    sleep 60 # Increased wait time
    PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region $REGION)
    echo "---------------------------------------------------"
    echo "EC2 Backend Server is Ready!"
    echo "Public IP: $PUBLIC_IP"
    echo "SSH Command: ssh -i Yoga-Website/yoga-key.pem ec2-user@$PUBLIC_IP"
    echo "---------------------------------------------------"
else
    echo "Failed to launch instance."
fi
