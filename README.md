# somebox-player
Player to view streamed videos from SomeBox Server

# Installation

Run `yarn` command

# Development

### Web
To start web development run the follofing command

`yarn web`

### Android
Start Android emulator from Android Studio

run the follofing command

`yarn android`

# Docker

To build the docker image run following command

`docker build -t somebox-web-player:latest .`

# Production

Run docker-compose command in the somebox-server repo

# Encoding videos
Videos must be encoded in mp4 with LCC audio format so they can be played by all platforms (Android and web)

If using MediaCoder first try to Copy the video and see whether the video runs smoothly in web browser

If there is no sound encode the audio with AC LCC codec
