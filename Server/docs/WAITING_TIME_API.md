# Waiting Time Estimation API

## Overview

The Waiting Time Estimation API provides real-time estimated waiting times for patients in queue based on actual consultation durations during the current monitoring session. The system dynamically recalculates waiting times as consultations are completed.

## How It Works

### 1. **Monitoring Session**

- An admin must start monitoring a service for waiting time calculations to begin
- The monitoring session starts when an admin calls `POST /api/monitoring/start`
- All consultation time tracking begins from this moment

### 2. **Consultation Time Tracking**

- When a patient is called (status changes to "serving"), the system records `servingStartedAt`
- When a patient is marked as served (status changes to "completed"), the system records `servedAt`
- Consultation duration = `servedAt - servingStartedAt`

### 3. **Average Calculation**

- The system calculates the average consultation time from all completed consultations in the current monitoring session
- Formula: `Average = Sum of all consultation durations / Number of completed consultations`

### 4. **Waiting Time Estimation**

- For the first consultation (no data yet), the system uses a default estimate of 5 minutes
- Once consultation data is available, the system uses the actual average
- Each patient's estimated wait time = (Their position in queue - 1) × Average consultation time

### 5. **Dynamic Updates**

- Every time a patient is marked as served, the average is recalculated
- All waiting patients receive updated estimates via WebSocket
- If consultations finish faster/slower, the estimates adjust accordingly

## API Endpoints

### 1. Get Service Waiting Times

**Endpoint:** `GET /api/waiting-time/service/:serviceId`

**Description:** Get estimated waiting times for all patients in a service queue

**Access:** Public

**Parameters:**

- `serviceId` (path parameter) - The ID of the service

**Response Example:**

```json
{
  "isMonitored": true,
  "averageConsultationTime": 6.5,
  "completedCount": 10,
  "serviceName": "Vaccination",
  "serviceIdentifier": "VAC",
  "waitingTimes": [
    {
      "queueId": "507f1f77bcf86cd799439011",
      "queueCode": "VAC-001",
      "queueNumber": 1,
      "patientName": "John Doe",
      "estimatedWaitingTime": 0,
      "estimatedWaitingTimeFormatted": "Currently being served",
      "position": 0,
      "status": "serving"
    },
    {
      "queueId": "507f1f77bcf86cd799439012",
      "queueCode": "VAC-002",
      "queueNumber": 2,
      "patientName": "Jane Smith",
      "estimatedWaitingTime": 7,
      "estimatedWaitingTimeFormatted": "7 minutes",
      "position": 1,
      "status": "waiting"
    },
    {
      "queueId": "507f1f77bcf86cd799439013",
      "queueCode": "VAC-003",
      "queueNumber": 3,
      "patientName": "Bob Johnson",
      "estimatedWaitingTime": 13,
      "estimatedWaitingTimeFormatted": "13 minutes",
      "position": 2,
      "status": "waiting"
    }
  ]
}
```

**Response (Service Not Monitored):**

```json
{
  "isMonitored": false,
  "message": "Service is not currently being monitored",
  "waitingTimes": []
}
```

---

### 2. Get Patient Waiting Time

**Endpoint:** `GET /api/waiting-time/patient/:queueId`

**Description:** Get estimated waiting time for a specific patient

**Access:** Private (requires authentication)

**Headers:**

```
Authorization: Bearer <token>
```

**Parameters:**

- `queueId` (path parameter) - The ID of the queue entry

**Response Example:**

```json
{
  "isMonitored": true,
  "queueCode": "VAC-002",
  "queueNumber": 2,
  "serviceName": "Vaccination",
  "queueId": "507f1f77bcf86cd799439012",
  "patientName": "Jane Smith",
  "estimatedWaitingTime": 7,
  "estimatedWaitingTimeFormatted": "7 minutes",
  "position": 1,
  "status": "waiting",
  "averageConsultationTime": 6.5,
  "completedConsultations": 10
}
```

---

### 3. Get Average Consultation Time

**Endpoint:** `GET /api/waiting-time/average/:serviceId`

**Description:** Get the average consultation time for a service during the current monitoring session

**Access:** Public

**Parameters:**

- `serviceId` (path parameter) - The ID of the service

**Response Example:**

```json
{
  "averageConsultationTime": 6.5,
  "completedCount": 10
}
```

**Response (No Data Yet):**

```json
{
  "averageConsultationTime": null,
  "completedCount": 0
}
```

---

## WebSocket Events

The system emits real-time updates via Socket.io when waiting times change.

### Events Emitted:

#### 1. `waitingTimeUpdate`

Emitted to the service monitoring room whenever waiting times are recalculated.

**Room:** `service-{serviceId}`

**Payload:**

```json
{
  "isMonitored": true,
  "averageConsultationTime": 6.5,
  "completedCount": 10,
  "serviceName": "Vaccination",
  "serviceIdentifier": "VAC",
  "waitingTimes": [
    /* array of waiting times */
  ]
}
```

#### 2. `yourWaitingTime`

Emitted to individual patients in their queue room.

**Room:** `{queueCode}` (e.g., "VAC-002")

**Payload:**

```json
{
  "estimatedWaitingTime": 7,
  "estimatedWaitingTimeFormatted": "7 minutes",
  "position": 1,
  "averageConsultationTime": 6.5
}
```

### When Updates are Triggered:

1. **When monitoring starts** - Initial waiting time estimates are sent
2. **When a patient joins the queue** - All waiting times are recalculated
3. **When a patient is called** - Position updates for remaining patients
4. **When a patient is marked as served** - Average consultation time is recalculated and all waiting times are updated

---

## Client Integration Examples

### 1. Connect to Socket.io

```javascript
import io from "socket.io-client";

const socket = io("http://your-server-url");

// Join service monitoring room (for admins)
socket.emit("joinServiceRoom", serviceId);

// Join patient queue room (for patients)
socket.emit("joinQueueRoom", queueCode);
```

### 2. Listen for Waiting Time Updates

```javascript
// For service monitoring (admin view)
socket.on("waitingTimeUpdate", (data) => {
  console.log("Average consultation time:", data.averageConsultationTime);
  console.log("Waiting times:", data.waitingTimes);
  // Update UI with new waiting times
});

// For individual patient
socket.on("yourWaitingTime", (data) => {
  console.log("Your estimated wait:", data.estimatedWaitingTimeFormatted);
  console.log("Your position:", data.position);
  // Update patient UI
});
```

### 3. Fetch Current Waiting Times

```javascript
// Get all waiting times for a service
async function getServiceWaitingTimes(serviceId) {
  const response = await fetch(`/api/waiting-time/service/${serviceId}`);
  const data = await response.json();
  return data;
}

// Get specific patient's waiting time
async function getMyWaitingTime(queueId, token) {
  const response = await fetch(`/api/waiting-time/patient/${queueId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}
```

---

## Example Use Case

### Scenario: Vaccination Service with 50 Patients

1. **Admin starts monitoring** at 9:00 AM
   - Initial estimates use default 5 minutes per patient
   - Patient 1: Currently being served
   - Patient 2: ~5 minutes
   - Patient 3: ~10 minutes
   - Patient 50: ~245 minutes (~4 hours)

2. **First patient completes** at 9:06 AM (6-minute consultation)
   - Average updates to 6 minutes
   - Patient 2 is now being served
   - Patient 3: ~6 minutes
   - Patient 4: ~12 minutes
   - Patient 50: ~288 minutes (~4.8 hours)

3. **Second patient completes** at 9:10 AM (4-minute consultation)
   - Average updates to 5 minutes ((6+4)/2)
   - Patient 3 is now being served
   - Patient 4: ~5 minutes
   - Patient 5: ~10 minutes
   - Patient 50: ~235 minutes (~3.9 hours)

4. **Pattern continues** - estimates become more accurate with more data

---

## Important Notes

1. **Monitoring Required**: Waiting time calculations only work when a service is actively being monitored by an admin

2. **Session-Based**: Consultation time tracking resets when:
   - Monitoring is stopped and restarted
   - A new day begins (session starts at midnight)

3. **Default Estimate**: If no consultation data is available yet, the system uses a default estimate of 5 minutes per patient

4. **Priority Queue**: The system respects priority status (Senior Citizens, PWD) when calculating positions

5. **Real-Time Updates**: All connected clients receive automatic updates when:
   - A new patient joins the queue
   - A patient is called
   - A patient is marked as served
   - The average consultation time changes

6. **Database Schema**: The system tracks:
   - `servingStartedAt`: When patient starts being served
   - `servedAt`: When patient is marked as completed
   - Duration is calculated as the difference between these timestamps

---

## Error Handling

### Common Errors:

**Service Not Found (404)**

```json
{
  "message": "Service not found"
}
```

**Queue Not Found (404)**

```json
{
  "message": "Queue entry not found"
}
```

**Service Not Monitored**

```json
{
  "isMonitored": false,
  "message": "Service is not currently being monitored"
}
```

**Queue No Longer Active**

```json
{
  "message": "Queue is no longer active",
  "status": "completed"
}
```

---

## Testing the API

### Using cURL:

```bash
# Get service waiting times
curl http://localhost:5000/api/waiting-time/service/507f1f77bcf86cd799439011

# Get patient waiting time (with authentication)
curl http://localhost:5000/api/waiting-time/patient/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get average consultation time
curl http://localhost:5000/api/waiting-time/average/507f1f77bcf86cd799439011
```

### Using Postman:

1. Import the endpoints as a new collection
2. Set up authentication token in the Authorization tab for patient endpoints
3. Test the WebSocket events using Postman's WebSocket feature

---

## Performance Considerations

- Waiting time calculations are efficient (O(n) where n = number of waiting patients)
- Socket.io rooms minimize broadcast overhead
- Database queries are optimized with proper indexing on:
  - `service` field
  - `status` field
  - `servingStartedAt` and `servedAt` fields
  - `date` field for session-based queries
