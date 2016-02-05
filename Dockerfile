FROM haggen/node
RUN apt-get update && apt-get install -y --no-install-recommends unzip luarocks && rm -rf /var/lib/apt/lists/*
RUN luarocks install luacheck
WORKDIR /hubot
COPY . /hubot
RUN npm install
CMD ["/hubot/bin/hubot", "-a", "gitter2"]
