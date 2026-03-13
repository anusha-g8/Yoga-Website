#!/bin/bash

# Configuration
REGION="eu-central-1"
NAMESPACE_PROD="YogaWebsite/Production"
NAMESPACE_STAGING="YogaWebsite/Staging"
DURATION_HOURS=24
START_TIME=$(date -u -v-${DURATION_HOURS}H +%Y-%m-%dT%H:%M:%SZ)
END_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "===================================================="
echo "📊 YOGA WEBSITE MONITORING REPORT (Last $DURATION_HOURS Hours)"
echo "Generated on: $(date)"
echo "Region: $REGION"
echo "===================================================="

get_metric_avg() {
  local namespace=$1
  local name=$2
  aws cloudwatch get-metric-statistics \
    --namespace "$namespace" \
    --metric-name "$name" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 3600 \
    --statistics Average \
    --region "$REGION" \
    --query 'Datapoints[0].Average' --output text 2>/dev/null
}

get_metric_sum() {
  local namespace=$1
  local name=$2
  aws cloudwatch get-metric-statistics \
    --namespace "$namespace" \
    --metric-name "$name" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --period 86400 \
    --statistics Sum \
    --region "$REGION" \
    --query 'Datapoints[0].Sum' --output text 2>/dev/null
}

echo ""
echo "🚀 PRODUCTION API PERFORMANCE"
echo "----------------------------------------------------"
AVG_RT_PROD=$(get_metric_avg "$NAMESPACE_PROD" "ResponseTime")
REQ_COUNT_PROD=$(get_metric_sum "$NAMESPACE_PROD" "RequestCount")
ERR_COUNT_PROD=$(get_metric_sum "$NAMESPACE_PROD" "5xxErrorCount")

echo "Average Response Time: ${AVG_RT_PROD:-N/A} ms"
echo "Total Requests:        ${REQ_COUNT_PROD:-0}"
echo "Total 5xx Errors:      ${ERR_COUNT_PROD:-0}"

echo ""
echo "🛠 STAGING API PERFORMANCE"
echo "----------------------------------------------------"
AVG_RT_STAGE=$(get_metric_avg "$NAMESPACE_STAGING" "ResponseTime")
REQ_COUNT_STAGE=$(get_metric_sum "$NAMESPACE_STAGING" "RequestCount")
ERR_COUNT_STAGE=$(get_metric_sum "$NAMESPACE_STAGING" "5xxErrorCount")

echo "Average Response Time: ${AVG_RT_STAGE:-N/A} ms"
echo "Total Requests:        ${REQ_COUNT_STAGE:-0}"
echo "Total 5xx Errors:      ${ERR_COUNT_STAGE:-0}"

echo ""
echo "🖥 INFRASTRUCTURE (EC2)"
echo "----------------------------------------------------"
# Get instance IDs
INSTANCES=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=yoga-prod-server,yoga-staging-server" \
  --query 'Reservations[*].Instances[*].{Id:InstanceId,Name:Tags[?Key==`Name`].Value|[0]}' \
  --output text --region "$REGION")

while read -r line; do
  ID=$(echo $line | awk '{print $1}')
  NAME=$(echo $line | awk '{print $2}')
  
  if [ -n "$ID" ]; then
    CPU=$(aws cloudwatch get-metric-statistics \
      --namespace "AWS/EC2" \
      --metric-name "CPUUtilization" \
      --dimensions Name=InstanceId,Value=$ID \
      --start-time "$START_TIME" \
      --end-time "$END_TIME" \
      --period 3600 \
      --statistics Average \
      --region "$REGION" \
      --query 'Datapoints[0].Average' --output text 2>/dev/null)
    
    echo "Server: $NAME ($ID)"
    echo "Avg CPU Usage: ${CPU:-N/A} %"
    echo "----------------------------------------------------"
  fi
done <<< "$INSTANCES"

echo ""
echo "✅ End of Report"
echo "===================================================="
