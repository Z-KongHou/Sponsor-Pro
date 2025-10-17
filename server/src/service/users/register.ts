export const register = async (request, reply) => {
  try {
    const { role } = request.body as { 
      role: 'teacher' | 'clubMember' | 'companyMember';
    };
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

      const updatedUser = await tx.user.create({
        data: { 
          role: role, 
          open_id: request.openId,  
          name: "默认用户" + request.openId.substring(0, 4)
        },
      });

      let extensionRecord = null;      
      switch (role) {
        case 'teacher':
          extensionRecord = await tx.teacher.create({});
          break;
        case 'clubMember':
          extensionRecord = await tx.clubMember.create({});
          break;
        case 'companyMember':
          extensionRecord = await tx.companyMember.create({});
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
    
    return reply.code(500).send({ error: '注册失败' });
  }
}