import ndjson
import boto3

local_data_path = input("Input ndjson data path (relative to this script): ") # mock/mock-stake-events.json
bucket = input("Output bucket name: ") # iotexetlstackdev-iotexetleventbucketdev6a19f893-1q8n3qzmuf7ja
s3_path = input("Output s3 path: ") # test

local_data_file = open(local_data_path, "r")
local_data = ndjson.load(local_data_file)

session = boto3.Session(profile_name='consensus-networks-dev')
s3 = session.client('s3')

s3.put_object(Bucket=bucket, Key=s3_path, Body=ndjson.dumps(local_data))