# Udagram Image Filtering Application

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into two parts:
1. Frontend - Angular web application built with Ionic Framework
2. Backend RESTful API - Node-Express application

## Getting Started
> _tip_: it's recommended that you start with getting the backend API running since the frontend web application depends on the API.

### Prerequisite
1. The depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.
2. Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code.
#### Environment Script
A file named `set_env.sh` has been prepared as an optional tool to help you configure these variables on your local development environment.

We do _not_ want your credentials to be stored in git. After pulling this `starter` project, run the following command to tell git to stop tracking the script in git but keep it stored locally. This way, you can use the script for your convenience and reduce risk of exposing your credentials.
`git rm --cached set_env.sh`

Afterwards, we can prevent the file from being included in your solution by adding the file to our `.gitignore` file.

### Database
Create a PostgreSQL database either locally or on AWS RDS. Set the config values for environment variables prefixed with `POSTGRES_` in `set_env.sh`.

### S3
Create an AWS S3 bucket. Set the config values for environment variables prefixed with `AWS_` in `set_env.sh`.

### Backend API
* To download all the package dependencies, run the command from the directory `udagram-api/`:
    ```bash
    npm install .
    ```
* To run the application locally, run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:8080/api/v0/feed` in your web browser to verify that the application is running. You should see a JSON payload. Feel free to play around with Postman to test the API's.

### Frontend App
* To download all the package dependencies, run the command from the directory `udagram-frontend/`:
    ```bash
    npm install .
    ```
* Install Ionic Framework's Command Line tools for us to build and run the application:
    ```bash
    npm install -g ionic
    ```
* Prepare your application by compiling them into static files.
    ```bash
    ionic build
    ```
* Run the application locally using files created from the `ionic build` command.
    ```bash
    ionic serve
    ```
* You can visit `http://localhost:8100` in your web browser to verify that the application is running. You should see a web interface.

## Tips
1. Take a look at `udagram-api` -- does it look like we can divide it into two modules to be deployed as separate microservices?
2. The `.dockerignore` file is included for your convenience to not copy `node_modules`. Copying this over into a Docker container might cause issues if your local environment is a different operating system than the Docker image (ex. Windows or MacOS vs. Linux).
3. It's useful to "lint" your code so that changes in the codebase adhere to a coding standard. This helps alleviate issues when developers use different styles of coding. `eslint` has been set up for TypeScript in the codebase for you. To lint your code, run the following:
    ```bash
    npx eslint --ext .js,.ts src/
    ```
    To have your code fixed automatically, run
    ```bash
    npx eslint --ext .js,.ts src/ --fix
    ```
4. Over time, our code will become outdated and inevitably run into security vulnerabilities. To address them, you can run:
    ```bash
    npm audit fix
    ```
5. In `set_env.sh`, environment variables are set with `export $VAR=value`. Setting it this way is not permanent; every time you open a new terminal, you will have to run `set_env.sh` to reconfigure your environment variables. To verify if your environment variable is set, you can check the variable with a command like `echo $POSTGRES_USERNAME`.

### AWS Configuration Steps

1. Create Users and Roles
    1. Create IAM User with Admin Permissions
        - tell AWS CLI to use this user
    2. Create Role for EKS cluster management "eksClusterRole"
        - Policy: AmazonEKSClusterPolicy: Was recommended in AWS docs for this role
    3. Create Role for EKS cluster node group creation "eksNodeRole"
        - AmazonEKSWorkerNodePolicy: Was recommended in AWS docs for this role
        - AmazonEC2ContainerRegistryReadOnly: Was recommended in AWS docs for this role
        - AmazonEKS_CNI_Policy: This policy was not recommended in the AWS docs of how to create the node group role, but without it, the node group creation failed. In  "kubectl cluster-info dump" there was an error hint saying "NetworkPluginNotReady". This permission fixed the error and creation of a new node group was sucessful.
2. Create S3 Bucket
    - block all public access
    - define CORS policy
3. Create RDS PostgresSQL database
4. Create EKS Cluster
5. Use AWS CLI to bind kubectl to newly created cluster:
    ´´´´bash
    # first check if AWS CLI the right user (if not, you need to change the profile):
    $ aws iam list-users
    $ aws eks --region eu-central-1 update-kubeconfig --name udacity-microservices
    $ kubectl cluster-info
    # if creation of node group in the next step fails, this command can be used to find an error message, when AWS web UI only displays, that node group wasn't created
    $ kubectl cluster-info dump
    ´´´´
5. Create Node Group for Cluster
    - type: t3.micro
    - provide ssh key, this can't be updated later and node group creation takes about 30 minutes...
    - Number of Nodes: t3.micro has maximum number of 4 pods per nodes. Number of nodes in node group should be be enough to handle the pods for the deployments. And kubernetes is also running some pods on the nodes. When pods don't start and message "too many pods" is visible, the node group has to few pods available.
        ´´´´bash
        # see all pods
        $ kubectl get po -A
        ´´´´
6. Create Cluster Secrets
    ````bash
    $ kubectl create secret generic postgres \
  --from-literal=username=postgres \
  --from-literal=password='my-password'
    $ kubectl get secrets
    $ kubectl get secret postgres ss -o jsonpath='{.data}'
    ````
7. Create Cluster env variable config map
7. Create Cluster configuration files and apply them with kubectl
8. Put frontend behind nginx reverse proxy, to be able address the API gateway
   service via static domain which is only exposed within cluster and not
   accessable from browser



