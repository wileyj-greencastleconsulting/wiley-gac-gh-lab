# Task Management & Performance Reporting System - Project Plan

## Executive Summary

Building a professional task management application with comprehensive activity tracking and performance reporting capabilities. The system will support Projects → Epics → Tasks hierarchy with multiple views, power-user features, and semi-annual performance report generation.

## Architecture Rationale

### Tech Stack
- **Frontend/Backend**: Next.js 14+ (App Router) - Unified full-stack framework, excellent DX, optimized for performance
- **Language**: TypeScript - Type safety across the entire stack
- **Styling**: Tailwind CSS + shadcn/ui - Professional, accessible components with minimal custom CSS
- **Database**: PostgreSQL - Robust, ACID-compliant, excellent for relational data and reporting
- **ORM**: Prisma - Type-safe queries, excellent migrations, great DX
- **Auth**: NextAuth.js v5 - Industry standard, extensible, supports multiple providers
- **Testing**: Vitest (unit/integration) + Playwright (e2e) - Fast, modern testing tools
- **Dev Environment**: Docker Compose - Consistent local development

### Why Next.js App Router (vs Separate Backend)?
1. **Simplicity**: Single deployment, unified codebase
2. **Performance**: Server components, streaming, optimistic updates
3. **DX**: Shared types, co-located routes and components
4. **Scalability**: Easy to extract API routes to separate service later if needed
5. **Cost**: Single hosting environment

### Architecture Principles
1. **Domain-Driven Design**: Clear separation of concerns (domain models, services, repositories)
2. **Server-First**: Leverage server components for data fetching, minimize client-side JavaScript
3. **Type Safety**: End-to-end TypeScript, Prisma generates types from schema
4. **Audit Trail**: Immutable ActivityEvent log for all changes
5. **RBAC**: Role-based access control at data and UI levels
6. **Progressive Enhancement**: Works without JavaScript where possible

## Data Model Overview

### Core Entities
- **User**: Authentication, profile, role
- **Project**: Top-level organization unit
- **Epic**: Groups of related tasks within a project
- **Task**: Core work item with full metadata
- **Comment**: Discussions on tasks
- **Tag**: Flexible categorization
- **Dependency**: Task relationships (blocks/blocked-by)
- **AttachmentLink**: External resources, files
- **ActivityEvent**: Immutable audit log
- **TimeEntry**: Work session tracking
- **GitLink**: Link to commits/PRs/issues
- **SavedFilter**: User's saved views/searches
- **Notification**: User notifications

### Key Relationships
```
Project (1:N) Epic (1:N) Task (1:N) Task (subtasks)
Task (N:M) Tag
Task (N:M) User (assignees, watchers)
Task (1:N) Comment
Task (1:N) AttachmentLink
Task (1:N) TimeEntry
Task (1:N) GitLink
Task (N:M) Task (dependencies)
All entities → ActivityEvent (polymorphic)
```

## Implementation Milestones

### Milestone 1: Foundation (Day 1)
**Goal**: Project scaffolding, database, basic auth
- [x] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Prisma with PostgreSQL
- [ ] Docker Compose for local dev
- [ ] Basic NextAuth setup (email/password)
- [ ] ESLint + Prettier configuration
- [ ] README with setup instructions

**Deliverable**: `npm run dev` starts authenticated app

### Milestone 2: Core Domain (Day 2-3)
**Goal**: CRUD operations for main entities
- [ ] Prisma schema finalization
- [ ] Database migrations
- [ ] Seed data with demo dataset
- [ ] API routes: Projects, Epics, Tasks
- [ ] Server actions for mutations
- [ ] Basic error handling and validation (Zod schemas)
- [ ] RBAC middleware

**Deliverable**: API endpoints functional, testable via Postman/curl

### Milestone 3: UI Foundation (Day 3-4)
**Goal**: Component library and layouts
- [ ] shadcn/ui installation and configuration
- [ ] Layout components (Shell, Sidebar, Header)
- [ ] Dark/light mode toggle
- [ ] Form components (TaskForm, ProjectForm)
- [ ] Empty states and loading skeletons
- [ ] Toast notifications
- [ ] Error boundaries

**Deliverable**: Professional UI shell with theming

### Milestone 4: Task Management Views (Day 4-5)
**Goal**: Core task interaction views
- [ ] Dashboard: "My Work" with stats
- [ ] Project list and detail pages
- [ ] Task list view with filtering/sorting
- [ ] Kanban board (drag-and-drop)
- [ ] Task detail modal/page
- [ ] Task creation/editing forms
- [ ] Comment system
- [ ] Tag management

**Deliverable**: Users can create and manage tasks in multiple views

### Milestone 5: Activity Tracking (Day 5-6)
**Goal**: Comprehensive audit trail
- [ ] ActivityEvent service layer
- [ ] Automatic event creation on:
  - Task create/update/delete
  - Status changes
  - Assignment changes
  - Comments
  - Time entries
- [ ] Activity feed component
- [ ] Activity filtering and pagination
- [ ] User activity timeline

**Deliverable**: All changes tracked and visible

### Milestone 6: Power User Features (Day 6-7)
**Goal**: Advanced functionality for technical users
- [ ] Advanced search/filter UI
- [ ] Saved filters/views
- [ ] Bulk operations (select multiple, bulk edit)
- [ ] Command palette (Cmd+K)
- [ ] Keyboard shortcuts (?, j/k navigation, etc.)
- [ ] Quick actions menu
- [ ] Task dependencies UI

**Deliverable**: Power users can work efficiently

### Milestone 7: Performance Reporting (Day 7-8)
**Goal**: Semi-annual report generation
- [ ] Report configuration UI (date range, user, filters)
- [ ] Report data aggregation service:
  - Tasks completed, cycle time, throughput
  - Time tracking summaries
  - Git integration stats (if available)
  - Trend analysis (week-over-week)
- [ ] Report preview UI
- [ ] Export to CSV
- [ ] Export to JSON
- [ ] Export to PDF (using @react-pdf or similar)
- [ ] Report templates

**Deliverable**: Generate and export performance reports

### Milestone 8: Git Integration Scaffold (Day 8-9)
**Goal**: Link tasks to code artifacts
- [ ] GitLink model and API
- [ ] Manual PR/commit/issue linking UI
- [ ] Parse GitHub URLs
- [ ] Display linked artifacts on tasks
- [ ] Include in activity feed
- [ ] Include in performance reports
- [ ] Scaffold for future OAuth integration

**Deliverable**: Users can link and track Git artifacts

### Milestone 9: Polish & DevEx (Day 9-10)
**Goal**: Production-ready quality
- [ ] Comprehensive error handling
- [ ] Form validation with helpful messages
- [ ] Optimistic UI updates
- [ ] Loading states everywhere
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [ ] Unit tests for critical paths
- [ ] E2E tests for main flows
- [ ] CI/CD configuration (GitHub Actions)
- [ ] Database migration strategy docs
- [ ] API documentation

**Deliverable**: Production-ready application

## Folder Structure

```
task-management-app/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # My Work dashboard
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── reports/
│   │   │   └── activity/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── reports/
│   │   ├── layout/
│   │   └── shared/
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── validations/       # Zod schemas
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── services/              # Business logic
│   │   ├── task.service.ts
│   │   ├── project.service.ts
│   │   ├── activity.service.ts
│   │   ├── report.service.ts
│   │   └── git.service.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── use-tasks.ts
│       └── use-activity.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── MIGRATIONS.md
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## Development Workflow

1. **Local Setup**: `npm install` → `docker compose up -d` → `npm run db:migrate` → `npm run db:seed`
2. **Development**: `npm run dev` (hot reload)
3. **Testing**: `npm test` (unit) → `npm run test:e2e` (Playwright)
4. **Linting**: `npm run lint` → `npm run format`
5. **Database**: `npm run db:studio` (Prisma Studio GUI)
6. **CI**: GitHub Actions on push/PR

## RBAC Model

### Roles
- **ADMIN**: Full system access, user management
- **MANAGER**: Create projects/epics, manage team tasks, view all reports
- **MEMBER**: Create/edit own tasks, view assigned tasks, limited reports

### Permissions Matrix
| Action | Admin | Manager | Member |
|--------|-------|---------|--------|
| Create Project | ✓ | ✓ | ✗ |
| Edit Any Task | ✓ | ✓ | Only assigned |
| View All Reports | ✓ | ✓ | Own only |
| Manage Users | ✓ | ✗ | ✗ |
| Bulk Operations | ✓ | ✓ | Own only |
| Delete Project | ✓ | ✗ | ✗ |

## Performance Considerations

1. **Pagination**: Default 50 items per page
2. **Indexes**: On foreign keys, status, assigneeId, createdAt
3. **Query Optimization**: Prisma select/include only needed fields
4. **Caching**: Next.js cache for static data, React Query for client
5. **Lazy Loading**: Dynamic imports for heavy components
6. **Optimistic Updates**: Immediate UI feedback, revalidate in background

## Security Considerations

1. **Input Validation**: Zod schemas on all inputs
2. **SQL Injection**: Prisma parameterized queries
3. **XSS**: React auto-escapes, DOMPurify for markdown
4. **CSRF**: NextAuth handles tokens
5. **Rate Limiting**: API route middleware
6. **Secrets**: Environment variables, never committed
7. **Row-Level Security**: Prisma middleware for RBAC

## Future Enhancements (Phase 2)

- [ ] Full GitHub OAuth integration
- [ ] Automated PR/commit import
- [ ] Calendar view
- [ ] Time tracking with timer
- [ ] Slack/email notifications
- [ ] Task templates
- [ ] Recurring tasks
- [ ] File attachments (S3/CloudFlare)
- [ ] Real-time collaboration (websockets)
- [ ] Mobile app (React Native)
- [ ] API rate limiting and versioning
- [ ] Multi-tenancy/organizations

## Success Metrics

- Clean, professional UI (visual inspection)
- < 2s page load times
- 100% of changes logged in ActivityEvent
- Reports generate in < 5s for 1 year of data
- WCAG AA compliance (Lighthouse audit)
- Test coverage > 70%
- Zero console errors in production build

## Next Steps

1. Review and approve this plan
2. Begin Milestone 1: Foundation setup
3. Iterative development with regular check-ins
4. Deploy MVP for user testing
