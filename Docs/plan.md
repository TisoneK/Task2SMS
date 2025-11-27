---
# Task2SMS
* Turn your tasks into timely SMS updates.*

## Overview
Task2SMS is a web-based automation tool that lets users create and manage tasks which automatically send SMS updates based on schedules or conditions. It aims to provide reliable, offline-capable notifications so users receive vital updates even with intermittent internet.

## Goal
Empower users to receive automated, condition-based SMS notifications for tasks, matches, or field activities — accessible anywhere, anytime, regardless of internet connectivity.

## Core Features

- Task creation: define task name, description, optional source link, recipients, and a schedule.
- Conditional notifications: rules like “if total > 140”, “if odds change”, or “always send”.
- Automated SMS delivery: send messages via SMS APIs or a local GSM modem.
- Online & offline operation: cloud-first with optional local fallback and offline queueing.

## Ideal users

- People in regions with unreliable internet
- Sports or betting analysts who want match updates via SMS
- Field workers needing SMS-based coordination
- Anyone needing automated reminders without smartphone dependency

## Core functionality

1. User task creation

	- Inputs: task name, description, optional link/source, update frequency (cron-like or human), notification conditions, and recipient phone number(s).

2. Update retrieval

	- Sources: public APIs (e.g., API‑Basketball), custom data feeds or scraping, and cached/local sources for offline behavior.

3. Notification logic

	- Evaluate task rules on schedule or when events occur. When a condition matches, generate and format an SMS message.

	- Example message:

	  Lakers 102 - Bulls 97

	  Full Time — Lakers win by 5.

4. SMS sending and delivery

	- Delivery channels: SMS provider APIs (Africa’s Talking, Twilio, Nexmo), or through a local GSM modem.
	- Offline queue: unsent messages are queued and retried when connectivity or modem access is available.

## Suggested architecture

| Component | Purpose | Technology examples |
|---|---|---|
| Frontend | Web dashboard for creating and managing tasks | React, Tailwind CSS |
| Backend | Business logic, rule evaluation, scheduling, API endpoints | Python (FastAPI or Flask) |
| Database | Persist tasks, rules, users, and delivery logs | PostgreSQL (or SQLite for single-node) |
| Notification service | Abstracts SMS providers and GSM modem access | Africa's Talking / Twilio SDKs, pySerial |
| Scheduler | Periodic and event-driven task checks | APScheduler or Celery |
| Hosting | 24/7 availability for cloud deployments | Render, Railway, DigitalOcean |

## Optional enhancements

- Offline-first mode: local cache + modem fallback, robust queueing and retries.
- Multi-user accounts and per-user dashboards.
- Smart rules engine: compound conditions and historical analytics (e.g., “notify if team loses two straight”).
- Integrate with analytics or prediction algorithms (e.g., Scorewise) to send personalized alerts.

## Example user flow

1. Create task

	- Task: Lakers vs Bulls
	- Frequency: every 1 hour
	- Condition: send score if total > 140
	- Phone: +2547XXXXXXX

2. System monitoring

	- Scheduler checks the data hourly or on update events.

3. Condition met → SMS sent

	- Example: Lakers vs Bulls total = 146 → send SMS: “Over line passed ✅”

4. Logs & status

	- Dashboard shows timestamped records with SMS content and delivery results.

## Next development steps

1. Create a system architecture diagram and database schema.
2. Build a backend prototype (task CRUD, scheduler, SMS adapter).
3. Implement a minimal frontend dashboard for task management.
4. Integrate an SMS provider (start with Africa’s Talking for Kenya) and a GSM modem adapter.
5. Deploy a proof-of-concept to a cloud host for continuous operation.
