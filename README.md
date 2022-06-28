# Twitch Task List overlay

A simple task list overlay for co-working streamers on Twitch!
Allows streamer and twitch chat to display their tasks on the overlay.

**Why you should use this overlay:**

-    Lightweight
-    Setup instructions on Youtube
-    Highly customisable
-    No third party databases required
-    Requires no servers or third-party hosting, just run OBS and you're good to go!

---

## How to setup?

-    [Installation](#installation)
-    [Twitch application](#twitch-application)
-    [OBS setup](#obs-setup)

### Pre-requisites

-    An IDE (recommended: Visual Studio Code, Brackets.io)
-    OBS (SLOBS, other variations)

### Installation

1. Install zip file or use git to install folder
2. Follow instructions on [Twitch Application](#twitch-application)

---

### Twitch Application

1. Go to [Twitch Developers](https://dev.twitch.tv) and create a twitch application
2. Enter `Name`
3. Enter `http://localhost` for OAuth Redirect URL
4. Select `Chat Bot` for the Category

![register application details](./references/application_details_one.png)

5. Create your application.
6. Obtain the `Client ID` from the application
7. Put the Client ID into the [get token link](./references/get_token.txt)
8. Use
9. In the URL, obtain the `access_token`
10. Paste the `access_token` into [index.js](./scripts/index.js)
11. [Finish setup](#obs-setup)

---

### OBS setup

1. Create a new **Browser Source**
2. Select `Local File`, then select the HTML file
3. Adjust width and height (recommended: 1280 x 720)
4. Select **OK** to finish setup
5. Test the commands in your chat

---

## Credits

[RyanPython](https://twitch.tv/RyanPython) - Creation of this project

[berryspace](https://twitch.tv/berryspace) - Introducing the concept to Ryan & testing

[instafluff](https://www.twitch.tv/instafluff) - Creating ComfyJS (the library the bot is built on)
