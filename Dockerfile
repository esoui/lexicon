FROM haggen/node
RUN apt-get update && apt-get install -y --no-install-recommends luarocks && rm -rf /var/lib/apt/lists/*
RUN luarocks install luacheck
CMD ["bin/hubot", "-a", "gitter2"]
