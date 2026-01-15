---
layout: about
title: about
permalink: /
description: low-level software and hardware tinkering

profile:
  align: right
  image: img_profile.jpg

news: false  # includes a list of news items
selected_papers: false # includes a list of papers marked as "selected={true}"
social: true  # includes social icons at the bottom of the page
---

I am a final year undergraduate student at Veermata Jijabai Technological Institute, majoring in Electronics Engineering. 
I have been a hardware geek since I was in 8th grade, started off by reading Electronics For you mags in the school library.

I have been working on quite a lot of open source projects since the last 4 years, currently contributing to [PyFive](https://github.com/PyFive-RISC-V), which is a RISC-V libre silicon made using Google PDK, and [kimchi-micro](https://groupgets.com/manufacturers/getlab/products/kimchi-micro), which is open hardware single board computer for the NXP i.MX8M Mini application processor.

For the past one year I have been working on [Open Authenticator](https://open-authenticator.github.io/) in my free time. It is an open source TOTP based hardware authenticator using ESP32. The beta build is available for sale on [Tindie](https://www.tindie.com/products/vedantvp16/open-authenticator-beta-build/).

My Research Interests are:
* Embedded systems
* Computer Architecture
* Robotics
* Linear Algebra

For a quick chat you can reach me out on Matrix [@vedant16:matrix.org](https://matrix.to/#/@vedant16:matrix.org)

# Experience

{% for experience in site.data.experience %}
<div>
    {% if experience.title %}
    <h4 class="title font-weight-bold">{{experience.title}}</h4>
    {% endif %}
    {% if experience.role %}
    <h6 class="title font-weight-bold">{{experience.role}}</h6>
    {% endif %}
    {% if experience.year %}
    <span class="badge font-weight-bold light-blue">
        {{ experience.year }}
    </span>
    {% endif %}
    {% if experience.description %}
        <ul class="items">
            {% for item in experience.description %}
                <li>
                    {% if item.contents %}
                        <span class="item-title">{{ item.title }}</span>
                        <ul class="subitems">
                        {% for subitem in item.contents %}
                            <li><span class="subitem">{{ subitem }}</span></li>
                        {% endfor %}
                        </ul>
                    {% else %}
                        <span class="item">{{ item }}</span>
                    {% endif %}
                </li>
            {% endfor %}
        </ul>
    {% endif %}
    {% if content.items %}
        <ul class="items">
            {% for item in content.items %}
                <li>
                    {% if item.contents %}
                        <span class="item-title">{{ item.title }}</span>
                        <ul class="subitems">
                        {% for subitem in item.contents %}
                            <li><span class="subitem">{{ subitem }}</span></li>
                        {% endfor %}
                        </ul>
                    {% else %}
                        <span class="item">{{ item }}</span>
                    {% endif %}
                </li>
            {% endfor %}
        </ul>
    {% endif %}
</div>
{% endfor %}
