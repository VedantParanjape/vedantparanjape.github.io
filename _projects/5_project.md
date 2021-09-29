---
layout: page
title: PID tuning utility
description: GUI app to tune and plot pid data from WALL-E robot
img: /assets/img/pid_plotter_working.gif
github: https://github.com/VedantParanjape/pid-tuning-gui
category: hardware
importance: 5
---

PID plotter is a app suite for tuning PID loop on ESP32 devices, it provides a esp-idf component library to communicate with the server. 

Uses TCP sockets to receive control data and UDP sockets to transmit PID data to server.

Library to be used on the Microcontroller: [https://github.com/VedantParanjape/pid-plotter-component](https://github.com/VedantParanjape/pid-plotter-component)

ESP-IDF component for pid-tuning-gui. This transports data, between the plotter and esp device.

<p align="center"><img class="img-fluid rounded z-depth-1" src="{{ '/assets/img/pid_plotter_working_2.png' | relative_url }}"></p>
