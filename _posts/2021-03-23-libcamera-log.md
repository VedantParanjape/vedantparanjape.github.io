---
layout: post
title: Getting started with libcamera
date:   2021-03-23 23:40:16
description: This is a log for documenting issues/observations encountered while compiling libcamera and using it
---

**I am applying for GSoC again, but this time with libcamera. I will log issues I faced while compiling and running it**    


* I first of all completed the getting started section of libcamera, it involved setting up and compiling libcamera and then using the libcamera's gstreamer element to view the camera.    
* I had some issues with installing meson, it was due to conflict between system-wide and local meson installation, nevertheless it was fixed by doing a clean install of meson.    
* libcamera compiled fine and installed alright. Next step was running qcam, as I was not versed with meson, it took some time to figure out how to do it, I found a meson_options.txt in the repository, it described different options that can be used during compilation. After tinkering for 10-15 mins, I discovered these options could be set using `-Doption=value`, so in my case here was the command I passed `meson build -Dqcam=enabled` and then did `ninja -C build install`, boom !! It worked and qcam was up and running.
* Next step was getting it working using gstreamer element, here I hit a few roadblock, but libcamera community helped me out.

```bash
vedant@veware:~/Programming/contributing/libcamera$ gst-launch-1.0 libcamerasrc camera-name="Camera 1" ! videoconvert ! autovideosink
Setting pipeline to PAUSED ...
[13:46:40.435410189] [130071]  INFO IPAManager ipa_manager.cpp:136 libcamera is not installed. Adding '/home/vedant/Programming/contributing/libcamera/build/src/ipa' to the IPA search path
[13:46:40.437823453] [130071]  INFO Camera camera_manager.cpp:293 libcamera v0.0.0+2399-f5d3fa12
ERROR: Pipeline doesn't want to pause.
ERROR: from element /GstPipeline:pipeline0/GstLibcameraSrc:libcamerasrc0: Could not find a camera named 'Camera 1'.
Additional debug info:
../src/gstreamer/gstlibcamerasrc.cpp(231): gst_libcamera_src_open (): /GstPipeline:pipeline0/GstLibcameraSrc:libcamerasrc0:
libcamera::CameraMananger::get() returned nullptr
Setting pipeline to NULL ...
Freeing pipeline ...
```

* It couldn't find the camera from which it needs to read. At first I assumed it had to read from `/dev/media0` or `/dev/video0`, but that was not the case. I searched the internet for a possible fix, and found this: <https://github.com/kbingham/libcamera/issues/23> of some help, there's an application built with libcamera called `cam` which lists the cameras detected in the system.

```bash
vedant@veware:~/Programming/contributing/libcamera$ ./build/src/cam/cam --list
[14:14:26.788501804] [135352]  INFO IPAManager ipa_manager.cpp:136 libcamera is not installed. Adding '/home/vedant/Programming/contributing/libcamera/build/src/ipa' to the IPA search path
[14:14:26.791292800] [135352]  INFO Camera camera_manager.cpp:293 libcamera v0.0.0+2399-f5d3fa12
Available cameras:
1: External camera 'HD WebCam: HD WebCam' (\_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060)
```

* So, now I had the camera Id (`\_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060`) that needed to be passed to gst-streamer. Well, so I passed it as follows, but to my surprise it didn't work out.   

```bash
vedant@veware:~/Programming/contributing/libcamera$ gst-launch-1.0 libcamerasrc camera-name="\_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060" ! videoconvert ! autovideosink
Setting pipeline to PAUSED ...
[14:29:42.239109028] [136560]  INFO IPAManager ipa_manager.cpp:136 libcamera is not installed. Adding '/home/vedant/Programming/contributing/libcamera/build/src/ipa' to the IPA search path
[14:29:42.242018936] [136560]  INFO Camera camera_manager.cpp:293 libcamera v0.0.0+2399-f5d3fa12
ERROR: Pipeline doesn't want to pause.
ERROR: from element /GstPipeline:pipeline0/GstLibcameraSrc:libcamerasrc0: Could not find a camera named '_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060'.
Additional debug info:
../src/gstreamer/gstlibcamerasrc.cpp(231): gst_libcamera_src_open (): /GstPipeline:pipeline0/GstLibcameraSrc:libcamerasrc0:
libcamera::CameraMananger::get() returned nullptr
Setting pipeline to NULL ...
Freeing pipeline ...
```

* Upon discussion on the IRC, I realised it was a issue with backlash, I had to somehow escape it. So changed the id to `\\_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060`, and it still didn't work. I was scratching my head at this point. After a point I realised there might be a issue due to double quotes, replaced them with single quotes and it worked then. this was the command I ran `gst-launch-1.0 libcamerasrc camera-name='\\_SB_.PCI0.XHC_.RHUB.HS07-7:1.0-0408:a060' ! videoconvert ! autovideosink`     

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/gstreamer-element-working.png' | relative_url }}"></p>

The window shows patches of color, as I have covered the camera with a tape (yes I am paranoid), but it displays a image fine after removing the tape.