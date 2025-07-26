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
