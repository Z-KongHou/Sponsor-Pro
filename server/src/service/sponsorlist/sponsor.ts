import { Context } from "koa";
import { equal } from "node:assert";

interface SponsorParams {
  search?: string;
  category?: string;
  page?: number;
  location?: string;
}

interface SponsorData {
  sponsors: any[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

const pageSize = 10;

async function Sponsor(ctx: Context, params: SponsorParams): Promise<SponsorData> {
  const { search, category, page, location } = params;
  
  try {
    // 构建过滤条件
    const where = {} as any;
    where.SponsorshipStatus = { equals: 'APPROVED' };
    
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    
    if (category) {
      where.categories = { equals: category };
    }

    if (location) {
      where.location = { equals: location};
    }
    
    // 计算偏移量
    const currentPage = page || 1;
    const skip = (currentPage - 1) * pageSize;
    
    // 查询总数
    const totalCount = await ctx.prisma.sponsor.count({ 
        where,
     });
    
    // 查询分页数据
    const sponsors = await ctx.prisma.sponsor.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { id: 'desc' }
    });
    
    // 返回结果
    return {
      sponsors,
      pagination: {
        total: totalCount,
        page: currentPage,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    };
  } catch (error) {
    console.error('获取赞助列表失败:', error);
    throw new Error('获取赞助列表失败');
  }
}

export { Sponsor };