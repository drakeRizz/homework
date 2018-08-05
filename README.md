# Basic image resizer API

This is a Node.js REST API that can be used to **retrieve & resize** images from the disk. In order to resize the images, i use *Sharp* (https://github.com/lovell/sharp), a high performance image processing library.
The folder containing the images that will be served is by default "/images", but can be changed by setting the environment variable *IMAGES_PATH*. 

## Usage

### '/' route

The index route provides statistics about the service. There are a few informations like cache hits/misses, process info, disk info, and the number of original files/resized files. If running locally, just access http://localhost:3000/ to get an overview.

### '/image' route
Access the '/image' route followed by the name of an image in order to retrieve it from disk. If the 'size' query parameter is set, the image will also be resized to the desired size.

## Installing the service
Clone this repository using *git* in a destination path :

> git clone https://github.com/drakeRizz/homework.git 'destination_path'

### Run locally
After cloning the repository in the desired path, run the following command to install all the dependencies

>npm i

After all the dependecies were succesfully installed , just run

>npm start

And the app will be up and running on port 3000. You can set the environment variable PORT to a different port anytime.

### Run with Docker
The project comes with a *Dockerfile*, so you can build a docker image and spin up a container with the project
Navigate to the root directory of the project, and run

> docker build -t your-username/resizer .

In order to run the newly created image, use

> docker run -p PORT:3000 -d your-username/resizer

Your app will run on port "PORT" which will be mapped to the internal 3000 which is exposed by the docker file.


## Running tests
Unit tests can be ran using mocha
Just execute the command

> npm test

Mocha will start executing the unit tests and provide the results at the end.

## Load testing
If you want to test the service in high load conditions, i suggest using https://artillery.io/ , an easy-to-use load testing toolkit. Install it globally using npm :
>npm i -g artillery

Then we can do a quick test for our two API routes using the following commands :

>artillery quick --count 1000 -n 10 http://localhost/
>artillery quick --count 1000 -n 10 http://localhost/image/doge.jpg # to retrieve an image

**count** represents the number of virtual users that we want to simulate
**n** represents the concurrency factor. How many concurent connections do we want to have from the entire 'count'.

Testing the image route with 1000 connections and 10 concurent results :

![Artillery result](https://imgur.com/download/LcWnwfv)
Due to the fact that the development PC doesn't have powerful CPU, the results may be slightly worse than on a PC with a powerful CPU. Eventhough, all status codes were 200 (OK) for 1000 requests with concurrency 10. The minimum latency was 3.0 ms and the maximum was half a second ( when CPU approached 100%). 145 requests per second were sent.