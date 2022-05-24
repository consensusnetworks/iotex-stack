#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { EtlStack } from '../lib/etl/etl-stack'

const project = process.env.PROJECT?.replace(/\b\w/g, c => c.toUpperCase())
const stage = process.env.STAGE?.replace(/\b\w/g, c => c.toUpperCase())

const app = new cdk.App()
new EtlStack(app, `${project}EtlStack${stage}`, {
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})