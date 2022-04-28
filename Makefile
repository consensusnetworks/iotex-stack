aws-configure:
	scripts/aws/aws-configure

cdk-mock:
	scripts/cdk/cdk-mock -d infrastructure/cdk

cdk-deploy:
	scripts/cdk/cdk-deploy -d infrastructure/cdk

cdk-destroy:
	scripts/cdk/cdk-destroy -d infrastructure/cdk

pinpoint-deploy:
	scripts/pinpoint/pinpoint-template -d scripts/pinpoint/templates

actions-push:
	scripts/actions/actions-test -w push

actions-release:
	scripts/actions/actions-test -w release

actions-delete:
	scripts/actions/actions-test -w delete