# Grab SuperApp Backend

This repository contains the Express based backend for the Grab SuperApp. It handles services such as taxi rides, food and mart orders, porter and medicine delivery. A flat 10% commission plus 18% GST is applied on every order. The API also provides endpoints for trending content including movies, activities and local news.

## Restaurant Module
Restaurants can register with FSSAI license and bank details. They manage menu items with pictures and receive socket notifications when customers place an order. Basic analytics and promotion management APIs are available along with a weekly payout calculation.

## Driver Cash Deposit
Bike and taxi riders can report daily cash deposits via the `/api/deposits` endpoint.

## Bike Rider Services
One rider account can perform multiple delivery options. The same bike driver may
accept food orders, deliver mart items, handle porter jobs and even provide a
bike taxi ride through the `/api/bike` routes.

## Taxi Driver Onboarding
Drivers registering for taxi service must provide additional vehicle details.
During registration they upload a profile photo and driving license number along
with the vehicle brand, model and plate number. This helps riders identify the
incoming cab and facilitates phone number exchange between passenger and driver.

## Application Settings
The `/api/settings` endpoint allows admins to manage global configuration for the app.
`GET /api/settings` fetches all settings while `POST /api/settings` creates or updates a value. Authentication as an admin is required to modify settings.

## Live Tracking
Drivers and customers can share their real-time location while an order or ride is active.

- **PUT `/api/users/location`** - update the logged in customer's coordinates.
- **PUT `/api/drivers/location`** - update the current driver's coordinates.
- **PUT `/api/bike/location`** - update the location of a bike rider.

WebSocket events `driver-location`, `bike-location` and the new `user-location` broadcast updates so both sides can track progress in the app.

## App APIs

The backend exposes dedicated routes for each module:

- **Driver App:** `/api/drivers` for driver registration, login and profile management.
- **Rider App:** `/api/bike` handles bike taxi rides and deliveries.
- **Restaurant App:** `/api/restaurants` manages menus and order status updates.
- **Porter App:** `/api/porter` allows customers to book porter deliveries.
- **Medicine App:** `/api/medicine` handles pharmacy orders.

Customers can request a cab using `/api/taxi`. After a ride is created the server emits a `taxi-request` event on the `/driver` socket namespace so available drivers know that a passenger is waiting. The same pattern is used for other services:
- `/api/bike` emits `bike-taxi-request`, `food-delivery-request`, `mart-delivery-request` and `porter-request` depending on the booking type.
- `/api/medicine` emits `medicine-delivery-request` when a pharmacy order is placed.

## User Registration

Create a new account using the `/api/users/register` endpoint. The request body must include `name`, `phone` and `password`. A valid email can also be provided but is optional.

```http
POST /api/users/register
{
  "name": "John Doe",
  "phone": "9876543210",
  "password": "strongPass1",
  "email": "john@example.com"
}
```

If any required field is missing the API responds with status `400` and a descriptive error message.

## Unified Authentication

Use `/api/auth/register` and `/api/auth/login` to handle accounts for users, drivers, riders and restaurants.

### Register Example
```http
POST /api/auth/register
{
  "type": "driver",
  "name": "Jane",
  "phone": "9000000000",
  "password": "secret",
  "vehicleType": "taxi",
  "vehicleNumber": "AB12CD3456",
  "licenseNumber": "DL1234567"
}
```

Set `type` to `user`, `driver`, `rider` or `restaurant` and include the relevant fields. The response returns a JWT token and the created record.

## Admin Dashboard

Admins can authenticate using the `/api/admin/login` endpoint. By default the credentials are taken from the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Example values are:

```
ADMIN_EMAIL=rakshitbargotra@gmail.com
ADMIN_PASSWORD=Rakshit@9858
```

After logging in, include the returned token as a Bearer token for all other admin routes. The dashboard statistics are available at `/api/admin/dashboard` and payouts can be managed via `/api/admin/payouts` and `/api/admin/payouts/run`.

## Refund Requests

Users can request a refund if an order is cancelled or an issue occurs. Submit a POST request to `/api/refunds` with the order ID and amount. Check request status at `/api/refunds/my`. Admins can process pending refunds via `/api/refunds/run` or wait for the hourly refund scheduler.


## Frontend Demo

The backend serves a small static frontend under the `/app` path. The landing page `/app/` lists each module with Grab-inspired styling. Available sections include:

- `/app/userapp/` – user registration
- `/app/driverapp/` – driver registration
- `/app/riderapp/` – rider registration
- `/app/restaurantapp/` – restaurant registration
- `/app/martapp/` – mart placeholder
- `/app/medicineapp/` – medicine store placeholder

All pages share `frontend/style.css`, which uses Grab's green color palette. Forms submit via JavaScript `fetch` requests to the backend API so you can test registrations directly.
