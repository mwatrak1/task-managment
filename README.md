## Task managment backend app
A Nestjs app for managing user's task list. Works with a PostgreSQL database that can be deployed as a Docker container using stack.yml file.

---

Consists of 2 services:
- tasks - CRUD operations on tasks - uses TypeORM to make working with db more efficient.
- auth - user authorization and authentication - leverages Passport.js using JWT Strategy to manage access.

---

Task API schema in Swagger:

```yaml
swagger: '2.0'
info:
  version: '1.0'
  title: task-managment
  description: API for managing user's tasks
host: virtserver.swaggerhub.com
basePath: /mwatrak1/task-managment/1.0
schemes:
 - https
consumes:
  - application/json
produces:
  - application/json
paths:
  /api/tasks:
    get:
      summary: List of all user's tasks with optional filters
      parameters:
        - name: status
          in: query
          description: Use to get tasks with specific status
          required: false
          type: string
        - name: query
          in: query
          description: Use to get tasks with specific title or description
          required: false
          type: string
      responses:
        "200":
          description: An array of tasks
          schema:
            $ref: '#/definitions/Task'
  
  /api/task:
    post:
      summary: Create a task
      parameters:
        - name: CreateTask
          in: body
          required: true
          schema:
            $ref: '#/definitions/CreateTask'
      responses:
        "200":
          description: Returns a newly created task
          schema:
            $ref: '#/definitions/Task'
  
  /api/task/{id}:
    get:
      summary: Returns a specific task
      parameters:
        - name: id
          in: path
          description: Use to specify a task
          required: true
          type: string
      responses:
        "200":
          description: A task
          schema:
            $ref: '#/definitions/Task'
    
    delete:
      summary: Delete a task with given id
      parameters:
        - name: id
          in: path
          description: Use to specify a task to be deleted
          required: true
          type: string
      responses:
        "200":
          description: Empty response
          
  /api/task/{id}/status:
    patch:
      summary: Updates task's status
      parameters:
        - name: id
          in: path
          description: Use to specify a task to be updated
          required: true
          type: string
        - name: status
          in: body
          description: Changes tasks's status to given status
          required: true
          schema:
            $ref: '#/definitions/UpdateTask'
      responses:
        "200":
          description: Updated task
          schema:
            $ref: '#/definitions/Task'
    
definitions:
  Task:
    type: object
    properties:
      id:
        type: string
      title:
        type: string
      description:
        type: string
      status:
        type: string
  
  CreateTask:
    type: object
    properties:
      title:
        type: string
      description:
        type: string
        
  UpdateTask:
    type: object
    properties:
      status:
        type: string

```
