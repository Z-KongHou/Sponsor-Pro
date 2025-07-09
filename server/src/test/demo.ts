import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addSchool(name: string, address?: string) {
  try {
    const newSchool = await prisma.school.create({
      data: {
        name,
        address,
      },
    });
    console.log("新增学校成功:", newSchool);
    return newSchool;
  } catch (error) {
    console.error("新增学校失败:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 调用示例
addSchool("第一中学", "北京市海淀区")
  .then(() => console.log("操作完成"))
  .catch(() => console.log("操作失败"));
