---
layout: page
title: E-Paper Display library
description:  ESP-IDF component for Waveshare epaper displays 
img: /assets/img/epaper_working.gif
github: https://github.com/VedantParanjape/esp-epaper-display
category: hardware
importance: 3
---

ESP-IDF Component for driving waveshare's epaper displays. This is a port of Waveshare's official code for driving epaper display.

* [ ] [ 1.02" D module](https://www.waveshare.com/wiki/1.02inch_e-paper_Module)    
* [x] [ 1.54" V2 module](https://www.waveshare.com/wiki/1.54inch_e-Paper_Module)   
* [ ] [ 1.54" B module](https://www.waveshare.com/wiki/1.54inch_e-Paper_Module_(B))    
* [ ] [ 1.54" C module](https://www.waveshare.com/wiki/1.54inch_e-Paper_Module_(C))    
* [ ] [ 2.13" V2 module](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT)    
* [ ] [ 2.13" B module](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT_(B))   
* [ ] [ 2.13" C module](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT_(C))   
* [x] [ 2.13" D module](https://www.waveshare.com/wiki/2.13inch_e-Paper_HAT_(D))   
* [ ] [ 2.66" module](https://www.waveshare.com/wiki/2.66inch_e-Paper_Module)    
* [x] [ 2.7" module](https://www.waveshare.com/wiki/2.7inch_e-Paper_HAT)   
* [ ] [ 2.7" B module](https://www.waveshare.com/wiki/2.7inch_e-Paper_HAT_(B))   

![](/assets/img/epaper_working.gif)

## Example code

```c
#include "epaper.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/timer.h"

#define COLORED     0
#define UNCOLORED   1

extern "C" void app_main() 
{
  Epd epd;

  unsigned char* frame_ = (unsigned char*)malloc(epd.width * epd.height / 8);

  Paint paint_(frame_, epd.width, epd.height);
  paint_.Clear(UNCOLORED);

  ESP_LOGI("EPD", "e-Paper init and clear");
  epd.LDirInit();
  epd.Clear();

  vTaskDelay(2000);
  int d = 3;
  for (char i = '0'; i <= '9'; i++)
  {
    paint_.DrawCharAt(d, d, i, &Font20, COLORED);
    epd.DisplayPart(frame_);
    vTaskDelay(100);
    d = d + 20; 
  }
  epd.Sleep();
}
```
