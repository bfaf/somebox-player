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

# SSL certificates

### Generating

Generate them per [this instructions](https://stackoverflow.com/questions/46349459/chrome-neterr-cert-authority-invalid-error-on-self-signing-certificate-at-loca) which are copied below

```
#!/usr/bin/env bash
mkdir ~/ssl/
openssl genrsa -des3 -out ~/ssl/rootCA.key 2048
openssl req -x509 -new -nodes -key ~/ssl/rootCA.key -sha256 -days 1024 -out ~/ssl/rootCA.crt

sudo openssl req -new -sha256 -nodes -out domain.csr -newkey rsa:2048 -keyout domain.key -config <( cat san.cfn )

sudo openssl x509 -req -in domain.csr -CA ~/ssl/rootCA.crt -CAkey ~/ssl/rootCA.key -CAcreateserial -out domain.crt -days 500 -sha256 -extfile v3.ext
```

```
# san.cfn
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment

[req]
default_bits = 2048
distinguished_name = req_distinguished_name
req_extensions = req_ext
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName=BG
stateOrProvinceName=N/A
localityName=Sofia
organizationName=SomeBox Inc
emailAddress=kchonov@gmail.com
commonName = 192.168.1.9

[req_ext]
subjectAltName = @alt_names

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = 192.168.1.9
IP.2 = 127.0.0.1
DNS.1 = somebox.com
DNS.2 = localhost
```

```
# v3.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
IP.1 = 127.0.0.1
IP.2 = 192.168.1.9
DNS.1 = somebox.com
DNS.2 = localhost
```

Copy the files to `./nginx/ssl`

Create a text file named `pass` which contains the password used to create the certificates and put it in `./nginx/ssl`

### Importing

#### Windows
Import the rootCA.crt to `Trusted Root Certification Authorities` store in Windows.

To open the relevant window Follow these steps:
1. Open `Chrome`
2. Click the 3 dots at top right corner and select `Settings`
3. Click on `Privacy a& Security`
4. Click on `Security`
5. Scroll down to `Manage certificates` and click it
6. Click on `Manage imported certificates from Windows`
7. Click on `Trusted Root Certification Authorities` tab
8. Click on `Import`
9. Select the rootCA.crt and follow the instructions

#### Android

1. Copy the rootCA.crt on the device
2. 