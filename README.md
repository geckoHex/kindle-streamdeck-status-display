# 📖 Status Display – Setup & Usage

This project provides a simple **status display system** that works with a Stream Deck (or any HTTP client) to update a Kindle‑friendly webpage.  

## 🚀 How to Run

### 1. Configure Environment Variables
Create a `.env` file in the project root with the following parameters:

```env
PORT=3000
API_KEY=<your password here>
```

- `PORT` → the port your server will run on (default: 3000).  
- `API_KEY` → secret key required to update the status (used by Stream Deck or curl).  

### 2. Add Icons & Statuses
- Place your **SVG icons** in the `public/` folder.  
  Example:
  ```
  public/
  ├── open.svg
  ├── closed.svg
  └── busy.svg
  ```

- Define your statuses in `src/statuses.json`.  
  Example:
  ```json
  [
    { "status": "open", "icon": "/icons/open.svg", "label": "OPEN" },
    { "status": "closed", "icon": "/icons/closed.svg", "label": "CLOSED" },
    { "status": "busy", "icon": "/icons/busy.svg", "label": "BUSY" }
  ]
  ```

You can add or remove statuses here as needed. The server will only accept statuses defined in this file.

NOTE: The icons and statuses given as examples are already provided and ready to work out of the box.

### 3. Install Dependencies
From the project root, install required packages:

```bash
npm install
```

### 4. Start the Server
Run the server:

```bash
node src/server.js
```

If successful, you’ll see:

```
✅ Status Display running at http://localhost:3000
```

## 📡 API Usage

### Get Current Status (public)
```bash
curl http://localhost:3000/status
```

Response:
```json
{
  "status": "open",
  "icon": "/icons/open.svg",
  "label": "OPEN"
}
```

### Update Status (protected)
Requires the API key from `.env`.

```bash
curl -X POST http://localhost:3000/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your api password here>" \
  -d '{"status":"closed"}'
```

Response:
```json
{
  "success": true,
  "status": "closed"
}
```

## 📱 Kindle / Browser Display
Open in a browser (or Kindle browser):

```
http://localhost:3000/
```

- The page will show the current status with its icon and label.  
- It auto‑refreshes every 3 seconds using lightweight JavaScript.  

## 🎛 Stream Deck Integration
Configure a Stream Deck button to send an HTTP request:

- **URL**: `http://localhost:3000/status`  
- **Method**: `POST`  
- **Content Type**: `application/json`  
- **Headers**:  
  ```
  Authorization: Bearer <your api password here>
  ```
- **Body**:  
  ```json
  {"status":"closed"}
  ```

Repeat for other statuses (`open`, `busy`, etc.).

## 🌐 Hosting
If you want to deploy this, host it on another server, or view it on an actual Kindle you will need to update `localhost` to the proper base URL. Please also make sure to ensure your app's actual security if you "deploy" it.