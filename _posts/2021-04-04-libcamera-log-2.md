---
layout: post
title: Making a simple camera streamer with libcamera
date:   2021-04-04 23:40:16
description: This is a log for documenting issues/observations encountered while creating an Qt app with libcamera
---

**I am applying for GSoC again, but this time with libcamera. I will log issues I faced while compiling and running it**    

[Here's the link to the simple camera streamer app made using Qt5 and libcamera](https://github.com/VedantParanjape/libcamera-test-app). I did this for learning more about libcamera in general, and it pretty much cleared libcamera for me.

## A Gist of what I did

I used qcam as a reference. I went through it's code and figured out how exactly libcamera is interfaced with Qt Widgets to display the stream. The main driver is the QImage widget. It is repeatedly passed a buffer which holds the frames from webcam, so it updates fairly quickly (I got around 80+ fps) and appears as continuous stream of frames.

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/libcamera-2/fps-snap.png' | relative_url }}"></p>

To give a overview of how I implemented this. Initialised libcamera as usual. Create an object of the Camera Manager, then start it. Then it looks for camera's connected to the system. Get the id of the first one that is found `cm->cameras()[0]->id()` and then use this id to acquire access to the camera.

```cpp
// Start the camera manager which handles all the camera's in the syste,
libcamera::CameraManager *cm = new libcamera::CameraManager();
cm->start();

// Display all the camera's connected to the system
for (auto const &camera : cm->cameras())
{
    std::cout << "Camera ID: " << camera->id() << std::endl;
}

// Extract id of the first camera detected
std::string camera_id = cm->cameras()[0]->id();
// Get the camera object connected to the camera
camera = cm->get(camera_id);
// Acquire the camera so no other process can use it
camera->acquire();
```

After this we need to configure the camera, i.e. specify the image to be used, pixel format in which frames will be generated, etc. We assign `StreamRole::Raw` to the stream, and then also specify the pixel format which matches the one supported by `QImage` widget. After this we need to validate if the said config is correct. Once it is done, we configure the camera to run with the given config `camera->configure(config.get());`.

```cpp
// Config the camera with Raw StreamRole
std::unique_ptr<libcamera::CameraConfiguration> config = camera->generateConfiguration({libcamera::StreamRole::Raw});

// Get the StreamConfiguration Object so that we can change it's parameters
libcamera::StreamConfiguration &streamConfig = config->at(0);

// Try to set the pixel format given by libcamera to one that is compatible
// with QImage widget
std::vector<PixelFormat> formats = streamConfig.formats().pixelformats();
for (const PixelFormat &format : nativeFormats.keys())
{
    auto match = std::find_if(formats.begin(), formats.end(),
                                [&](const PixelFormat &f) {
                                    return f == format;
                                });

    if (match != formats.end())
    {
        streamConfig.pixelFormat = format;
        break;
    }
}

// Validate the current configuration is correct
config->validate();
std::cout << "Default viewfinder configuration is: " << streamConfig.toString() << std::endl;
// Set the config to the camera
camera->configure(config.get());
```

As a next step, we need to allocate buffers, then these buffers will be sent to libcamera, which will fill them with frames from camera and return it back to us to be consumed. We allocate buffers for each stream and then we need to iterate over the vector of `FrameBuffer`s and also create request to libcamera to get back filled `FrameBuffer`s. So we create request, pass `FrameBuffer` to the request and store the requests in an vector for now.

```cpp
// Allocator object which is used to allocated framebuffers for eah stream
FrameBufferAllocator *allocator = new FrameBufferAllocator(camera);
for (StreamConfiguration &cfg : *config)
{
    int ret = allocator->allocate(cfg.stream());
    if (ret < 0)
    {
        std::cerr << "Can't allocate buffers" << std::endl;
        return -ENOMEM;
    }
}

// Get the actual object which represents a stream
Stream *stream = streamConfig.stream();
// Get the framebuffers allocated for the stream
const std::vector<std::unique_ptr<FrameBuffer>> &buffers = allocator->buffers(stream);
// Create a vector for storing requests which will be queued laterop
std::vector<std::unique_ptr<Request>> requests;

// Iterate over buffers to create requests for each buffer and push the
// requests into an vector
for (const std::unique_ptr<FrameBuffer> &buffer : buffers)
{
    std::unique_ptr<Request> request = camera->createRequest();
    if (!request)
    {
        std::cerr << "Can't create request" << std::endl;
        return -ENOMEM;
    }

    int ret = request->addBuffer(stream, buffer.get());
    if (ret < 0)
    {
        std::cerr << "Can't set buffer for request"
                    << std::endl;
        return ret;
    }

    requests.push_back(std::move(request));
}
```

Now we need to some how let libcamera know what should be done once the request is complete, i.e. the `FrameBuffer` is filled up with frames from the camera device. This is done by registering a callback function with libcamera, which will be called when a request is completed. This is very crucial function as it consumes the frames. After this we finally start the camera and iterate over the vector of requests we stored earlier, and pass these requests to the camera object and then wait for it to return.

```cpp
// Register callback function for request completed signal
camera->requestCompleted.connect(requestComplete);

// Finally start the camera
camera->start();
// Iterate over the generated requests and queue them to libcamera to be fulfilled
for (std::unique_ptr<libcamera::Request> &request : requests)
{
    camera->queueRequest(request.get());
}
```

Now, a bit about Qt part. I create a QApplication object, this drives the application, also alloc a new QLabel which is used to display the QImage widget.

```cpp
// QAppplication main window object
QApplication window(argc, argv);
// alloc memory for viewfinder_label
viewfinder_label = new QLabel;
```

Next, comes the callback, it is passed a Request object, which has all the data from the camera, which is `FrameBuffer` and `Stream`. Here we extract the buffer from the `Request` object. Also read into the metadata to get some frame info to be printed for debugging. The `FrameBuffer` is a not a simple `uchar` array. It also has several other things, so we need the data in `unsigned char` array to be useful for QImage. After this we record the current CPU time, and find the time difference between previous call to this function and current call, this is used to calculate the FPS and display it. After this we load image into QImage widget and also display the FPS. Once we are done, we notify that we want to reuse the existing buffers for future requests, and then queue a new request, so that it goes on.

```cpp
// Callback function which processes the request once it has been completed by libcamera
static void requestComplete(Request *request)
{
    // Check if the request has been cancelled
    if (request->status() == Request::RequestCancelled)
    {
        return;
    }

    // Extract the buffers filled with images from Request object passed by libcamera 
    const std::map<const Stream *, FrameBuffer *> &buffers = request->buffers();

    // Iterate over the buffer pairs
    for (auto bufferPair : buffers)
    {
        // Use framebuffer which has the image data
        FrameBuffer *buffer = bufferPair.second;

        // Use the frame metadata
        const FrameMetadata &metadata = buffer->metadata();
        std::cout << " seq: " << std::setw(6) << std::setfill('0') << metadata.sequence << " bytesused: ";

        // Calculate the amount of storage used for a single frame
        unsigned int nplane = 0;
        for (const FrameMetadata::Plane &plane : metadata.planes)
        {
            std::cout << plane.bytesused;
            if (++nplane < metadata.planes.size())
                std::cout << "/";
        }
        std::cout << std::endl;

        // Find the size of buffer
        size_t size = buffer->metadata().planes[0].bytesused;
        const FrameBuffer::Plane &plane = buffer->planes().front();
        void *memory = mmap(NULL, plane.length, PROT_READ, MAP_SHARED, plane.fd.fd(), 0);

        // Load image from a raw buffer into the QImage widget
        viewfinder.loadFromData(static_cast<unsigned char *>(memory), (int)size);

        // Record the current time and find the time elapsed between two frames
        // to calculate the FPS
        clock_t current_time = std::clock();
        std::string fps_string = "FPS: " + std::to_string(CLOCKS_PER_SEC / (float)(current_time - prev_time));
        prev_time = current_time;

        // Display the FPS
        QPainter fps_label(&viewfinder);
        fps_label.setPen(QPen(Qt::black));
        fps_label.setFont(QFont("Times", 18, QFont::Bold));
        fps_label.drawText(viewfinder.rect(), Qt::AlignBottom | Qt::AlignLeft, QString::fromStdString(fps_string));

        // Set the label and show it
        viewfinder_label->setPixmap(QPixmap::fromImage(viewfinder));
        viewfinder_label->show();
    }

    // Indicate that we want to reuse the same buffers passed earlier
    request->reuse(Request::ReuseBuffers);
    // Queue a new request for frames to libcamera
    camera->queueRequest(request);
}
```

Here, we need to call `window.exec` function, it handles all Qt related tasks. This is a blocking function, after we quit the application this function exits. We can handle the stuff to deallocate and shutdown libcamera after this, so that application quits gracefully.

```cpp
// Qt window handler
int ret = window.exec();

// deallocate after closing window
camera->stop();
allocator->free(stream);
delete allocator;
camera->release();
camera.reset();
cm->stop();
delete viewfinder_label;

return ret;
}
```

So, here is how it worked !! Was lot of fun :) I have attached a screen grab of the application running below.

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/libcamera-2/app-snap.png' | relative_url }}"></p>
