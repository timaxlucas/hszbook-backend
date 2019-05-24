# 📜 hszbook-backend

Light API to schedule course registrations for RWTH sports. Including user/role system for [hszbook-frontend](https://github.com/timaxlucas/hszbook-frontend).

## Quickstart

    npm install && npm start
    
## Requirements

 - Postgres DB (see [this](pg-setup.sql) for schema setup)
    
## Docker
Building the image

    docker build . --tag hszbook-backend 
    
Creating and running container

    docker run -p 4000:4000 --rm --name hszbook-backend hszbook-backend
