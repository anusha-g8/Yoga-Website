#!/bin/bash

REGION="eu-central-1"
LOG_GROUP_STAGING="yoga-backend-logs-staging"
LOG_GROUP_PROD="yoga-backend-logs-prod"

echo "Creating Log Groups..."
aws logs create-log-group --log-group-name $LOG_GROUP_STAGING --region $REGION 2>/dev/null
aws logs create-log-group --log-group-name $LOG_GROUP_PROD --region $REGION 2>/dev/null

create_filters() {
  local group=$1
  local env=$2
  
  echo "Creating Metric Filters for $group..."
  
  # 1. Average Response Time
  # Format: [2026-03-13T06:00:00.000Z] GET /api/health 200 150 - 15.5 ms
  aws logs put-metric-filter \
    --log-group-name $group \
    --filter-name "AverageResponseTime" \
    --filter-pattern "[date, method, url, status, size, dash, response_time, unit=\"ms\"]" \
    --metric-transformations \
      metricName="ResponseTime",metricNamespace="YogaWebsite/$env",metricValue="\$response_time" \
    --region $REGION

  # 2. 5xx Error Count
  aws logs put-metric-filter \
    --log-group-name $group \
    --filter-name "5xxErrors" \
    --filter-pattern "[date, method, url, status=5*, size, dash, response_time, unit=\"ms\"]" \
    --metric-transformations \
      metricName="5xxErrorCount",metricNamespace="YogaWebsite/$env",metricValue="1" \
    --region $REGION

  # 3. Request Count
  aws logs put-metric-filter \
    --log-group-name $group \
    --filter-name "RequestCount" \
    --filter-pattern "[date, method, url, status, size, dash, response_time, unit=\"ms\"]" \
    --metric-transformations \
      metricName="RequestCount",metricNamespace="YogaWebsite/$env",metricValue="1" \
    --region $REGION
}

create_filters $LOG_GROUP_STAGING "Staging"
create_filters $LOG_GROUP_PROD "Production"

echo "CloudWatch Monitoring Setup Complete!"
