# Google Cloud Platform

## From zero

First thing's first, you need a google account, then you can follow 
[these steps](https://cloud.google.com/functions/docs/quickstart) 
to create a project, enable billing and the APIs.

## Workstation

Install `gcloud` using 
[these instructions](https://cloud.google.com/sdk/docs/quickstart-macos).

I suggest you create a specific configuration for this project : 

```
gcloud config configurations create yes-please
gcloud config set --configuration yes-please core/account <your google account>
gcloud config set --configuration yes-please core/project yes-please
```

Use [autoenv](https://github.com/kennethreitz/autoenv) or 
[direnv](https://direnv.net/) to switch configuration within this project, 
and have a `.env` file at the root of your project, like so : 

```
CLOUDSDK_ACTIVE_CONFIG_NAME=yes-please
CLOUDSDK_PYTHON=/usr/local/bin/python2
```

Update gcloud to use beta features : 

```
gcloud components update &&
gcloud components install beta
```
