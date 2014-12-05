[![Build Status](https://travis-ci.org/reviewninja/dashboard.svg?branch=master)](https://travis-ci.org/reviewninja/dashboard)

# GitHub Dashboard

A lightweight dashboard for GitHub that lets you keep tabs on events in real time.

examples:
- [ReviewNinja](http://github-dashboard.cfapps.io/reviewninja/review.ninja)
- [GitHub Dashboard](http://github-dashboard.cfapps.io/reviewninja/dashboard)

yaml examples:
- [ReviewNinja](https://github.com/reviewninja/review.ninja/blob/master/.dashboard.yml)
- [GitHub Dashboard](https://github.com/reviewninja/dashboard/blob/master/.dashboard.yml)

# Setup

## Add webhook

In your repository add the following webhook, make sure to 
select "send me **everything**". Or just select
specific events, whatever, it's your life.
```
http://github-dashboard.cfapps.io/webhook
```

## Include .dashboard.yml

In the root of your repository add a ```.dashboard.yml``` file.
If no file is present, that's cool, we will use some default settings instead.

```yaml
logo: http://...       # url to logo image
delay: 5               # minutes to display notifications
branch:                # list of watched branches
- master
- release
stats:                 # list of statistics
- url: http://...
icon: octicon octicon-star
- url: http://...
icon: octicon octicon-star
```

## Statistics

Statistics are simple webservices that return a json object with a text value. 
This text will be displayed below the icon you provide, we poll these services
every minute to keep them up-to-date.
An example payload looks like this.
```json
GET: http://myawesomewebservice.com/statistic

{
  "text": "Everything is awesome!"
}
```


# License

Copyright 2014 by [SAP SE](http://www.sap.com) and made available under the
[Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0). 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


# Credits

<p align="center">
![SAP](https://raw.githubusercontent.com/reviewninja/review.ninja/master/sap_logo.png)

<p align="center">
:heart: from the github team @ sap
