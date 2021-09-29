---
layout: page
title: Open Authenticator
description: An open source TOTP based hardware authenticator using ESP32.
img: /assets/img/final_build_1.jpg
github: https://open-authenticator.github.io
category: hardware
importance: 1
---

<p align="center">
    <img src="https://open-authenticator.github.io/assets/open-autheticator-logo.png" width="200" height="200">
</p>

<p align="center">
<img alt="GitHub watchers" src="https://img.shields.io/github/watchers/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub forks" src="https://img.shields.io/github/forks/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/open-authenticator/open-authenticator-app?style=plastic">
<img alt="GitHub license" src="https://img.shields.io/github/license/open-authenticator/open-authenticator-app?style=plastic">
</p>

The Open Authenticator is an open source TOTP based hardware authenticator using
ESP32. In layman's terms, this does what Google Authenticator or Authy does.
This uses a custom built pcb and a 3d case, also it uses a firmware built for
this purpose using esp-idf, uses lvgl as the GUI library.

The features of open authenticator's [printer circuit board](https://github.com/Open-Authenticator/hardware-design) are:   

* Small form factor of 82mm x 42mm
* Uses ESP32-WROOM-32D module
* Uses 128x64 0.96" inch OLED panel
* Uses DS3231 RTC with battery backup (CR2032) for timekeeping
* Powered by 3.7V 300 mAh LiPo battery
* Uses MCP73831 for charging LiPo battery
* Uses TPS63001 Buck Boost Converter IC for efficient 3.3V power supply, with input range from 1.8V - 5.5V
* Uses TPS22919 Load switch to control power to OLED and RTC chip
* Autoselect power source, i.e., battery or USB
* USB Type-C for charging only (no data pins connected)

## Media Coverage

* Hackster.io: [TOTP-Based Open Hardware Authenticator Powered by an ESP32 Microcontroller](https://www.hackster.io/news/totp-based-open-hardware-authenticator-powered-by-an-esp32-microcontroller-c770f10008af)

## Project logs

* Hackaday: [https://hackaday.io/project/176959-open-authenticator](https://hackaday.io/project/176959-open-authenticator)

## Repositories

* PCB Design: [https://github.com/Open-Authenticator/hardware-design](https://github.com/Open-Authenticator/hardware-design)
* Firmware: [https://github.com/Open-Authenticator/open-authenticator-app](https://github.com/Open-Authenticator/open-authenticator-app)
* 3D-Case: [https://github.com/Open-Authenticator/3d-case](https://github.com/Open-Authenticator/3d-case)


## Components

* [Bill of Material](https://docs.google.com/spreadsheets/d/1dUZdB7LErKdkV40vjPda2T-85nJA-UcwpFP-PLhwYTE/edit?usp=sharing)

## Sponsors

* [OSHPark](https://oshpark.com/) - Thanks to OSHPark for sponsoring first prototype
* [PCBWay](https://www.pcbway.com/) - Thanks to PCBway for sponsoring the final prototype
* [Asahitec](https://www.asahitec.in/index.html) - Thanks for discounts on stencil
