# Create image based on the official Node LTS image from dockerhub
FROM node:10-alpine

# For bcryptjs
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

# Installs latest Chromium (72) package.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      chromium@edge=72.0.3626.121-r0 \
      nss@edge \
      freetype@edge \
      harfbuzz@edge \
      ttf-freefont@edge

# Create a directory where our app will be placed
RUN mkdir -p /app

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Puppeteer v1.11.0 works with Chromium 72.
RUN yarn add puppeteer@1.11.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser



# Change directory so that our commands run inside this new dir
WORKDIR /app

# Copy dependency definitions
COPY package.json /app


# Get all the code needed to run the app
COPY . /app


# Install dependecies
RUN npm install

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["npm", "start"]