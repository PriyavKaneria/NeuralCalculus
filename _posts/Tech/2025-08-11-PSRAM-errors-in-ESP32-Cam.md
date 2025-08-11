---
title: PSRAM errors in ESP32 Cam
categories: [tech]
tags: [hardware,docucap,esp32cam]
---

```log
E (221) psram: PSRAM ID read error: 0xffffffff
```

```log
E (861) cam_hal: cam_dma_config(301): frame buffer malloc failed
E (861) cam_hal: cam_config(385): cam_dma_config failed
E (862) camera: Camera config failed with error 0xffffffff
Camera init failed: 0xffffffff
```

## Any of these errors seem familiar? I might be able to help

Was stuck in this problem for a whole day and the solution is absolutely nowhere. Open threads, half-baked solutions and unresolved stack exchanges.

I will explain what was happening from the start. I have a few ESP32 Cam modules lying around using which I am building a project. For some reason suddenly one of my ESP32 Cam modules when connected to development board started giving me these errors `PSRAM ID read error: 0xffffffff` and `frame buffer malloc failed`.

I asked all LLMs, went into all possible links on the web where any mention on ESP32 Cam and the camera configuration was there. Here is what I found out -

## What does the error mean?

Well, once you realize what the error really means it is kindof obvious in hindsight that what might be going wrong. \
First of all `PSRAM ID read error: 0xffffffff` implies the PSRAM on board either does not exist or is not working. But what even is PSRAM?

![memory chips on ESP32 CAM](/assets/img/posts/esp32-cam-psram.png){: w="700" h="400" .shadow}
_memory chips on ESP32 CAM_

PSRAM stands for Pseudo-Static RAM, an external memory chip that expands the available memory for the microcontroller that can be used quickly and directly by the microcontroller to store frame data and more than 1 frame buffer for a smoother image stream.

The other available memory units are 4MB of SPI flash memory and 520KB of SRAM. The 4MB of flash memory is used to stored the firmware, and files to keep the camera and other resources working. The 520KB of internal SRAM is divided into 320KB DRAM (Dynamic RAM) where 160KB maximum can be allocated by the program and 200KB IRAM (Instruction RAM) where the compiled program and intructions actually live.

Alright so first check if your board even has a PSRAM or not, if not you will have to rely comulsorily on DRAM and single frame buffer. If you still face these errors, keep reading as there is more to it.

If you have a PSRAM but you are getting PSRAM read error, then sorry but your hardware is faulty and th PSRAM is probably not working or unusable (there might be chances of manually fixing connections with GPIO16 if that is the issue, but I doubt that is the case). This was the case for me and I was struggling to get a confirmation because by looking at all the code implementations I thought oh, PSRAM is 4MB which is a lot of space, so we can send higher resolution images only if PSRAM is available and everywhere you will see some code like this

```c#
if (config.pixel_format == PIXFORMAT_JPEG) {
    if (psramFound()) {
        config.frame_size = FRAMESIZE_QVGA;
        config.fb_location = CAMERA_FB_IN_PSRAM;
        config.jpeg_quality = 10;
        config.fb_count = 2;
        config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
        Serial.println("NO PSRAM, falling back to DRAM");
        // Limit the frame size when PSRAM is not available
        config.frame_size = FRAMESIZE_SVGA;
        config.fb_location = CAMERA_FB_IN_DRAM;
    }
}
```
so I inferred from this that PSRAM -> all resolutions supported due to size, no PSRAM -> only upto SVGA can fit it. But this is **not correct**.
I was running this [CameraWebServer](https://github.com/RuiSantosdotme/arduino-esp32-CameraWebServer) standard code and it seemed to work well. The ESP initialized, camera was detected and working and I was able to even get the highest QVGA resolution images. So I thought the PSRAM was working and something was badly initialized in my code.

After a lot of moving around code I was naive and realized the PSRAM was not working even in the standard web server example, and that **higher resolutions support does not imply PSRAM is necessarily there and working.**

## Alright so PSRAM is not there/not working, what now?

So sadly I came out of denial and accepted that my PSRAM was faulty. But at least now I know that it is still possible to get higher resolution images, how? Higher resolution images actually do not take up all that space as ESP32 Cam interally supports JPEG compression. All images are compressed and stored. But still they are not small either and we don't have a lot of space to work with (160KB of DRAM space).

And I thought okay falling back to DRAM should work right? no still same errors :(

![esp broke me](/assets/img/posts/esp32-meme.png){: w="700" h="400" .shadow}
_esp broke me_

But this time it was not long until I understood that the jpeg compression quality is what will define how much can we actually store in our DRAM. Here is the final code that identifies the free space available and then sets the jpeg quality based on the avilable space

```c#
// code assumes you have some config defined as `camera_config_t config;` and then used as `esp_err_t err = esp_camera_init(&config);` in setup after this function is called
// also all the variables are assumed to be imported from camera_pins.h based on the board definition - ref https://github.com/RuiSantosdotme/arduino-esp32-CameraWebServer
void setupOptimalCamera() {
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  
  Serial.printf("PSRAM found: %s\n", psramFound() ? "YES" : "NO");
  Serial.printf("Free DRAM: %d bytes\n", ESP.getFreeHeap());
  Serial.printf("Largest free DRAM block: %d bytes\n", heap_caps_get_largest_free_block(MALLOC_CAP_8BIT));
  
  if (psramFound()) {
    Serial.println("PSRAM detected - using enhanced settings");
    config.fb_location = CAMERA_FB_IN_PSRAM;
    config.frame_size = FRAMESIZE_UXGA;    // 1600x1200
    config.jpeg_quality = 4;               // Higher quality with PSRAM
    config.fb_count = 2;
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    Serial.println("No PSRAM - using conservative DRAM settings");
    config.fb_location = CAMERA_FB_IN_DRAM;
    
    // Check available memory and adjust accordingly
    size_t free_dram = heap_caps_get_free_size(MALLOC_CAP_8BIT);
    size_t largest_block = heap_caps_get_largest_free_block(MALLOC_CAP_8BIT);
    
    Serial.printf("Available DRAM: %d, Largest block: %d\n", free_dram, largest_block);
    
    // Progressive fallback based on available memory
    if (largest_block > 200000) {
      // Try SXGA first
      config.frame_size = FRAMESIZE_SXGA;    // 1280x1024
      config.jpeg_quality = 8;
    } else if (largest_block > 150000) {
      // Fall back to XGA  
      config.frame_size = FRAMESIZE_XGA;     // 1024x768
      config.jpeg_quality = 8;
    } else if (largest_block > 100000) {
      // Fall back to SVGA
      config.frame_size = FRAMESIZE_SVGA;    // 800x600
      config.jpeg_quality = 10;
    } else {
      // Last resort - VGA
      config.frame_size = FRAMESIZE_VGA;     // 640x480
      config.jpeg_quality = 12;
    }
    
    config.fb_count = 1;                   // Single frame buffer only
  }
  
  Serial.printf("Selected frame size: %d, quality: %d\n", config.frame_size, config.jpeg_quality);
}
```

Additional helper function if you want to debug
```c#
// Memory diagnostic function
void printMemoryInfo() {
  Serial.println("=== Memory Diagnostics ===");
  Serial.printf("Free heap: %d bytes\n", ESP.getFreeHeap());
  Serial.printf("Min free heap: %d bytes\n", ESP.getMinFreeHeap());
  Serial.printf("Heap size: %d bytes\n", ESP.getHeapSize());
  
  Serial.printf("Free PSRAM: %d bytes\n", ESP.getFreePsram());
  Serial.printf("PSRAM size: %d bytes\n", ESP.getPsramSize());
  Serial.printf("PSRAM found: %s\n", psramFound() ? "YES" : "NO");
  
  // Check different memory types
  Serial.printf("Free 8-bit DRAM: %d bytes\n", heap_caps_get_free_size(MALLOC_CAP_8BIT));
  Serial.printf("Largest 8-bit block: %d bytes\n", heap_caps_get_largest_free_block(MALLOC_CAP_8BIT));
  Serial.printf("Free DMA memory: %d bytes\n", heap_caps_get_free_size(MALLOC_CAP_DMA));
  Serial.printf("Largest DMA block: %d bytes\n", heap_caps_get_largest_free_block(MALLOC_CAP_DMA));
  Serial.println("========================");
}
```

That's all folks. The FPS will obviously not be the great considering that the PSRAM is not there, but the quality will be still the best possible. Hope your esp works as intended as long as it lives. If you found this helpful, follow me on X : [@_diginova](https://x.com/_diginova)