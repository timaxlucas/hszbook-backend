# 📜 hszbook-backend

[![Build Status](https://travis-ci.com/timaxlucas/hszbook-backend.svg?token=1w81GuSsC3hkfgp1JvDQ&branch=master)](https://travis-ci.com/timaxlucas/hszbook-backend)

> DISCLAIMER: To run hszbook-backend you need dependency hszbook, which is currently not publicly available

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
