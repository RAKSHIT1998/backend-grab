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

