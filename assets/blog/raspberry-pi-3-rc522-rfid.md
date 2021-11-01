---
title: 解決Raspberry Pi3無法使用RC522讀取RFID的問題
date: 2016-08-02 22:22:54
tags:
    - RFID
    - RC522
    - Raspberry Pi
---

最近開始研究起了Raspberry Pi其相關的周邊硬體，在玩到讀取RFID的時候出現了一些問題，照著網路上的範例接RC5232模組，卻怎麼樣也讀不到資料，經過一翻苦戰(google)後，總算是找到了問題與解決方法，在這邊紀錄一下。

<!-- more -->

首先根據[這篇官方論壇的討論](https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=147291)可以得知，原來問題是出在Raspbian Jessie這個官方作業系統上面，如果使用的image是2016-03-18的版本就沒有問題，但目前最新的2016-05-27的版本就讀不到，原因是因為**2016-05-27版本對其中第24號pin腳的設定不正確，但34號PIN腳卻是使用RC522必要的pin腳**。

知道問題後，就比較容易解決了，其中一種方式是直接找到2016-03-18的版本重裝，或是等下一個版本的image檔？不過這樣都不太符合經濟效益，所以選擇了另外一種方式，**直接更新目前2016-05-27版本的核心內容**，具體步驟如下

1.  apt-get先進行更新

    ```
    sudo apt-get update
    sudo apt-get upgrade
    ```

2.  更新kernel

    ```
    sudo rpi-update
    ```

3.  使用raspi-config確認已經啟用SPI協定功能

    ```
    sudo raspi-config
    ```

4.  在/boot/config.txt最後加入以下內容

    ```
    dtoverlay=spi0-hw-cs
    ```

5.  重開raspberry pi

    ```
    sudo reboot now
    ```

6.  確認24pin腳設定正確

    ```
    gpio readall
    ```

24pin的內應該是**"24 | 1 | ALT0 | CE0 | 10 | 8 | "**

如果不是ALT0，而是IN或OUT代表沒有正確設定好

以上步驟完成，就可以正確使用RC522讀取RFID的資料啦！

{% asset_img pi-rfid.jpg %}

1.  PIN腳對應如下

    | Name | Pin # |
    | ---- | ----- |
    | SDA  | 24    |
    | SCK  | 23    |
    | MOSI | 19    |
    | MISO | 21    |
    | IRQ  | None  |
    | GND  | Any   |
    | RST  | 22    |
    | 3.3V | 1     |

2.  透過已下指令安裝相關需要的工具跟範例程式

    ```shell
    cd ~
    sudo apt-get install -y python-dev
    git clone https://github.com/lthiery/SPI-Py.git
    cd SPI-Py
    sudo python setup.py install
    cd ..
    git clone https://github.com/mxgxw/MFRC522-python.git
    cd MFRC522-python
    ```

3.  開啟Read.py

    ```shell
    python Read.py
    ```

接下來只要把RFID靠近RC522，應該就可以看到螢幕上有顯示這張卡的卡號囉。