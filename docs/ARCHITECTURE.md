# Real Estate AI Platform Architecture

## 1. System Overview

This platform is split into a `frontend` application built with Next.js 14 App Router and a `backend` API built with Express. PostgreSQL is the primary source of truth, Prisma manages schema and queries, Socket.io handles real-time messaging and notifications, Cloudinary stores property media, and Google Maps powers geolocation, map rendering, and proximity-driven search experiences.

### Frontend

- **Next.js 14 App Router** renders marketing pages, property discovery, dashboards, messaging, authentication flows, and admin experiences.
- **Tailwind CSS** provides a consistent design system for responsive UI components.
- **Axios + Zustand** support API access, client state, session hydration, and feature-specific stores.
- **Socket.io client** enables instant inbox updates, read receipts, and live conversation presence.
- **Google Maps API** supports map browsing, location autocomplete, property pins, and radius-based filtering.

### Backend

- **Express API** exposes REST endpoints for auth, listings, favorites, messages, reviews, uploads, and admin operations.
- **Prisma ORM** provides typed database access, migrations, and relational modeling.
- **JWT + bcryptjs** secure login and password handling.
- **Multer + Cloudinary** manage property image ingestion and remote media storage.
- **Socket.io** handles direct messaging events and real-time notification fanout.
- **Middleware layer** centralizes auth, validation, rate limiting, logging, and error handling.

### External Services

- **PostgreSQL** stores transactional data.
- **Cloudinary** stores listing images and transformed variants.
- **Google Maps API** enriches location search and visualization.

## 2. High-Level Request Flow

1. The user interacts with the Next.js frontend.
2. The frontend calls Express REST endpoints over HTTPS.
3. Authenticated requests include JWT bearer tokens.
4. Express validates input, authorizes access, and reads or writes via Prisma.
5. Image uploads are streamed to Cloudinary and URLs are stored in PostgreSQL.
6. Messaging and notification events are emitted through Socket.io.
7. The frontend subscribes to live events for conversation updates and activity badges.

## 3. Suggested Backend Component Responsibilities

- `src/controllers`: thin HTTP handlers that translate request/response logic.
- `src/services`: business logic for auth, listings, favorites, messaging, search analytics, and AI-powered recommendations.
- `src/middleware`: JWT auth, role guards, request validators, centralized error handlers, and upload handlers.
- `src/utils`: reusable helpers such as token creation, pagination parsing, and response shaping.
- `src/config`: environment loading, Prisma client, Cloudinary config, and app constants.
- `src/socket`: socket bootstrap, event registration, and room naming conventions.

## 4. API Endpoint Plan

Base URL: `/api`

### Auth

- `POST /auth/register` — create user account
- `POST /auth/login` — authenticate and issue JWT
- `POST /auth/refresh` — refresh session token
- `GET /auth/me` — fetch current user profile

### Users

- `GET /users/me` — get authenticated user details
- `PATCH /users/me` — update profile, phone, avatar
- `GET /users/:id` — public agent or owner profile
- `GET /users/:id/properties` — list properties owned by user

### Categories

- `GET /categories` — list all property categories
- `GET /categories/:slug` — get single category
- `POST /categories` — create category (admin)
- `PATCH /categories/:id` — update category (admin)
- `DELETE /categories/:id` — archive or delete category (admin)

### Properties

- `GET /properties` — paginated listing search with filters
- `GET /properties/map` — lightweight map markers with coordinates
- `GET /properties/recommendations` — personalized or AI-ranked results
- `GET /properties/:id` — property detail
- `POST /properties` — create property
- `PATCH /properties/:id` — update property
- `DELETE /properties/:id` — remove property
- `POST /properties/:id/view` — increment view analytics

### Favorites

- `GET /favorites` — list current user favorites
- `POST /favorites/:propertyId` — add property to favorites
- `DELETE /favorites/:propertyId` — remove favorite

### Messages

- `GET /messages/conversations` — list user conversations
- `GET /messages/property/:propertyId` — fetch conversation thread for one property
- `POST /messages` — send new message
- `PATCH /messages/:id/read` — mark message as read

### Search History

- `GET /search-history` — fetch saved search history
- `POST /search-history` — persist a new search query and filters
- `DELETE /search-history/:id` — remove one saved search
- `DELETE /search-history` — clear all history for current user

### Reviews

- `GET /reviews/property/:propertyId` — list property reviews
- `POST /reviews/property/:propertyId` — create review
- `PATCH /reviews/:id` — update own review
- `DELETE /reviews/:id` — delete own review or admin moderate

### Uploads

- `POST /uploads/property-images` — upload property images to Cloudinary
- `DELETE /uploads/property-images/:publicId` — remove image from Cloudinary

### Admin

- `GET /admin/dashboard` — aggregate platform KPIs
- `GET /admin/users` — manage users
- `GET /admin/properties` — moderate properties
- `PATCH /admin/properties/:id/status` — update listing status

## 5. Real-Time Event Plan

### Client-to-Server

- `join:user-room` — subscribe socket to a user-specific room
- `message:send` — emit new property inquiry or reply
- `message:read` — mark conversation items as read
- `typing:start` / `typing:stop` — optional typing indicators

### Server-to-Client

- `message:new` — new inbound message
- `message:read-updated` — read receipt sync
- `notification:new` — favorite, inquiry, or moderation alert
- `conversation:updated` — conversation list refresh trigger

## 6. Database Entity Relationships

- **User → Property**: one-to-many. A user can publish many properties.
- **Category → Property**: one-to-many. A category groups many properties.
- **User ↔ Property through Favorite**: many-to-many via join table with uniqueness on `(userId, propertyId)`.
- **User → Message**: one-to-many for sent messages and one-to-many for received messages.
- **Property → Message**: one-to-many to keep inquiries tied to a property.
- **User → SearchHistory**: one-to-many for personalization, analytics, and recommendations.
- **User → Review** and **Property → Review**: one-to-many with unique `(userId, propertyId)` to limit one review per user per property.

## 7. Security Approach

- Hash passwords with `bcryptjs` before storage.
- Sign short-lived JWT access tokens with secret rotation support.
- Add route-level auth middleware and admin role guards.
- Protect APIs with `helmet`, CORS restrictions, and rate limiting.
- Validate request payloads with `express-validator`.
- Store secrets only in environment variables.
- Restrict Cloudinary upload presets and validate file MIME types.
- Sanitize user-generated content before rendering in the UI.
- Use HTTPS in production and secure cookies if refresh tokens are introduced.
- Log auth and admin-sensitive actions for auditability.

## 8. Scalability Considerations

- Use stateless API containers so backend instances can scale horizontally behind a load balancer.
- Back Socket.io with a pub/sub adapter such as Redis when running multiple instances.
- Add PostgreSQL connection pooling and read replicas for search-heavy workloads.
- Move long-running AI enrichment, image processing, and recommendation generation into background jobs.
- Cache category lists, map marker responses, and popular search aggregates.
- Introduce full-text search or Elasticsearch/OpenSearch if property discovery outgrows basic relational filtering.
- Partition analytics or search-history data if write volume grows significantly.
- Serve Cloudinary transformations through CDN caching.
- Use database indexes on status, category, price, location, and creation date to keep listing queries performant.