#!/bin/bash

INSTANCE_NAME=${INSTANCE_NAME:-example-ec2}

echo $INSTANCE_NAME

instanceId=$(aws ec2 describe-instances --query "Reservations[*].Instances[*].InstanceId" --filters "Name=tag:Name,Values=['${INSTANCE_NAME}']" --output text)
status=$(aws ec2 describe-instances --instance-ids=${instanceId} --query 'Reservations[0].Instances[0].State.Name' --output text)
sessions=$(aws ssm describe-sessions --state Active --filters key=Target,value=${instanceId})

echo "Instance status...${status}"

if [ $status != 'running' ]; then
	exit 0
fi

echo $sessions | jq
len=$(echo $sessions | jq '.Sessions | length')

if [ $len -gt 0 ]; then
   exit 0
fi

echo "Stop instance....${instanceId}"

aws ec2 stop-instances --instance-ids $instanceId
aws ec2 wait instance-stopped --instance-ids $instanceId


status=$(aws ec2 describe-instances --instance-ids=${instanceId} --query 'Reservations[0].Instances[0].State.Name' --output text)
echo $status
