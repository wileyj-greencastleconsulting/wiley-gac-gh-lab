# Development Setup Guide

This guide will walk you through setting up the task management application on your local machine.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18 or higher installed
- [ ] npm (comes with Node.js)
- [ ] Docker and Docker Compose installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)

### Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# Check Docker Compose version
docker compose version
```

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd wiley-gac-gh-lab
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Prisma and PostgreSQL client
- Tailwind CSS and UI components
- Development tools (TypeScript, ESLint, Prettier)

**Expected time**: 1-2 minutes

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

The default `.env` file is already configured for local development:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanagement?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production-please"
NODE_ENV="development"
```

**No changes needed for local development!**

### 4. Start PostgreSQL with Docker

Start the PostgreSQL database container:

```bash
docker compose up -d
```

This will:
- Pull the PostgreSQL 16 Alpine image (if not already downloaded)
- Create a container named `taskmanagement-db`
- Start PostgreSQL on port 5432
- Create a database named `taskmanagement`

Verify PostgreSQL is running:

```bash
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                COMMAND                  STATUS         PORTS
...            postgres:16-alpine   "docker-entrypoint.s…"   Up X seconds   0.0.0.0:5432->5432/tcp
```

Check PostgreSQL logs (optional):

```bash
docker logs taskmanagement-db
```

### 5. Generate Prisma Client

Generate the Prisma client from your schema:

```bash
npm run db:generate
```

This creates TypeScript types and query functions based on your database schema.

### 6. Run Database Migrations

Apply the database schema to PostgreSQL:

```bash
npm run db:migrate
```

This will:
- Create all tables (users, projects, epics, tasks, etc.)
- Set up indexes for performance
- Create enums for status types
- Establish foreign key relationships

**Expected output**: You should see "Migration applied successfully"

### 7. Seed the Database

Populate the database with demo data:

```bash
npm run db:seed
```

This creates:
- **3 demo users** with different roles
- **1 sample project** with epics
- **3 sample tasks** with various statuses
- **Comments** on tasks
- **Time entries** for tracking work
- **Activity events** for audit trail
- **Git links** for code integration examples

**Demo accounts created**:
```
Admin:   admin@example.com    / admin123
Manager: manager@example.com  / manager123
Member:  member@example.com   / member123
```

### 8. Start the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

**You should see**:
```
▲ Next.js 15.1.3
- Local:        http://localhost:3000
- Ready in XXXms
```

### 9. Verify Installation

Open your browser and navigate to:

🌐 [http://localhost:3000](http://localhost:3000)

You should see the task management application home page.

## Development Workflow

### Daily Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Run linter to check code quality
npm run lint

# Format code with Prettier
npm run format

# Run tests
npm test

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Database Management Commands

```bash
# View database in browser (Prisma Studio)
npm run db:studio

# Create a new migration after schema changes
npm run db:migrate

# Reset database (⚠️ deletes all data and re-seeds)
npm run db:reset

# Push schema changes without creating migration
npm run db:push
```

### Docker Management Commands

```bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL (keeps data)
docker compose stop

# Stop and remove PostgreSQL (deletes data!)
docker compose down

# View PostgreSQL logs
docker logs taskmanagement-db

# Access PostgreSQL CLI
docker exec -it taskmanagement-db psql -U postgres -d taskmanagement
```

## Troubleshooting Common Issues

### Issue: Port 3000 is already in use

**Solution**: Either stop the other application or run Next.js on a different port

```bash
PORT=3001 npm run dev
```

### Issue: Port 5432 is already in use

**Problem**: Another PostgreSQL instance is running

**Solutions**:

**Option 1**: Use the existing PostgreSQL
```bash
# Update .env to use existing PostgreSQL
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/taskmanagement?schema=public"
```

**Option 2**: Change Docker PostgreSQL port
```yaml
# Edit docker-compose.yml
services:
  postgres:
    ports:
      - '5433:5432'  # Changed from 5432:5432
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/taskmanagement?schema=public"
```

### Issue: Can't connect to database

**Check PostgreSQL is running**:
```bash
docker ps | grep postgres
```

**Restart PostgreSQL**:
```bash
docker compose restart
```

**Recreate PostgreSQL container**:
```bash
docker compose down
docker compose up -d
npm run db:migrate
npm run db:seed
```

### Issue: Prisma Client is not generated

**Solution**: Regenerate the Prisma client

```bash
npm run db:generate
```

### Issue: Migration failed

**Common causes**:
- Database is not running
- Database connection string is incorrect
- Conflicting migration history

**Solutions**:

1. Check database is running:
```bash
docker ps
```

2. Reset database and start fresh:
```bash
npm run db:reset
```

3. If that doesn't work, manually reset:
```bash
docker compose down -v  # Deletes volumes
docker compose up -d
npm run db:migrate
npm run db:seed
```

### Issue: npm install fails

**Check Node.js version**:
```bash
node --version  # Should be 18+
```

**Clear npm cache and reinstall**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Docker not found

**Problem**: Docker is not installed or not running

**Solutions**:

1. **Install Docker**:
   - macOS: Download Docker Desktop from docker.com
   - Windows: Download Docker Desktop from docker.com
   - Linux: Follow official Docker installation guide

2. **Alternative**: Use an existing PostgreSQL installation

   Update `.env` with your PostgreSQL connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanagement?schema=public"
   ```

## Verifying Your Setup

### Checklist

Run through this checklist to ensure everything is working:

- [ ] PostgreSQL is running (`docker ps`)
- [ ] No errors in PostgreSQL logs (`docker logs taskmanagement-db`)
- [ ] Prisma client is generated (`npm run db:generate`)
- [ ] Migrations applied successfully (`npm run db:migrate`)
- [ ] Database is seeded (`npm run db:seed`)
- [ ] Development server starts (`npm run dev`)
- [ ] Can open http://localhost:3000 in browser
- [ ] No errors in browser console (F12)
- [ ] Can log in with demo account (admin@example.com / admin123)

### Test Database Connection

You can test the database connection with Prisma Studio:

```bash
npm run db:studio
```

This opens a browser-based database GUI at http://localhost:5555

You should see:
- All tables (users, projects, tasks, etc.)
- Demo data (3 users, 1 project, 3 tasks, etc.)

## Next Steps

### Explore the Application

1. **Log in** with a demo account:
   - Open http://localhost:3000
   - Navigate to login page
   - Use: `admin@example.com` / `admin123`

2. **Explore the Dashboard**:
   - View project overview
   - Check tasks list
   - Try different views (Kanban, List)

3. **Check Database** with Prisma Studio:
   - Run `npm run db:studio`
   - Browse tables and relationships
   - Observe how data is structured

### Start Developing

1. **Read the Documentation**:
   - [PLAN.md](./PLAN.md) - Implementation roadmap
   - [DATA_MODEL.md](./DATA_MODEL.md) - Database schema details
   - [README.md](./README.md) - Full project documentation

2. **Explore the Codebase**:
   - `src/app/` - Next.js pages and API routes
   - `src/components/` - React components
   - `src/lib/` - Utilities and configurations
   - `prisma/schema.prisma` - Database schema

3. **Make Your First Change**:
   - Edit `src/app/page.tsx`
   - Save the file
   - See hot reload in browser
   - No restart needed!

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Browser DevTools

- **React DevTools**: Inspect React component tree
- **Redux DevTools**: Inspect application state (if using Redux)
- **Network Tab**: Monitor API requests
- **Console**: Check for JavaScript errors

## Getting Help

### Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open database GUI
npm run db:reset         # Reset database

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests

# Docker
docker compose up -d     # Start PostgreSQL
docker compose stop      # Stop PostgreSQL
docker compose down      # Stop and remove
docker logs taskmanagement-db  # View logs
```

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Need Help?

1. Check the [README.md](./README.md) troubleshooting section
2. Review the [PLAN.md](./PLAN.md) for architecture details
3. Consult the [DATA_MODEL.md](./DATA_MODEL.md) for database questions
4. Open an issue on GitHub
5. Contact the development team

---

**Setup complete!** You're ready to start developing. Happy coding! 🚀
