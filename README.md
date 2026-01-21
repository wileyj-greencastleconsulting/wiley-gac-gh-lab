# Task Management & Performance Reporting System

A professional, full-stack task management application with comprehensive activity tracking and semi-annual performance reporting capabilities.

## 🎯 Features

- **Hierarchical Organization**: Projects → Epics → Tasks → Subtasks
- **Multiple Views**: Kanban board, List view, Calendar view, Dashboard
- **Power User Features**: Keyboard shortcuts, command palette, bulk operations, saved filters
- **Comprehensive Tracking**: Every change logged in immutable audit trail
- **Performance Reporting**: Semi-annual reports with cycle time, throughput, and Git integration
- **Professional UI**: Clean, accessible, dark/light mode support
- **RBAC**: Admin, Manager, Member roles with granular permissions

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js v5
- **Testing**: Vitest (unit) + Playwright (e2e)

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd wiley-gac-gh-lab
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

The default `.env` is pre-configured for local development:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanagement?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production-please"
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

Verify PostgreSQL is running:
```bash
docker ps
```

### 4. Set Up Database

Run migrations to create the database schema:
```bash
npm run db:migrate
```

Seed the database with demo data:
```bash
npm run db:seed
```

This creates three demo users:
- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Member**: member@example.com / member123

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes without migration |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database (⚠️ deletes all data) |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

## 🗂️ Project Structure

```
wiley-gac-gh-lab/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data script
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Auth routes (login, register)
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── tasks/           # Task-specific components
│   │   ├── projects/        # Project components
│   │   └── layout/          # Layout components
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   ├── auth.ts          # NextAuth config
│   │   ├── utils.ts         # Utility functions
│   │   └── validations/     # Zod schemas
│   ├── services/            # Business logic
│   │   ├── task.service.ts
│   │   ├── project.service.ts
│   │   ├── activity.service.ts
│   │   └── report.service.ts
│   ├── types/               # TypeScript types
│   └── hooks/               # React hooks
├── tests/
│   ├── unit/                # Unit tests
│   └── e2e/                 # E2E tests
├── docs/                    # Additional documentation
├── PLAN.md                  # Project implementation plan
├── DATA_MODEL.md            # Database schema documentation
└── docker-compose.yml       # PostgreSQL container
```

## 🗄️ Database Schema

The application uses a comprehensive relational schema with 11 main entities:

- **User**: Authentication, profiles, roles (Admin/Manager/Member)
- **Project**: Top-level organization units
- **Epic**: Groups of related tasks
- **Task**: Core work items with full metadata
- **Comment**: Task discussions
- **Tag**: Flexible categorization
- **TaskDependency**: Task relationships (blocks/blocked-by)
- **AttachmentLink**: External resources
- **TimeEntry**: Work session tracking
- **GitLink**: Links to commits/PRs/issues
- **ActivityEvent**: Immutable audit log (30+ event types)
- **SavedFilter**: User's saved views
- **Notification**: User notifications

See [DATA_MODEL.md](./DATA_MODEL.md) for detailed schema documentation.

## 🔐 Authentication & Authorization

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management, all reports |
| **MANAGER** | Create/manage projects, manage team tasks, team reports |
| **MEMBER** | Create/edit own tasks, view assigned tasks, own reports |

### NextAuth Setup

Authentication is handled by NextAuth.js v5 with:
- Email/password credentials provider
- Bcrypt password hashing
- JWT session strategy
- Role-based access control

## 📊 Performance Reporting

The system tracks comprehensive metrics for semi-annual performance reports:

### Tracked Metrics
- Tasks completed (count, by priority, by project)
- Cycle time (time from start to completion)
- Throughput (tasks completed per week/month)
- Time tracking (estimate vs. actual hours)
- Git integration (PRs merged, commits linked)
- Activity timeline (all changes with before/after state)

### Export Formats
- CSV (for spreadsheet analysis)
- JSON (for programmatic processing)
- PDF (formatted reports - coming soon)

### Report Configuration
- Date range selection
- User filtering
- Project/epic filtering
- Tag filtering
- Export format selection

## 🧪 Testing

### Unit Tests (Vitest)
```bash
npm test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # Interactive UI
```

## 🚢 Deployment

### Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-secure-random-string>"
NODE_ENV="production"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Build & Deploy

```bash
npm run build
npm start
```

### Database Migrations

Apply migrations in production:
```bash
npm run db:migrate:deploy
```

## 📚 Additional Documentation

- [PLAN.md](./PLAN.md) - Detailed implementation plan with 9 milestones
- [DATA_MODEL.md](./DATA_MODEL.md) - Database schema documentation with ERDs
- [docs/API.md](./docs/API.md) - API documentation (coming soon)
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide (coming soon)

## 🛠️ Development Workflow

### Making Schema Changes

1. Update `prisma/schema.prisma`
2. Create migration: `npm run db:migrate -- --name descriptive_name`
3. Review generated SQL in `prisma/migrations/`
4. Apply migration: automatically applied by migrate command
5. Regenerate Prisma client: `npm run db:generate`

### Code Quality

- **Linting**: ESLint with Next.js and TypeScript rules
- **Formatting**: Prettier with Tailwind CSS plugin
- **Pre-commit**: (Add Husky hooks as needed)
- **Type Safety**: Strict TypeScript, Prisma-generated types

### Git Workflow

```bash
git checkout -b feature/your-feature-name
# Make changes
npm run lint
npm run format
npm test
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Can't connect to PostgreSQL

**Solutions**:
```bash
# Check if PostgreSQL is running
docker ps

# View PostgreSQL logs
docker logs taskmanagement-db

# Restart PostgreSQL
docker compose restart

# Recreate containers
docker compose down
docker compose up -d
```

### Prisma Issues

**Problem**: Prisma client out of sync

**Solution**:
```bash
npm run db:generate
```

**Problem**: Migration conflicts

**Solution**:
```bash
# Reset database (⚠️ deletes all data)
npm run db:reset

# Or manually resolve in prisma/migrations/
```

### Port Already in Use

**Problem**: Port 3000 or 5432 already in use

**Solutions**:
```bash
# For Next.js (change port)
PORT=3001 npm run dev

# For PostgreSQL (update docker-compose.yml and .env)
# Change ports: "5433:5432" in docker-compose.yml
# Update DATABASE_URL to use port 5433
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Status**: 🚧 In Active Development - Milestone 1: Foundation

For questions or issues, please open a GitHub issue or contact the development team
