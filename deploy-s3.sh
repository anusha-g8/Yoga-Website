#!/bin/bash

# Configuration - CHANGE THESE
BUCKET_NAME="yoga-website-frontend-$(date +%s)" # Generates a unique name
REGION="eu-central-1"

echo "Using bucket: $BUCKET_NAME in region: $REGION"

# 1. Create the S3 bucket
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

# 2. Disable "Block all public access" (Required for static hosting)
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcl=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 3. Enable static website hosting
aws s3api put-bucket-website \
    --bucket $BUCKET_NAME \
    --website-configuration '{"IndexDocument": {"Suffix": "index.html"}, "ErrorDocument": {"Key": "index.html"}}'

# 4. Add Bucket Policy for public read access
POLICY='{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
        }
    ]
}'
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "$POLICY"

# 5. Build the frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# 6. Upload files to S3
echo "Uploading files to S3..."
aws s3 sync frontend/dist/ s3://$BUCKET_NAME/ --delete

echo "---------------------------------------------------"
echo "Deployment Complete!"
echo "Your website is live at: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
echo "---------------------------------------------------"
