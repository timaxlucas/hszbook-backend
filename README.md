# 📜 hszbook-backend

## Quickstart

    npm install && npm start
    
## Requirements

 - [hszbook](https://github.com/timaxlucas/hszbook)
 - Postgres DB (see [this](pg-setup.sql) for schema setup)
    
## Docker
Building the image

    docker build . --tag hszbook-backend 
    
Creating and running container

    docker run -p 4000:4000 --rm --name hszbook-backend hszbook-backend
