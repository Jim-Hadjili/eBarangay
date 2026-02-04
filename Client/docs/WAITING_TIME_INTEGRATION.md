# Client-Side Waiting Time Integration

## Overview

Successfully integrated real-time waiting time estimation display in the patient dashboard QueueCard component.

## Files Created/Modified

### 1. New Hook: `useWaitingTime.js`

**Location:** `Client/src/hooks/useWaitingTime.js`

**Features:**

- Fetches initial waiting time data from the API
- Establishes Socket.io connection for real-time updates
- Listens for `yourWaitingTime` event (personal updates)
- Listens for `waitingTimeUpdate` event (service-wide updates)
- Automatically joins/leaves queue rooms
- Handles loading and error states

**Parameters:**

- `queueId` - The patient's queue entry ID
- `serviceId` - The service being monitored
- `queueCode` - The patient's queue code (for socket room)

**Returns:**

```javascript
{
  waitingTimeData: {
    estimatedWaitingTime: number,          // Minutes
    estimatedWaitingTimeFormatted: string, // "X minutes" or "X hours Y minutes"
    position: number,                       // Position in queue
    averageConsultationTime: number,        // Average time per consultation
    isMonitored: boolean,                   // Is service being monitored?
    completedCount: number,                 // Number of completed consultations
    status: string                          // "waiting" or "serving"
  },
  loading: boolean,
  error: string | null
}
```

### 2. Updated Component: `QueueCard.jsx`

**Location:** `Client/src/components/patientDashboard/QueueCard.jsx`

**Changes Made:**

#### A. Added Waiting Time Hook

```javascript
const { waitingTimeData, loading: waitingTimeLoading } = useWaitingTime(
  userQueue?._id,
  userQueue?.serviceId,
  userQueue?.queueCode,
);
```

#### B. Updated "Est. Wait" Display

Replaced static "25 mins" with dynamic real-time data:

- Shows loading spinner while fetching
- Displays "Not monitored" if service isn't being monitored
- Shows "Now serving" if it's the patient's turn
- Displays estimated waiting time with average consultation time
- Shows "Calculating..." if no data is available yet

#### C. Added Detailed Waiting Time Information Card

New visual card that appears for waiting patients showing:

- **Large estimated waiting time display** - Prominently shows how long to wait
- **Position in queue** - Shows which number the patient is
- **Average consultation time** - Shows the average time per patient
- **Data reliability indicator** - Shows how many completed consultations the estimate is based on

**Visual Features:**

- Gradient blue background for visual appeal
- Clock icon for instant recognition
- Grid layout for organized information display
- Only shows when:
  - Patient is not on recall list
  - Service is being monitored
  - It's not the patient's turn yet
  - There's an actual estimated wait time

## How It Works

### 1. Initial Load

When a patient has an active queue:

1. `useWaitingTime` hook is initialized with queue details
2. Hook fetches initial waiting time from API: `GET /api/waiting-time/service/:serviceId`
3. Hook establishes Socket.io connection
4. Hook joins the patient's queue room for personal updates
5. Waiting time is displayed in the QueueCard

### 2. Real-Time Updates

The component receives automatic updates when:

**Via `yourWaitingTime` event (Personal):**

- A patient ahead is called (position changes)
- A patient is marked as served (wait time recalculates)
- Average consultation time changes

**Via `waitingTimeUpdate` event (Service-wide):**

- Monitoring starts
- New patient joins queue
- Patient is called or served
- Consultation completes (average updates)

### 3. Visual States

#### State 1: Loading

```
Est. Wait: [Spinner] Loading...
```

#### State 2: Not Monitored

```
Est. Wait: Not monitored
```

#### State 3: Currently Being Served

```
Est. Wait: ✓ Now serving
```

#### State 4: Waiting with Data

```
Est. Wait: 12 minutes
           ~6 min/patient

[Detailed Card showing:]
- Your estimated wait: 12 minutes
- Position in queue: #2
- Avg. consultation: ~6 min
- Based on 3 completed consultations
```

#### State 5: Calculating

```
Est. Wait: Calculating...
```

## Socket Events Flow

```
Client Side                          Server Side
    |                                     |
    |---(Join Queue Room)---------------->|
    |                                     |
    |<--(yourWaitingTime)-----------------|  [Personal update]
    |  { estimatedWaitingTime: 12,       |
    |    position: 2, ... }              |
    |                                     |
    |<--(waitingTimeUpdate)---------------|  [Service update]
    |  { waitingTimes: [...],            |
    |    averageConsultationTime: 6 }    |
    |                                     |
```

## Example User Experience

### Scenario: Patient Joins Vaccination Queue

**Step 1: Join Queue**

- Patient joins queue at position #5
- QueueCard immediately shows: "Calculating..." (no data yet)

**Step 2: Admin Starts Monitoring**

- Admin begins monitoring vaccination service
- Patient receives update via socket
- Display updates: "25 minutes" (5 positions × 5 min default)
- Detailed card appears showing position #5

**Step 3: First Patient Served (6 minutes)**

- Average updates to 6 minutes
- Patient's estimate updates: "24 minutes" (4 × 6)
- Position updates to #4
- Card shows: "Based on 1 completed consultation"

**Step 4: Second Patient Served (4 minutes)**

- Average updates to 5 minutes ((6+4)/2)
- Patient's estimate updates: "15 minutes" (3 × 5)
- Position updates to #3
- Card shows: "Based on 2 completed consultations"

**Step 5: Patient's Turn**

- Status changes to "Now serving"
- Est. Wait shows: "✓ Now serving"
- Detailed card disappears
- "IT'S YOUR TURN!" notification shows in main status area

## Benefits

### For Patients:

✅ **Transparency** - Know exactly how long they'll wait
✅ **Reduced Anxiety** - No uncertainty about wait times
✅ **Better Planning** - Can decide whether to wait or return later
✅ **Real-Time Updates** - Always have current information
✅ **Data Visibility** - See the basis for estimates (completed consultations)

### For the System:

✅ **Reduced Inquiries** - Fewer "how long?" questions
✅ **Better Queue Management** - Patients can make informed decisions
✅ **Improved Experience** - More modern, transparent service
✅ **Automatic Updates** - No manual refresh needed

## Technical Notes

### API Endpoint Used

```
GET /api/waiting-time/service/:serviceId
```

### Socket Events Listened

```javascript
socket.on('yourWaitingTime', (data) => {...})      // Personal updates
socket.on('waitingTimeUpdate', (data) => {...})    // Service updates
```

### Performance Considerations

- Socket connection is reused (one per component instance)
- Automatic cleanup on unmount (prevents memory leaks)
- Conditional rendering (card only shows when relevant)
- Efficient state updates (only when data changes)

### Error Handling

- Graceful degradation if API fails
- Shows "Not available" if service isn't monitored
- Handles missing data scenarios
- Logs errors to console for debugging

## Testing Recommendations

1. **Test with no monitoring:**
   - Verify "Not monitored" shows

2. **Test with monitoring:**
   - Join queue and verify initial estimate
   - Wait for consultations to complete
   - Verify estimates update automatically

3. **Test position changes:**
   - Verify position updates when patients are served
   - Check that estimate decreases as position improves

4. **Test "your turn" state:**
   - Verify detailed card disappears
   - Check "Now serving" shows correctly

5. **Test socket reconnection:**
   - Disconnect internet
   - Reconnect
   - Verify updates resume

## Future Enhancements

Possible improvements:

- Add notification when wait time drops significantly
- Show progress bar for estimated wait
- Add option to receive SMS when wait time is under X minutes
- Display historical wait time trends
- Show busiest times of day
