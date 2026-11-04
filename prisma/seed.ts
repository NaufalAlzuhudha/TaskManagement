import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with sample portfolio tasks...");

  // Clear existing tasks
  await prisma.task.deleteMany({});

  const now = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;

  const sampleTasks = [
    {
      title: "Rancang arsitektur database PostgreSQL",
      description:
        "Membuat Entity Relationship Diagram (ERD) dan skema relasional tabel task menggunakan Prisma ORM.",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.HIGH,
      dueDate: new Date(now.getTime() - 2 * dayInMs),
    },
    {
      title: "Setup Next.js 15 App Router & Tailwind CSS",
      description:
        "Inisialisasi repository, konfigurasi linting, font Inter, dan arsitektur atomic design.",
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(now.getTime() - 1 * dayInMs),
    },
    {
      title: "Implementasi Server Actions untuk operasi CRUD",
      description:
        "Membangun fungsi backend getTasks, createTask, updateTask, dan deleteTask dengan validasi Zod.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(now.getTime() + 1 * dayInMs),
    },
    {
      title: "Integrasi komponen UI dengan shadcn/ui",
      description:
        "Membangun modal dialog form task, status badge, priority badge, dan dropdown menu.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(now.getTime() + 2 * dayInMs),
    },
    {
      title: "Buat visualisasi grafik statistik di Dashboard",
      description:
        "Menampilkan distribusi status dan prioritas tugas menggunakan library Recharts.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(now.getTime() + 4 * dayInMs),
    },
    {
      title: "Optimasi responsivitas mobile & tablet",
      description:
        "Memastikan seluruh tabel, dialog, dan navigasi sidebar dapat diakses dengan mulus di layar smartphone.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: new Date(now.getTime() + 6 * dayInMs),
    },
    {
      title: "Deploy aplikasi ke platform Vercel & Neon PostgreSQL",
      description:
        "Konfigurasi environment variable production dan jalankan migrasi database otomatis.",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date(now.getTime() + 7 * dayInMs),
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Berhasil menambahkan ${sampleTasks.length} tugas percontohan!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

