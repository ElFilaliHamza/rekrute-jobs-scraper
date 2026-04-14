# Specify the base Docker image.
FROM apify/actor-node-playwright-chrome:20 AS builder

# Copy just package.json and package-lock.json first
COPY package*.json ./

# Install NPM packages, keeping the image size small
RUN npm --quiet set progress=false \
    && npm install --omit=dev --omit=optional \
    && echo "Installed NPM packages:" \
    && (npm list --omit=dev --all || true) \
    && echo "Node.js version:" \
    && node --version \
    && echo "NPM version:" \
    && npm --version \
    && rm -r ~/.npm

# Copy the remaining files and directories
COPY . ./

# Run the image
CMD ./start_xvfb_and_run_cmd.sh && npm start --silent
