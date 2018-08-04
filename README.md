# Basic image resizer API

This is a Node.js REST API that can be used to **retrieve & resize** images from the disk. In order to resize the images, i use *Sharp* (https://github.com/lovell/sharp), a high performance image processing library.

## /image route
Access the '/image' route followed by the name of an image in order to retrieve it from disk. If the 'size' query parameter is set, the image will also be resized to the desired size.


## / route

The index route provides statistics about the service. There are a few informations like cache hits/misses, process info, disk info, and the number of original files/resized files.

