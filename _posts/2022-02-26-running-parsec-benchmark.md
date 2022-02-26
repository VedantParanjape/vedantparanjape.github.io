---
layout: post
title: Bringing up the parsec-3.0 benchmark
date:   2022-02-25 12:15:00
description: The parsec benchmark doesn't seem to work out of the box and needs few changes, this post describes those
---

## What is PARSEC ?

The Princeton Application Repository for Shared-Memory Computers (PARSEC) is a benchmark suite composed of multithreaded programs. The suite focuses on emerging workloads and was designed to be representative of next-generation shared-memory programs for chip-multiprocessors.

## Getting started

* Download the [PARSEC](https://parsec.cs.princeton.edu/index.htm) release 3.0 from here the site

<p align="center">
    <a href="http://parsec.cs.princeton.edu/download/3.0/parsec-3.0.tar.gz">
        <img class="img-fluid rounded z-depth-1" src="https://parsec.cs.princeton.edu/image/download-3.0.png">
    </a>
</p>

* Download the tutorial for parsec-3.0 from [here](https://parsec.cs.princeton.edu/download/tutorial/3.0/parsec-tutorial.pdf) or refer to the [wiki](https://parsec.cs.princeton.edu/parsec3-doc.htm) one. The pdf tutorial seems to be hidden off in some corner of the website unfortunately.

* Source the env by going into the parsec root directory.
  ```
  source env.sh
  ```

* Build all the apps that can be benchmarked
  ```
  parsecmgmt -a build -p all -c gcc
  ```

## Issues faced

Here are some of the links which helped me solve the issues.

* <https://yulistic.gitlab.io/2016/05/parsec-3.0-installation-issues/>
* <https://groups.google.com/g/snipersim/c/8q9mjnoePbM>
* <https://github.com/lutris/ffmpeg-nvenc/issues/5>

The first link is very detailed, please go through that first to check if you encounter any of the above issues. Other than those issues, I have listed the ones I faced.

1) Issue with C++ version

```bash
In file included from /home/qfettes/benchmarks/parsec/parsec-2.1/./pkgs/apps/bodytrack/src/TrackingBenchmark/threads/WorkerGroup.cpp:17:0:
/home/qfettes/benchmarks/parsec/parsec-2.1/./pkgs/apps/bodytrack/src/TrackingBenchmark/threads/WorkerGroup.h:88:5: error: looser throw specifier for 'virtual threads::WorkerGroup::~WorkerGroup() throw (threads::CondException, threads::MutexException)'
     ~WorkerGroup();
     ^
In file included from /home/qfettes/benchmarks/parsec/parsec-2.1/./pkgs/apps/bodytrack/src/TrackingBenchmark/threads/WorkerGroup.h:18:0,
                 from /home/qfettes/benchmarks/parsec/parsec-2.1/./pkgs/apps/bodytrack/src/TrackingBenchmark/threads/WorkerGroup.cpp:17:
/home/qfettes/benchmarks/parsec/parsec-2.1/./pkgs/apps/bodytrack/src/TrackingBenchmark/threads/Thread.h:31:13: error:   overriding 'virtual threads::Runnable::~Runnable() noexcept'
     virtual ~Runnable() {};
```

Solution: Add `-std=c++11` to the line `export CXXFLAGS` in the file `config/gcc.bldconf`


```
export CXXFLAGS="-O3 -g -funroll-loops -fprefetch-loop-arrays -fpermissive -fno-exceptions ${PORTABILITY_FLAGS} -std=c++11"
```

2) Issue with compiling x264

```bash
/usr/bin/ld: libx264.a(cabac-a.o): relocation R_X86_64_32 against symbol x264_cabac_range_lps' can not be used when making a shared object; recompile with -fPIC /usr/bin/ld: libx264.a(quant-a.o): relocation R_X86_64_32 against hidden symbolx264_pb_01' can not be used when making a shared object
/usr/bin/ld: libx264.a(dct-a.o): relocation R_X86_64_32 against hidden symbol x264_pw_8000' can not be used when making a shared object /usr/bin/ld: libx264.a(deblock-a.o): relocation R_X86_64_32 against hidden symbolx264_pb_1' can not be used when making a shared object
/usr/bin/ld: libx264.a(mc-a.o): relocation R_X86_64_32 against hidden symbol x264_pw_64' can not be used when making a shared object /usr/bin/ld: libx264.a(mc-a2.o): relocation R_X86_64_32 against hidden symbolx264_pw_32' can not be used when making a shared object
```

Solution: The problem here is that we need to enable fPIC in the configure step. Add `--enable-pic ` to `build_conf` in the file `pkgs/apps/x264/parsec/gcc-pthreads.bldconf`

```
build_conf="--enable-pthread --enable-pic --extra-asflags=\"${ASFLAGS}\" --extra-cflags=\"${CFLAGS}\" --extra-ldflags=\"${LDFLAGS} ${LIBS}\""
```