---
layout: post
title: Midway through Google Summer of Code 21 with libcamera
date:   2021-07-19 23:40:16
description: This is a writeup describing my experience uptil now working with libcamera
---

I began, as most GSoC-ers do, buried in a mountain of code. Initially working with libcamera was intimidating to be honest. Simply because, it’s much more difficult to understand and contribute to code that is written by someone else. After digging through each and every function and figuring out what its use was, I could finally start to see the bigger picture that was Libcamera and how gstreamer fit in. Docs of gstreamer and glib came in very handy. I had a decent idea of how to use libcamera, my efforts in solving the warm up tasks paid off well.

Here's my progress tracker: [https://ve0x10.in/gsoc2021/](https://ve0x10.in/gsoc2021/)

# Experience
## Student Application period
Armed with my experience of applying to GSoC organization last year, I applied the same this year, communication being the most important point for being selected. I logged everything I did and was active on libcamera IRC asking doubts and improving my understanding of libcamera. One major obstacle I faced in **Student Application period** was learning how to send a patch over email. The first patch I sent was adding troubleshooting section in the README, after 10-15 versions and long thread of discussion over mailing list, it was finally accepted and merged in. Felt like I had just won a [trophy](https://git.linuxtv.org/libcamera.git/commit/?id=76a5861f3ef0950d9b57e54668c9059ed7bddd89). Special thanks to the libcamera community who walked me through everything like I’m a 5-year-old, i.e, answered all my doubts even though basic. While first trying to compile and test the example apps in libcamera, I faced few issues and I did document them and how I got around them, and this helped me big time while doing my project and also to exhibit my seriousness to my mentors. Here’s the two logs: [1](https://ve0x10.in/blog/2021/03/23/libcamera-log.html) and [2](https://ve0x10.in/blog/2021/04/04/libcamera-log-2.html).

## Community Bonding
Results were out on May 17th, I got a mail at 23:30 of my selection. Although I didn't feel the naive excitement of being selected for GSoC for the very first time, but it did make me happy to see my efforts rewarded by my mentors and that I’d get to work on a *linux kernel*-like open source project (I mean in terms of way of contributions). After selection, I got in touch with both of my mentors, Paul and Nicolas. Finding a common time for a weekly meeting was tricky, as we all lived in equally spaced three different timezones, Nicolas in Canada, me in India and Paul in Japan, we did settle on a time and I created a matrix group for discussion with my mentors.

## Coding Period
I couldn’t read much in the community bonding period, as I had other stuff to attend to. Come June and I was finally free, I started working from 1 June itself, i.e. one week before the official start date. I started with going through the gstreamer libcamera element’s source code. Much of the code was like a alien language to me, as I had never worked with gstreamer or glib. glib is a C library which adds C++ like OOPS features to C, and gstreamer uses it extensively. glib is a pretty complex library, I had to give in extra efforts to understand basic things like how a class is defined using glib, it has a very non-intuitve way to do so, I’ll give a short example.

* gstlibcamerasrc.h
    ```c
    #define GST_TYPE_LIBCAMERA_SRC gst_libcamera_src_get_type()
    G_DECLARE_FINAL_TYPE(GstLibcameraSrc, gst_libcamera_src,
                GST_LIBCAMERA, SRC, GstElement)
    ```

* gstlibcamerasrc.cpp
    ```c
    struct _GstLibcameraSrc {
        GstElement parent;

        GRecMutex stream_lock;
        GstTask *task;

        gchar *camera_name;

        GstLibcameraSrcState *state;
        GstLibcameraAllocator *allocator;
        GstFlowCombiner *flow_combiner;
    };

    G_DEFINE_TYPE_WITH_CODE(GstLibcameraSrc, gst_libcamera_src, GST_TYPE_ELEMENT,
                GST_DEBUG_CATEGORY_INIT(source_debug, "libcamerasrc", 0,
                            "libcamera Source"))
    ```

Welcome to the rabbit hole that is glib, yes this is how you define a gclass called `GstLibcameraSrc`, to be fair it does provide excellent documentation. Another feature of glib which is equally confusing is `g_pointer` and how it handles references. There’s no equivalent of a `unique_ptr` and `shared_ptr`, there’s just a normal `gpointer` (also `g_autoptr` and `g_autofree`). Now each pointer has a count of references, to put it in layman’s terms number of copies that exist for a pointer, you might confuse this for a `std::shared_ptr` but don’t it’s not a `shared_ptr` or a `unique_ptr`. To achieve a functionality *similar* to `shared_ptr`, there are two functions called `g_object_ref()` and `g_object_unref()`. 

Here’s what the docs for `g_object_ref` say
```
Increases the reference count of object .
```
and Here’s what the docs for `g_object_unref` say
```
Decreases the reference count of object . When its reference count drops to 0, the object is finalized (i.e. its memory is freed).
```

So, tldr, with these two functions the pointer behaves like a `shared_ptr`, so whenever I’d want to pass a pointer into some other functional block of code, one should take reference of it and pass the reference, and unref it instead of freeing it when done. Coming to the next function, called `g_steal_pointer` which does something *similar* to a `unique_ptr`. As the name suggests it steals the ownership of the pointer passed to it and passes it to the caller of the macro.

Here’s what the docs for `g_steal_pointer` say
```
Conceptually, this transfers the ownership of the pointer from the referenced variable to the "caller" of the macro (ie: "steals" the reference).
```
To be accurate, `g_steal_pointer` is much like `std::move`, it will not affect any other hard references but only transfer ownership of the pointer passed to it.

Finally, having understood the nitty-gritty of glib, I ventured into gstreamer world, it was relatively easier than glib. Since I had already read docs about creating a custom gstreamer element, this stage was pretty quick. I had come up with a plan to first implement live reconfig on gstreamer, but on discussing this with mentors I was advised not to work on this, I was suggested to work on getting request pads working when gstreamer was not in `PLAYING` state. I simply had to implement two callback functions `_request_new_pad` and `_release_pad` and then pass the function pointer of these to their respective callback handlers in `gst_libcamera_src_class_init`. This was a quick step, but the first draft did compile, but it was far from being correct and working. There was an issue with how I was handling mutex. In the `gst_libcamera_src_request_new_pad` function, I was taking a lock on `GstLibcameraSrc` as follows `GLibLocker lock(GST_OBJECT(self));` and then doing the necessary steps. One of the steps was adding the new source pad to `GstElement` as follows `gst_element_add_pad(element, pad)`. With this code, It ended in a deadlock, and I was not sure why. Again, the reason was the stark difference between `std::mutex` and `GMutex`. If I lock a `GObject` using `GMutex` that object is locked even for the scope where the object lock was taken. `std::mutex` doesn’t behave this way, and I expected it to. So, in short I was trying to add pad to `element` even though it was locked, and thus it ended in a deadlock, with a bit of refactoring the code this problem was eliminated, and boom it started working. Ah, I didn’t get multistream *yet*, it still failed but not due to deadlock, though a request pad was created and destroyed successfully, thus my callback functions were functional.

Next step was writing test code to try multistream functionality. I wrote a example app, but I couldn’t get it working for 2-3 days as I was doing it all wrong. It did create two windows, but only one of them had video from camera other one was blank (app window blurred for privacy)

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/gsoc-log-1/multistream-fail.png' | relative_url }}"></p>

It was something very simple I just had to use gst-launch, I was overengineering it all. Nicolas helped me write the command to make it work, it was as easy as this:
```
gst-launch-1.0 libcamerasrc camera-name="/base/soc/i2c0mux/i2c@1/ov5647@36" name=src src.src ! queue ! videoconvert ! autovideosink src.src_0 ! queue ! videoconvert ! autovideosink
```
Since UVC pipeline doesn’t support multistream output, and my laptop has a UVC webcam. I had to shift to a Raspberry Pi 4B+ and use a CSI camera with it, rpi pipeline does support multistream. It took some time to make a working setup, but then it did finally work. I was hardly one week into the internship and I had completed the primary goal of my GSoC project, the amount of code that was needed was surprisingly less, but it did require a considerable amount of understanding and effort to make the changes. It worked, it had a issue, color of one of the stream was incorrect, and I have not able to solve this issue to date. The next step was creating a patch and submitting the patch, it took quite a lot of time to finally get reviewed-by tag. I refactored the code twice to make sure the object is locked for the minimum required time, after a few corrections to the commit message, it was finally merged on 25th June. Here’s the [commit](https://git.linuxtv.org/libcamera.git/commit/?id=53a0d80af0f9983d6bc0d54b0e85403a08721488)

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/gsoc-log-1/multistream-pass.png' | relative_url }}"></p>

Like I mentioned earlier, the multistream output on raspberry-pi had color disparity. This was the next big task that I needed to fix, upon going through debug logs, I found there was a mismatch between libcamera pixel format and v4l2 pixel format. The next few weeks I worked on fixing this and submitting the patches, they were merged in eventually. But this didn’t fix the color format issue. As of now, I have started working on live reconfig functionality. 

# Summary
Lot of work still needs to be done. Since I finished my primary goal pretty early, Nicolas suggested that it would be good if I make a Qt-GUI app using gstreamer libcamera element which will also showcase multistream capabilities. Other than this, I need to work on live reconfig, such that request pads can be allocated even when gstreamer is in `PLAYING` state
