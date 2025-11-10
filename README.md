# microservices_posts

A small demo microservices project that implements a posts/comments system using an event-driven architecture.

This repository contains several lightweight services used for a basic microservices course:

- `posts/` - service that creates and stores posts.
- `comments/` - service that stores comments for posts and communicates via events.
- `event-bus/` - simple event bus used to forward events between services.
- `Query/` - service that builds a combined view (posts + comments) for querying.
- `blog/client/` - a Next.js client that consumes the query service and provides a UI.

Quick start

1. Open a terminal for each service (or use a process manager like `tmux` / `concurrently`).
2. From the repo root, install dependencies and start each service as shown below.

Example commands (run inside each service directory):

```
# Install dependencies
npm install

# Start the service
node index.js
```

Ports (defaults used in this project)

- `posts` : 4000
- `comments` : 4001
- `event-bus` : 4005
- `Query` : 4002
- `blog` (Next.js client) : 3000

Notes

- The services communicate via the `event-bus` which receives and broadcasts events.
- The `Query` service listens to events and builds a read model that combines posts with their comments.
- The `blog/client` UI queries the `Query` service to display posts and comments and to create new content.

Adding content

- Use the Next.js UI to create posts and comments, or call the appropriate service endpoints directly (e.g., `POST /posts` and `POST /posts/:id/comments`).

License
This project is provided for educational purposes.
