export const register = async (request, reply) => {
  try {
    interface RequestBody {
      role: 'teacher' | 'clubMember' | 'companyMember';
      name: string;
      phone: string;
      email?: string;
      // 教师相关字段
      school?: string;
      department?: string;
      subject?: string;
      // 社团相关字段
      clubName?: string;
      category?: string;
      memberCount?: string;
      // 企业相关字段
      companyName?: string;
      industry?: string;
      description?: string;
    }
    
    const { role, name, phone, email, ...otherData } = request.body as RequestBody;
    
    const { prisma } = request.server;
    
    // 使用事务确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 查询用户
      const user = await tx.user.findUnique({
        where: { open_id: request.openId },
      });
      
      if (user) {
        throw new Error('用户已有角色，无法重复注册');
      }

      // 创建用户主记录
      const updatedUser = await tx.user.create({
        data: { 
          role: role, 
          open_id: request.openId,  
          name: name || "默认用户" + request.openId.substring(0, 4),
          phone: phone,
          email: email
        },
      });

      let extensionRecord = null;      
      switch (role) {
        case 'teacher':
          // 处理老师扩展数据
          extensionRecord = await tx.teacher.create({
            data: {
              userId: updatedUser.id,
              school: otherData.school,
              department: otherData.department,
              subject: otherData.subject
            }
          });
          break;
        case 'clubMember':
          // 处理社团扩展数据
          extensionRecord = await tx.clubMember.create({
            data: {
              userId: updatedUser.id,
              clubName: otherData.clubName,
              school: otherData.school,
              category: otherData.category,
              memberCount: otherData.memberCount,
              description: otherData.description
            }
          });
          break;
        case 'companyMember':
          // 处理企业扩展数据
          extensionRecord = await tx.companyMember.create({
            data: {
              userId: updatedUser.id,
              companyName: otherData.companyName,
              industry: otherData.industry,
              description: otherData.description
            }
          });
          break;
      }
      
      return {
        user: updatedUser,
        extension: extensionRecord
      };
    });
    
    return reply.send({
      success: true, 
      message: '注册成功', 
      user: result.user,
      extension: result.extension
    });
  } catch (error: any) {
    console.error('注册失败:', error);
    
    if (error.message === '用户已有角色，无法重复注册') {
      return reply.code(400).send({ error: '用户已有角色，无法重复注册' });
    }
    
    return reply.code(500).send({ error: error.message || '注册失败' });
  }
}