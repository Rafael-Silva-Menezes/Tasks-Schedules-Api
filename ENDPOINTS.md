# Schedules and Tasks API

This API is designed to manage schedules with tasks.

## Schedules Endpoints

### Create a Schedule

- **Method:** POST
- **URL:** `/schedules`
- **Description:** Create a new schedule.
- **Request Body:**
  - `accountId` (string, required): The UUID of the account associated with the schedule.
  - `agentId` (string, optional): The UUID of the agent assigned to the schedule.
  - `endTime` (string, required): The end time of the schedule (format: 'YYYY-MM-DDTHH:MM:SSZ').
  - `startTime` (string, required): The start time of the schedule (format: 'YYYY-MM-DDTHH:MM:SSZ').
- **Response:** 201 Created

### Search Schedules

- **Method:** GET
- **URL:** `/schedules`
- **Description:** Retrieve a list of schedules.
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination.
  - `per_page` (number, optional): The number of schedules to return per page.
  - `sort` (string, optional): The field to sort the schedules by.
  - `filter` (string, optional): The filter to apply to the schedules.
- **Response:** 200 OK

### Get a Schedule

- **Method:** GET
- **URL:** `/schedules/{id}`
- **Description:** Retrieve a specific schedule by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the schedule.
- **Response:** 200 OK

### Update a Schedule

- **Method:** PATCH
- **URL:** `/schedules/{id}`
- **Description:** Update a specific schedule by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the schedule.
- **Request Body:**
  - `agentId` (string, optional): The UUID of the agent assigned to the schedule.
  - `endTime` (string, required): The end time of the schedule (format: 'YYYY-MM-DDTHH:MM:SSZ').
  - `startTime` (string, required): The start time of the schedule (format: 'YYYY-MM-DDTHH:MM:SSZ').
- **Response:** 200 OK

### Delete a Schedule

- **Method:** DELETE
- **URL:** `/schedules/{id}`
- **Description:** Delete a specific schedule by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the schedule.
- **Response:** 204 No Content

## Tasks Endpoints

### Create a Task

- **Method:** POST
- **URL:** `/tasks`
- **Description:** Create a new task.
- **Request Body:**
  - `accountId` (string, required): The UUID of the account associated with the task. This is the account of the task creator.
  - `duration` (number, required): The duration of the task in minutes.
  - `scheduleId` (string, required): The UUID of the schedule associated with the task. This is the schedule to which the task belongs.
  - `startTime` (string, required): The start time of the task (format: 'YYYY-MM-DDTHH:MM:SSZ').
  - `type` (string, required): The type of the task. It can only be "work" or "break".
- **Response:** 201 Created

### Search Tasks

- **Method:** GET
- **URL:** `/tasks`
- **Description:** Retrieve a list of tasks.
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination.
  - `per_page` (number, optional): The number of tasks to return per page.
  - `sort` (string, optional): The field to sort the tasks by.
  - `filter` (string, optional): The filter to apply to the tasks.
- **Response:** 200 OK

### Get a Task

- **Method:** GET
- **URL:** `/tasks/{id}`
- **Description:** Retrieve a specific task by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the task.
- **Response:** 200 OK

### Update a Task

- **Method:** PATCH
- **URL:** `/tasks/{id}`
- **Description:** Update a specific task by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the task.
- **Request Body:**
  - `duration` (number, required): The duration of the task in minutes.
  - `scheduleId` (string, required): The UUID of the schedule associated with the task.
  - `startTime` (string, required): The start time of the task (format: 'YYYY-MM-DDTHH:MM:SSZ').
  - `type` (string, required): The type of the task. It can only be "work" or "break".
- **Response:** 200 OK

### Delete a Task

- **Method:** DELETE
- **URL:** `/tasks/{id}`
- **Description:** Delete a specific task by its ID.
- **Path Parameter:**
  - `id` (string, required): The UUID of the task.
- **Response:** 204 No Content

This API provides endpoints to manage schedules with tasks. Feel free to reach out if you have any questions or need further clarification.
