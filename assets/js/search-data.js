// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "* denotes equal contribution and joint lead authorship.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "post-bringing-up-the-parsec-3-0-benchmark",
        
          title: "Bringing up the parsec-3.0 benchmark",
        
        description: "The parsec benchmark doesn&#39;t seem to work out of the box and needs few changes, this post describes those",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/running-parsec-benchmark/";
          
        },
      },{id: "post-midway-through-google-summer-of-code-21-with-libcamera",
        
          title: "Midway through Google Summer of Code 21 with libcamera",
        
        description: "This is a writeup describing my experience uptil now working with libcamera",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/gsoc-libcamera/";
          
        },
      },{id: "post-making-a-simple-camera-streamer-with-libcamera",
        
          title: "Making a simple camera streamer with libcamera",
        
        description: "This is a log for documenting issues/observations encountered while creating an Qt app with libcamera",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/libcamera-log-2/";
          
        },
      },{id: "post-getting-started-with-libcamera",
        
          title: "Getting started with libcamera",
        
        description: "This is a log for documenting issues/observations encountered while compiling libcamera and using it",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/libcamera-log/";
          
        },
      },{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-open-authenticator",
          title: 'Open Authenticator',
          description: "An open source TOTP based hardware authenticator using ESP32.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-esp32-wireless-logger",
          title: 'ESP32 Wireless Logger',
          description: "Log messages over WiFi, using either TCP, UDP or Websockets",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-e-paper-display-library",
          title: 'E-Paper Display library',
          description: "ESP-IDF component for Waveshare epaper displays",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-synchronous-music-player",
          title: 'Synchronous Music Player',
          description: "A sync audio player using Boost.Asio and Boost.Thread",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-pid-tuning-utility",
          title: 'PID tuning utility',
          description: "GUI app to tune and plot pid data from WALL-E robot",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-usb-uart-adapter-for-kimchi-micro",
          title: 'USB-UART adapter for kimchi-micro',
          description: "UART adapter for the kimichi micro SBC by GroupGets",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-epaper-lid-for-kimchi-micro",
          title: 'Epaper lid for kimchi-micro',
          description: "Epaper lid for the kimichi micro SBC by GroupGets",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%76%65%64%61%6E%74@%76%65%30%78%31%30.%69%6E", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/vedantparanjape", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/vedantvp16", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/ve0x10", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
