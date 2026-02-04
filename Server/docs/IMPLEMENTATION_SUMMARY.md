# Waiting Time Estimation Feature - Implementation Summary

## ✅ Completed Implementation

### 1. Database Schema Updates

**File:** [queueSchema.js](c:\Projects\eBarangay\Server\models\queueSchema.js)

- Added `servingStartedAt` field to track when consultation begins
- Added `servedAt` field to track when consultation ends
- These timestamps enable accurate consultation duration calculations

### 2. Core Service Layer

**File:** [waitingTime.service.js](c:\Projects\eBarangay\Server\services\waitingTime.service.js)

- `getAverageConsultationTime()` - Calculates average consultation time from completed consultations in current monitoring session
- `getEstimatedWaitingTimes()` - Calculates estimated wait times for all patients in queue
- `getPatientWaitingTime()` - Gets estimated wait time for a specific patient
- `formatWaitingTime()` - Formats minutes into human-readable format

### 3. Controller Layer

**File:** [waitingTime.controller.js](c:\Projects\eBarangay\Server\controllers\waitingTime.controller.js)

- `getServiceWaitingTimes()` - API endpoint for service-wide waiting times
- `getPatientWaitingTime()` - API endpoint for individual patient waiting time
- `getAverageConsultationTime()` - API endpoint for average consultation time

### 4. Queue Operations Updates

**File:** [queue.service.js](c:\Projects\eBarangay\Server\services\queue.service.js)

- Modified `callNextInQueue()` to record `servingStartedAt` timestamp
- Modified `recallSkippedPatient()` to set `servingStartedAt` if not already set
- Modified `markAsServed()` to record `servedAt` timestamp

**File:** [queue.controller.js](c:\Projects\eBarangay\Server\controllers\queue.controller.js)

- Added waiting time update emissions in `joinQueue()`, `callNextInQueue()`, and `markAsServed()`

### 5. Real-Time Socket Notifications

**File:** [socketNotifications.js](c:\Projects\eBarangay\Server\utils\socketNotifications.js)

- Added `notifyWaitingTimeUpdate()` function
- Emits `waitingTimeUpdate` event to service monitoring room
- Emits `yourWaitingTime` event to individual patient queue rooms

**File:** [monitoring.controller.js](c:\Projects\eBarangay\Server\controllers\monitoring.controller.js)

- Added waiting time update emission when monitoring starts

### 6. API Routes

**File:** [waitingTime.routes.js](c:\Projects\eBarangay\Server\routes\waitingTime.routes.js)

- `GET /api/waiting-time/service/:serviceId` - Get all waiting times for a service
- `GET /api/waiting-time/patient/:queueId` - Get individual patient waiting time (authenticated)
- `GET /api/waiting-time/average/:serviceId` - Get average consultation time

**File:** [app.js](c:\Projects\eBarangay\Server\app.js)

- Registered waiting time routes in Express app

### 7. Documentation

**File:** [WAITING_TIME_API.md](c:\Projects\eBarangay\Server\docs\WAITING_TIME_API.md)

- Comprehensive API documentation with examples
- WebSocket event documentation
- Client integration examples
- Use case scenarios

## 🔄 How It Works

### Workflow:

1. **Admin starts monitoring** → System begins tracking consultation times
2. **Patient is called** → `servingStartedAt` is recorded
3. **Patient is marked as served** → `servedAt` is recorded, duration calculated
4. **Average is updated** → New average includes this consultation duration
5. **Estimates recalculated** → All waiting patients get updated estimates
6. **Socket notifications sent** → All connected clients receive real-time updates

### Example Calculation:

```
Service: Vaccination
Queue: 50 patients

First patient consultation: 6 minutes
- Average = 6 minutes
- Patient 2 estimate: 6 minutes
- Patient 3 estimate: 12 minutes
- Patient 50 estimate: 294 minutes

Second patient consultation: 4 minutes
- Average = (6 + 4) / 2 = 5 minutes
- Patient 3 estimate: 5 minutes
- Patient 4 estimate: 10 minutes
- Patient 50 estimate: 240 minutes
```

## 🎯 Key Features

1. **Dynamic Recalculation** - Estimates update with each completed consultation
2. **Real-Time Updates** - Socket.io broadcasts changes to all connected clients
3. **Session-Based** - Calculations reset when monitoring starts/stops or new day begins
4. **Default Fallback** - Uses 5-minute default when no consultation data exists
5. **Priority Support** - Respects Senior Citizen and PWD priority in position calculations
6. **Human-Readable Formatting** - Converts minutes to "X hours Y minutes" format

## 📡 Socket Events

### Events Emitted:

- `waitingTimeUpdate` → To service room when estimates change
- `yourWaitingTime` → To individual patient rooms with their estimate

### Events Triggered By:

- Monitoring starts
- Patient joins queue
- Patient is called (status → serving)
- Patient is marked as served (status → completed)

## 🔌 API Endpoints Summary

| Endpoint                               | Method | Access  | Description                     |
| -------------------------------------- | ------ | ------- | ------------------------------- |
| `/api/waiting-time/service/:serviceId` | GET    | Public  | All waiting times for service   |
| `/api/waiting-time/patient/:queueId`   | GET    | Private | Individual patient waiting time |
| `/api/waiting-time/average/:serviceId` | GET    | Public  | Average consultation time       |

## 🧪 Testing Recommendations

1. **Test monitoring flow:**
   - Start monitoring a service
   - Verify default 5-minute estimates
   - Call and serve patients
   - Verify estimates update based on actual durations

2. **Test socket connectivity:**
   - Connect multiple clients
   - Verify all receive updates simultaneously
   - Test room isolation (service-specific updates)

3. **Test edge cases:**
   - No patients in queue
   - Service not monitored
   - First consultation (no data yet)
   - Very long/short consultation times

4. **Test API endpoints:**
   - Valid service IDs
   - Invalid service IDs
   - Authenticated vs unauthenticated access

## 📝 Client Integration Steps

1. **Connect to Socket.io:**

   ```javascript
   const socket = io("http://your-server-url");
   ```

2. **Join appropriate rooms:**

   ```javascript
   // For admins monitoring
   socket.emit("joinServiceRoom", serviceId);

   // For patients in queue
   socket.emit("joinQueueRoom", queueCode);
   ```

3. **Listen for updates:**

   ```javascript
   socket.on("waitingTimeUpdate", (data) => {
     // Update admin dashboard
   });

   socket.on("yourWaitingTime", (data) => {
     // Update patient display
   });
   ```

4. **Fetch initial data:**
   ```javascript
   fetch(`/api/waiting-time/service/${serviceId}`)
     .then((res) => res.json())
     .then((data) => {
       // Display waiting times
     });
   ```

## ✨ Benefits

1. **Better Patient Experience** - Patients know how long they'll wait
2. **Reduced Anxiety** - Transparency builds trust
3. **Informed Decisions** - Patients can decide whether to wait or return later
4. **Staff Efficiency** - Admins can see consultation pace in real-time
5. **Data-Driven** - Based on actual consultation times, not guesses

## 🎉 Implementation Complete!

All components are in place and ready for testing. The system will automatically start tracking consultation times once an admin begins monitoring a service.
