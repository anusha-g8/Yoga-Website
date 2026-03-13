#!/bin/bash

ROLE_NAME="CloudWatchAgentServerRole"
PROFILE_NAME="CloudWatchAgentInstanceProfile"

echo "Creating trust policy..."
cat <<EOF > trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

echo "Creating IAM Role: $ROLE_NAME..."
aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy.json

echo "Attaching CloudWatchAgentServerPolicy..."
aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy

echo "Creating Instance Profile: $PROFILE_NAME..."
aws iam create-instance-profile --instance-profile-name $PROFILE_NAME

echo "Adding Role to Instance Profile..."
aws iam add-role-to-instance-profile --instance-profile-name $PROFILE_NAME --role-name $ROLE_NAME

echo "Cleaning up..."
rm trust-policy.json

echo "IAM Setup Complete!"
