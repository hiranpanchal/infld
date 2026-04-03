import { prisma } from "@/lib/db";

// --- Products ---

export async function getPublishedProducts() {
  return prisma.product.findMany({
    where: { published: true },
    include: { images: { orderBy: { sortOrder: "asc" } }, sizes: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      sizes: true,
    },
  });
}

export async function getProductsByCategory(category: string) {
  if (category === "all") return getPublishedProducts();
  return prisma.product.findMany({
    where: { published: true, category },
    include: { images: { orderBy: { sortOrder: "asc" } }, sizes: true },
    orderBy: { createdAt: "desc" },
  });
}

// --- Page Content ---

export async function getPageContent(pageKey: string) {
  const blocks = await prisma.pageContent.findMany({
    where: { pageKey },
  });
  const map: Record<string, string> = {};
  for (const b of blocks) {
    map[b.blockKey] = b.content;
  }
  return map;
}

// --- Site Images ---

export async function getSiteImages(location: string) {
  return prisma.siteImage.findMany({
    where: { location },
    orderBy: { sortOrder: "asc" },
  });
}

// --- Orders ---

export async function getOrders(status?: string) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function getOrderStats() {
  const [total, pending, paid, processing, shipped, delivered] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "paid" } }),
      prisma.order.count({ where: { status: "processing" } }),
      prisma.order.count({ where: { status: "shipped" } }),
      prisma.order.count({ where: { status: "delivered" } }),
    ]);

  const revenue = await prisma.order.aggregate({
    _sum: { totalPence: true },
    where: { status: { in: ["paid", "processing", "shipped", "delivered"] } },
  });

  return {
    total,
    pending,
    paid,
    processing,
    shipped,
    delivered,
    revenuePence: revenue._sum.totalPence || 0,
  };
}
