---
layout: page
permalink: /publications/
title: publications
nav: true
description: <span>*</span> denotes equal contribution and joint lead authorship.
years: [2022, 2023, 2025]
---
<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
