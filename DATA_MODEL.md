# Data Model Documentation

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER MANAGEMENT                           │
├─────────────────────────────────────────────────────────────────┤
│  User (id, email, name, role, avatar, preferences)              │
│    ├─ Role: ADMIN | MANAGER | MEMBER                            │
│    └─ Has many: Projects, Tasks, Comments, TimeEntries, etc.    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PROJECT HIERARCHY                            │
├─────────────────────────────────────────────────────────────────┤
│  Project                                                         │
│    ├─ Properties: name, key, status, owner, dates               │
│    └─ Has many: Epics, Tasks                                    │
│          │                                                       │
│          ├─ Epic                                                 │
│          │   ├─ Properties: name, status, goals, dates          │
│          │   └─ Has many: Tasks                                 │
│          │                                                       │
│          └─ Task                                                 │
│              ├─ Properties: title, status, priority, estimates  │
│              ├─ Has parent: Task (for subtasks)                 │
│              ├─ Has many: Subtasks, Comments, TimeEntries       │
│              └─ Connected to: Tags, Watchers, Dependencies      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     TASK RELATIONSHIPS                           │
├─────────────────────────────────────────────────────────────────┤
│  Task                                                            │
│    ├─ Tags (many-to-many via TaskTag)                           │
│    ├─ Watchers (many-to-many via TaskWatcher)                   │
│    ├─ Dependencies (TaskDependency: blocks/blocked-by)          │
│    ├─ Comments (one-to-many)                                    │
│    ├─ Attachments (AttachmentLink: files/links)                 │
│    ├─ Time Entries (TimeEntry: work sessions)                   │
│    └─ Git Links (GitLink: commits/PRs/issues)                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      AUDIT & TRACKING                            │
├─────────────────────────────────────────────────────────────────┤
│  ActivityEvent (Immutable audit log)                            │
│    ├─ Tracks: All changes across all entities                   │
│    ├─ Polymorphic: References Project, Epic, Task, Comment, etc.│
│    ├─ Stores: before/after state, metadata, timestamp           │
│    └─ Event Types: 30+ event types for comprehensive tracking   │
│                                                                  │
│  TimeEntry (Work session tracking)                              │
│    ├─ Properties: hours, description, date                      │
│    └─ Links: Task, User                                         │
│                                                                  │
│  GitLink (Code artifact tracking)                               │
│    ├─ Types: Commit, PR, Issue, Branch                          │
│    ├─ Properties: url, sha, prNumber, status, mergedAt          │
│    └─ Links: Task                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      USER FEATURES                               │
├─────────────────────────────────────────────────────────────────┤
│  SavedFilter                                                     │
│    ├─ Properties: name, config (JSON), viewType, isPublic       │
│    └─ Allows: Saved searches, custom views                      │
│                                                                  │
│  Notification                                                    │
│    ├─ Types: Task assigned, commented, completed, due soon      │
│    └─ Properties: title, message, read status, entity link      │
└─────────────────────────────────────────────────────────────────┘
```

## Key Enums

### TaskStatus
- `TODO` - Not started
- `IN_PROGRESS` - Actively being worked on
- `IN_REVIEW` - Awaiting review/approval
- `BLOCKED` - Cannot proceed due to dependencies
- `DONE` - Completed successfully
- `CANCELLED` - Abandoned/no longer needed

### TaskPriority
- `LOW` - Nice to have
- `MEDIUM` - Standard priority
- `HIGH` - Important, should be done soon
- `URGENT` - Critical, needs immediate attention

### Role
- `ADMIN` - Full system access, user management
- `MANAGER` - Project/team management, all reports
- `MEMBER` - Basic access, own tasks only

### EventType (Selected)
- Project: `PROJECT_CREATED`, `PROJECT_UPDATED`, `PROJECT_STATUS_CHANGED`
- Epic: `EPIC_CREATED`, `EPIC_UPDATED`, `EPIC_STATUS_CHANGED`
- Task: `TASK_CREATED`, `TASK_UPDATED`, `TASK_STATUS_CHANGED`, `TASK_ASSIGNED`, `TASK_COMPLETED`
- Comments: `COMMENT_CREATED`, `COMMENT_UPDATED`
- Time: `TIME_ENTRY_CREATED`, `TIME_ENTRY_UPDATED`
- Git: `GIT_LINK_CREATED`, `GIT_PR_MERGED`
- Metadata: `TAG_ADDED`, `DEPENDENCY_CREATED`, `WATCHER_ADDED`

## Core Queries for Reporting

### Tasks Completed by User in Date Range
```prisma
prisma.task.findMany({
  where: {
    assigneeId: userId,
    completedAt: {
      gte: startDate,
      lte: endDate
    },
    status: 'DONE'
  },
  include: {
    project: true,
    epic: true,
    tags: { include: { tag: true } },
    timeEntries: true
  }
})
```

### Activity Timeline for User
```prisma
prisma.activityEvent.findMany({
  where: {
    userId: userId,
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  },
  include: {
    task: true,
    project: true
  },
  orderBy: { createdAt: 'desc' }
})
```

### Cycle Time Calculation
For each task: `completedAt - createdAt` (or `completedAt - startDate` if set)

### Throughput
Count of tasks completed per week/month in the date range

### Time Spent vs Estimated
```prisma
// Sum of timeEntries.hours vs task.estimateHours
const timeEntries = await prisma.timeEntry.aggregate({
  where: { taskId: task.id },
  _sum: { hours: true }
})
```

## Index Strategy

### High-Traffic Queries
- Task list by project: `@@index([projectId])`
- Task list by assignee: `@@index([assigneeId])`
- Task list by status: `@@index([status])`
- Activity feed: `@@index([createdAt])`, `@@index([userId])`

### Reporting Queries
- Tasks by completion date: `@@index([completedAt])`
- Time entries by date: `@@index([date])`
- Activity by date range: `@@index([createdAt])`

### Unique Constraints
- User email: `@unique`
- Project key: `@unique` (e.g., "PROJ", "TASK")
- Tag name: `@unique`
- Many-to-many joins: `@@id([taskId, tagId])`

## Design Decisions Explained

### 1. Why Separate Task and Subtask?
Self-referencing `Task.parentId` allows unlimited nesting depth while keeping a single entity type. Alternative would be separate `Subtask` model, but that complicates queries.

### 2. Why JSON for ActivityEvent metadata?
Flexibility to store different change types without schema changes. Examples:
```json
{
  "field": "status",
  "before": "TODO",
  "after": "DONE"
}
```

### 3. Why TaskWatcher join table instead of array?
Prisma/PostgreSQL best practice for many-to-many. Allows efficient queries and cascade deletes.

### 4. Why separate TimeEntry instead of calculated field?
Detailed work sessions needed for reporting. Users may log multiple entries per day with different descriptions.

### 5. Why nullable assigneeId?
Tasks can be created without assignment. Allows "backlog" of unassigned work.

### 6. Why both estimatePoints and estimateHours?
Teams use different methodologies. Some prefer story points (relative sizing), others prefer time-based estimates.

### 7. Why immutable ActivityEvent?
Audit compliance. Never update or delete events - always append new ones. Allows full history reconstruction.

### 8. Why cascade deletes?
When a project is deleted, all related data should be removed. ActivityEvents preserve the history even after deletion.

### 9. Why separate GitLink model?
Decouples Git integration from core task model. Easy to add/remove without schema changes to Task.

### 10. Why SavedFilter config as JSON?
Filter criteria vary widely (status, tags, date ranges, text search). JSON allows flexible storage without schema for each filter type.

## Performance Characteristics

### Expected Data Volume (1 year, 50 users)
- Users: 50
- Projects: 20
- Epics: 100
- Tasks: 5,000
- Comments: 10,000
- ActivityEvents: 50,000
- TimeEntries: 15,000

### Query Performance Targets
- Task list (paginated): < 100ms
- Task detail with relations: < 200ms
- Activity feed (1 month): < 300ms
- Report generation (6 months): < 5s

### Scaling Considerations
- ActivityEvent grows indefinitely - consider archiving after 2 years
- Indexes on all foreign keys and filter fields
- Pagination on all list queries (default 50 items)
- Consider read replicas for reporting queries at scale

## Migration Strategy

### Initial Setup
1. Run `prisma migrate dev --name init` to create initial schema
2. Run seed script to populate demo data
3. Verify with Prisma Studio

### Future Changes
1. Create migration: `prisma migrate dev --name descriptive_name`
2. Test migration on development database
3. Review generated SQL
4. Apply to production: `prisma migrate deploy`
5. Document breaking changes in MIGRATIONS.md

### Rollback Strategy
Prisma doesn't support automatic rollbacks. Strategy:
1. Keep database backups before major migrations
2. Write down migration for critical changes
3. Test migrations on staging environment
4. Have rollback SQL scripts ready

## Next Steps

Once approved, implementation will proceed in this order:

1. **Database Setup**: Docker Compose + Prisma migrations
2. **Seed Data**: Realistic demo dataset for testing
3. **API Layer**: Type-safe services using Prisma client
4. **UI Components**: Forms and views using the schema
5. **Activity Tracking**: Middleware to log all changes
6. **Reporting**: Aggregation queries for performance reports
