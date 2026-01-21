import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)
  const memberPassword = await bcrypt.hash('member123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      bio: 'System administrator with full access',
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: managerPassword,
      role: 'MANAGER',
      bio: 'Team manager overseeing multiple projects',
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      name: 'Member User',
      password: memberPassword,
      role: 'MEMBER',
      bio: 'Team member working on assigned tasks',
    },
  })

  console.log('✅ Created users:', { admin: admin.email, manager: manager.email, member: member.email })

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Q1 Platform Improvements',
      key: 'PLAT',
      description: 'Major platform enhancements for Q1 2026',
      status: 'ACTIVE',
      color: '#3B82F6',
      creatorId: admin.id,
      ownerId: manager.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
    },
  })

  console.log('✅ Created project:', project.name)

  // Create epics
  const authEpic = await prisma.epic.create({
    data: {
      name: 'Authentication & Authorization',
      description: 'Implement comprehensive auth system with RBAC',
      status: 'IN_PROGRESS',
      color: '#10B981',
      projectId: project.id,
      creatorId: manager.id,
      startDate: new Date('2026-01-05'),
    },
  })

  const reportingEpic = await prisma.epic.create({
    data: {
      name: 'Performance Reporting',
      description: 'Build semi-annual performance report generation',
      status: 'PLANNED',
      color: '#F59E0B',
      projectId: project.id,
      creatorId: manager.id,
    },
  })

  console.log('✅ Created epics:', authEpic.name, reportingEpic.name)

  // Create tags
  const bugTag = await prisma.tag.create({
    data: { name: 'bug', color: '#EF4444', description: 'Bug fixes' },
  })

  const featureTag = await prisma.tag.create({
    data: { name: 'feature', color: '#3B82F6', description: 'New features' },
  })

  const docsTag = await prisma.tag.create({
    data: { name: 'docs', color: '#8B5CF6', description: 'Documentation' },
  })

  console.log('✅ Created tags')

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Implement JWT authentication',
      description: '# JWT Auth Implementation\n\nImplement JSON Web Token based authentication system.\n\n## Requirements\n- Token generation\n- Token validation\n- Refresh token logic',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      estimatePoints: 8,
      estimateHours: 16,
      projectId: project.id,
      epicId: authEpic.id,
      creatorId: manager.id,
      assigneeId: member.id,
      startDate: new Date('2026-01-10'),
      dueDate: new Date('2026-01-20'),
    },
  })

  await prisma.taskTag.create({
    data: { taskId: task1.id, tagId: featureTag.id },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Add RBAC middleware',
      description: 'Create role-based access control middleware for API routes',
      status: 'TODO',
      priority: 'HIGH',
      estimatePoints: 5,
      estimateHours: 10,
      projectId: project.id,
      epicId: authEpic.id,
      creatorId: manager.id,
      assigneeId: member.id,
      dueDate: new Date('2026-01-25'),
    },
  })

  await prisma.taskTag.create({
    data: { taskId: task2.id, tagId: featureTag.id },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Design report data model',
      description: 'Define schema for performance reporting queries',
      status: 'DONE',
      priority: 'MEDIUM',
      estimatePoints: 3,
      estimateHours: 6,
      projectId: project.id,
      epicId: reportingEpic.id,
      creatorId: manager.id,
      assigneeId: manager.id,
      completedAt: new Date('2026-01-15'),
    },
  })

  await prisma.taskTag.createMany({
    data: [
      { taskId: task3.id, tagId: docsTag.id },
      { taskId: task3.id, tagId: featureTag.id },
    ],
  })

  console.log('✅ Created tasks')

  // Create comments
  await prisma.comment.create({
    data: {
      content: 'Started working on this. Implementing token generation first.',
      taskId: task1.id,
      authorId: member.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: 'Great! Let me know if you need any help with the refresh token logic.',
      taskId: task1.id,
      authorId: manager.id,
    },
  })

  console.log('✅ Created comments')

  // Create time entries
  await prisma.timeEntry.create({
    data: {
      description: 'Set up JWT library and basic token generation',
      hours: 4.5,
      date: new Date('2026-01-11'),
      taskId: task1.id,
      userId: member.id,
    },
  })

  await prisma.timeEntry.create({
    data: {
      description: 'Implemented token validation and middleware',
      hours: 6,
      date: new Date('2026-01-12'),
      taskId: task1.id,
      userId: member.id,
    },
  })

  console.log('✅ Created time entries')

  // Create activity events
  await prisma.activityEvent.create({
    data: {
      type: 'TASK_CREATED',
      userId: manager.id,
      projectId: project.id,
      taskId: task1.id,
      metadata: { taskTitle: task1.title },
    },
  })

  await prisma.activityEvent.create({
    data: {
      type: 'TASK_ASSIGNED',
      userId: manager.id,
      taskId: task1.id,
      after: { assigneeId: member.id, assigneeName: member.name },
    },
  })

  await prisma.activityEvent.create({
    data: {
      type: 'TASK_STATUS_CHANGED',
      userId: member.id,
      taskId: task1.id,
      before: { status: 'TODO' },
      after: { status: 'IN_PROGRESS' },
    },
  })

  await prisma.activityEvent.create({
    data: {
      type: 'TASK_COMPLETED',
      userId: manager.id,
      taskId: task3.id,
      metadata: { taskTitle: task3.title },
    },
  })

  console.log('✅ Created activity events')

  // Create Git links
  await prisma.gitLink.create({
    data: {
      type: 'PULL_REQUEST',
      url: 'https://github.com/example/repo/pull/42',
      prNumber: 42,
      prStatus: 'merged',
      title: 'feat: add JWT authentication',
      description: 'Implements JWT-based authentication with refresh tokens',
      mergedAt: new Date('2026-01-14'),
      taskId: task1.id,
    },
  })

  console.log('✅ Created Git links')

  console.log('🎉 Seeding complete!')
  console.log('\n📝 Demo accounts:')
  console.log('   Admin:   admin@example.com / admin123')
  console.log('   Manager: manager@example.com / manager123')
  console.log('   Member:  member@example.com / member123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
