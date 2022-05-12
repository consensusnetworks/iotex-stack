aws-configure:
	scripts/aws/configure

cdk-mock:
	scripts/cdk/mock -d infrastructure/cdk

cdk-deploy:
	scripts/cdk/deploy -d infrastructure/cdk

cdk-destroy:
	scripts/cdk/destroy -d infrastructure/cdk

actions-push:
	scripts/actions/test -w push

actions-release:
	scripts/actions/test -w release

actions-delete:
	scripts/actions/test -w delete