# Event Reminder System - Setup Guide

This document explains how the event reminder system works and how to configure it.

## Overview

The system automatically sends email notifications to all active gym members **one day before** any special event or holiday that you create in the Schedule Management section.

## Features

- 📅 **Automatic Reminders**: Sends emails to all members the day before an event
- ⏰ **Configurable Time**: Set the exact time when reminders should be sent
- 🌍 **Timezone Support**: Configure timezone for accurate scheduling
- 📧 **Beautiful Emails**: Professional HTML email templates with event details
- 🎯 **Smart Tracking**: Prevents duplicate notifications for the same event
- 🔔 **Event Types**: Support for holidays, special hours, closures, and events

## How It Works

1. **Create Special Date**: Admin creates a special date/holiday in the Schedule Management page
2. **Database Storage**: The event is saved to MongoDB with all details
3. **Cron Job**: A background task checks daily for upcoming events
4. **Email Notification**: If an event is tomorrow, emails are sent to all active members
5. **Tracking**: Event is marked as "notified" to prevent duplicate emails

## Configuration

All settings are in the `.env` file:

### Enable/Disable Reminders

```env
ENABLE_EVENT_REMINDERS=true
```

Set to `false` to disable event reminders completely.

### Set Email Send Time

```env
EVENT_REMINDER_CRON=0 14 * * *
```

The cron format is: `minute hour day month dayOfWeek`

**Common Examples:**

- `0 14 * * *` - Every day at 2:00 PM (default)
- `0 18 * * *` - Every day at 6:00 PM
- `30 15 * * *` - Every day at 3:30 PM
- `0 12 * * 1-5` - Weekdays at 12:00 PM
- `0 9 * * *` - Every day at 9:00 AM

### Set Timezone

```env
CRON_TIMEZONE=Asia/Kolkata
```

**Common Timezones:**

- `Asia/Kolkata` - India Standard Time
- `America/New_York` - US Eastern Time
- `Europe/London` - UK Time
- `Asia/Dubai` - UAE Time
- `Australia/Sydney` - Australian Eastern Time

## How to Use

### Step 1: Create a Special Date/Holiday

1. Go to **Schedule Management** page
2. Click **"Add Special Date"** button
3. Fill in the details:

   - **Date**: Select the event date
   - **Reason**: e.g., "Christmas Holiday", "Diwali Celebration"
   - **Event Type**: Holiday, Special Hours, Closed, or Event
   - **Open/Closed**: Check if gym is open
   - **Hours**: Set special hours if gym is open

4. Click **"Add Date"**
5. Click **"Save Schedule"**

### Step 2: Automatic Email

The system will automatically:

- Check every day at the configured time
- Find events happening tomorrow
- Send beautiful email notifications to all active members
- Mark the event as "notified" to prevent duplicates

## Email Content

Members receive a professional email with:

- Event name and reason
- Event date (formatted)
- Gym status (Open/Closed/24 Hours)
- Operating hours (if modified)
- Important notices
- FLAMEBOX branding

## Database Structure

### Schedule Model

```javascript
{
  weeklySchedule: [
    { day: 'Monday', open: true, startTime: '06:00', endTime: '22:00' }
  ],
  specialDates: [
    {
      date: Date,
      reason: String,
      open: Boolean,
      is24Hours: Boolean,
      startTime: String,
      endTime: String,
      eventType: 'holiday' | 'special_hours' | 'closed' | 'event',
      notificationSent: Boolean,
      notificationSentDate: Date
    }
  ]
}
```

## API Endpoints

- `GET /api/admin/schedule` - Get schedule
- `PUT /api/admin/schedule` - Update schedule
- `POST /api/admin/schedule/special-date` - Add special date
- `DELETE /api/admin/schedule/special-date/:id` - Delete special date
- `GET /api/admin/schedule/upcoming-events` - Get upcoming events

## Cron Job Details

**File**: `server/cron/eventReminders.js`

The cron job runs at the scheduled time and:

1. Queries the database for events happening tomorrow
2. Filters out events that already received notifications
3. Gets all active members with email addresses
4. Sends personalized emails to each member
5. Marks events as notified
6. Logs success/failure counts

## Manual Testing

You can manually trigger reminders (for testing):

```javascript
const { triggerEventReminders } = require("./cron/eventReminders");
await triggerEventReminders();
```

## Troubleshooting

### Emails Not Sending?

1. **Check .env settings**: Ensure `ENABLE_EVENT_REMINDERS=true`
2. **Check cron schedule**: Verify `EVENT_REMINDER_CRON` is correct
3. **Check timezone**: Ensure `CRON_TIMEZONE` matches your location
4. **Check server logs**: Look for "Event reminder cron job triggered"
5. **Check member emails**: Ensure members have valid email addresses

### Wrong Time Zone?

Update `CRON_TIMEZONE` in `.env` and restart server:

```bash
cd server
npm run dev
```

### Need Different Send Time?

Update `EVENT_REMINDER_CRON` in `.env`:

```env
# Example: Send at 6 PM instead of 2 PM
EVENT_REMINDER_CRON=0 18 * * *
```

Restart the server for changes to take effect.

## Email Template Customization

Email templates are in: `server/helpers/email.js`

Look for the `sendEventReminderEmail` function to customize:

- Email design
- Content
- Colors
- Layout
- Branding

## Security Notes

- Only authenticated admin users can create special dates
- Email addresses are not exposed in logs
- Failed email sends are caught and logged
- Database changes are atomic

## Performance

- Cron job runs once per day (minimal resource usage)
- Emails sent in batches efficiently
- No impact on regular gym operations
- Scales to thousands of members

## Support

For issues or questions:

- Check server logs for errors
- Verify database connectivity
- Ensure email service is configured
- Check member data has valid emails

---

**Created**: December 2024
**System**: FLAMEBOX Gym Management
**Feature**: Event Reminder Automation
