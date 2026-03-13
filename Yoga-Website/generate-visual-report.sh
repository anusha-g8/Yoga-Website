#!/bin/bash

# 1. Run the data collection script and save to file
echo "Collecting real-time data from AWS CloudWatch..."
bash generate-monitoring-report.sh > monitoring-data.txt

# 2. Extract values for the chart
# We extract Request Counts for Prod and Staging
PROD_REQ=$(grep "Total Requests:" monitoring-data.txt | head -n 1 | awk '{print $3}' | tr -d '\r')
STAGE_REQ=$(grep "Total Requests:" monitoring-data.txt | tail -n 1 | awk '{print $3}' | tr -d '\r')

# Default to 0 if empty or "None"
if [[ "$PROD_REQ" == "None" ]] || [[ -z "$PROD_REQ" ]]; then PROD_REQ=0; fi
if [[ "$STAGE_REQ" == "None" ]] || [[ -z "$STAGE_REQ" ]]; then STAGE_REQ=0; fi

echo "Data Extracted -> Production: $PROD_REQ, Staging: $STAGE_REQ"

# 3. Check if Python and Matplotlib are available
if ! python3 -c "import matplotlib" &> /dev/null; then
    echo "⚠️ Python3 or Matplotlib not found. Please install them to see the chart."
    echo "Example: pip install matplotlib"
    exit 1
fi

# 4. Generate the Pie Chart using Python
python3 <<EOF
import matplotlib.pyplot as plt

# Data
labels = ['Production Traffic', 'Staging Traffic']
sizes = [$PROD_REQ, $STAGE_REQ]
colors = ['#4CAF50', '#FF9800']
explode = (0.1, 0)  # explode Production slice

# Handle case where both are 0
if sum(sizes) == 0:
    sizes = [1, 1]
    labels = ['No Data (Prod)', 'No Data (Staging)']
    colors = ['#DDDDDD', '#EEEEEE']

plt.figure(figsize=(10, 7))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=140)

plt.axis('equal')
plt.title('Yoga Website Traffic Distribution (Last 24h)')
plt.savefig('traffic-distribution.png')
print("✅ Pie chart generated: traffic-distribution.png")
EOF

echo "----------------------------------------------------"
echo "Report Summary saved to: monitoring-data.txt"
echo "Visual Chart saved to:   traffic-distribution.png"
echo "----------------------------------------------------"
