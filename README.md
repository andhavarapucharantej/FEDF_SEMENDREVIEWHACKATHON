# TastyTongue — Indian Food Delivery UI

A responsive React + Vite front-end prototype for Indian regional food delivery. It includes customer and admin sign-in screens, regional restaurant listings, an ordering module, and an admin dashboard. Data is local mock content; sign-in is demo-only, and no backend, email service, payment gateway, or live courier dispatch service is connected. A wrong password for the in-memory demo account displays an in-app error; no security email is sent.

Prices are sample amounts in Indian rupees. Choose from Indian cities such as Vijayawada and Delhi to centre the map on an approximate city centre, or use Auto-detect to request a one-time browser GPS location. Sign-in requests location by default; uncheck the option on the login screen to skip it. Continuous GPS tracking remains available in the order map. GPS access requires permission and a secure context (HTTPS or localhost). Switch between Day and Night appearances using the home-page toggle or in Settings. The interactive street map uses OpenStreetMap tiles, so map requests may reveal the approximate map area to that provider. Each order displays a two-minute accelerated courier movement simulation, countdown, and progress indicator. The route and ETA are demo-only, not a real courier location or delivery estimate; live tracking requires a connected courier GPS feed.

## Open the website on Windows

Double-click `start-website.bat`. It installs dependencies if needed, opens the website in your default browser, and keeps the Vite server running in its terminal window. Close that terminal to stop the site.

You can also run it manually: install Node.js (with npm), run `npm install`, then run `npm run dev`.

Use any email and password to enter the prototype. New customers can create an account with their name, Indian mobile number, email, and password, then verify a demo OTP shown in the browser. Duplicate demo registrations are checked against email addresses stored in the current tab session; passwords and demo credentials remain in memory only. Forgot-password also has a browser-only demo OTP and password reset; codes are not emailed. GPS requires browser permission. Favourite restaurants are available from the sidebar for the current browser session. Profile and settings screens are available in the sidebar. Order contact and chat are simulated locally; no real delivery partner is contacted. The email you enter is shown in the profile and admin dashboard. Use the **View as** selector in the top bar to switch between customer and admin interfaces.
Restaurant details include a 1–5 star rating and optional review note. Submitted ratings update the displayed restaurant score for the current browser session only; they are not sent to a service or persisted after closing the page.

Each restaurant menu has Veg, Non-Veg, and Desserts filters with at least six sample dishes per mode. Checkout supports cash on delivery and demo selections for PhonePe, Google Pay, Paytm/other UPI, card, and QR. Coupons include `WELCOME50`, `TASTY10`, and `BIRTHDAY15`. Online payment and QR are not connected to a merchant or payment gateway; no payment is charged. The initial theme follows the device's local time: Day from 6:00 AM to 5:59 PM, Night otherwise. A one-click theme toggle remains available in the header and Settings.

## Modules

The UI is split into reusable React components under `src/modules/`, with a stylesheet alongside each component:

- `LoginModule` handles demo sign-in.
- `UserModule` shows restaurant discovery and filters.
- `RatingModule` collects accessible 1–5 star restaurant ratings and optional session-only review notes.
- `AdminModule` provides the marketplace dashboard, fictional demo owner/contact details, and shared restaurant ratings/reviews, listing status, menu prices, and item availability for the current session. Demo contact numbers are invalid placeholders and do not reach real people.
- `LocationPickerModule` handles city selection, GPS refresh, and access to the interactive delivery-area map in `LocationMapModule`.
- `CartModule` manages cart quantities and checkout, blocking checkout if an item is paused by the admin.
- `PaymentModule` offers COD, UPI/card demo selections, coupon discounts, and a birthday promotion; real payment processing requires a connected gateway.
- `MyOrdersModule` shows separately saved orders from the current browser session.
- `TrackingMap` displays interactive OpenStreetMap tiles, animated demo courier movement, and a countdown/progress indicator.
- `OrderTelemetryModule` provides a draggable 3D cube with local order counts on the customer home page and admin dashboard; it is a visual demo, not an external live feed.
- `DeliveryContactModule` shows a demo contact panel and scripted local AI replies for order status, ETA, payment, and coupons.
- `ProfileModule` and `SettingsModule` manage session-only profile details and preferences.

`src/App.jsx` coordinates shared state, `src/data/catalog.js` contains sample restaurant/menu data, and `src/data/indianCities.js` contains city-centre coordinates. Cart and order history are separate views; placing an order adds it to **My orders** and opens the map.
