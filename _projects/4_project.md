---
layout: page
title: Synchronous Music Player
description: A sync audio player using Boost.Asio and Boost.Thread
github: https://github.com/VedantParanjape/audio-streamer
category: software
importance: 4
---

A synchronous audio player, play time synced audio across multiple devices connected through LAN. Build on top of Boost.Asio.
Uses a TCP server to transfer audio files on connection and a UDP server to control devices.

## dependencies

`boost-1.65(tested only on version 1.65)`  
`pyglet`  
`libavbin`  
`picoSHA2`  

## compile instructions

`cd build`  
`cmake ..`  
`make`  

the program binaries are generated in /build
## usage

`./server [filename]`

enter a mp3 file to be played

`./client [server IP] [server PORT]`

for local configuration IP: 127.0.0.1 PORT: 9292
type "play" and press enter twice in the server console to start playing audio on all clients once all of them are connected and file is transferred
