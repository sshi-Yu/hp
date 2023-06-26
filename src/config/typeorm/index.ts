import { TypeOrmModule } from '@nestjs/typeorm';

export const buildTypeormConf = (entities?: any[]) => {
    return [
        TypeOrmModule.forRoot(
            {
                type: 'mysql', // Host, localhost, or domain name. 描述了数据库连接的 host 。 MySQL 5.7 开始支持可变参数，以此选项为示例。 
                host: 'localhost', // Hostname. 描述了数据库连接的 host 。 
                port: 3306, // Port number. 描述了数据库连接的端口号。 
                username: 'root', // Username. 数据库用户名。 
                password: '120498',
                database: 'hp', // Database name. 描述了数据库名称。 描述了连接的数据库。 创 建的时候选择这个名称。 检查数据库是否已经存在。 使用UTF-8编码 描述了连接的数据库。 创建或更新数据库时，应注意以下几个选项。
                synchronize: true, // Synchronize the database. 创建或更新数据库。 创建数据库时，不需要列 包含任何数据。 
                logger: "file", // Logger name. 描述了数据库操作的消息模板。 使用语言自带的打印
                logging: true, // Enable or disable logging. 描述了数据库操作的开始和结束。 可以使用语言 自带的打印和记录日志功能。
                entities: ["dist/modules/**/entities/*.entity{.ts,.js}"],
                entityPrefix: "hp_", // Prefix for all ORM entities (colon added automatically if using multiple prefixes). 描述了数据库中每个实
                autoLoadEntities: true, // Enable or disable automatic loading of ORM entities when using multiple prefixes. 描述了如何在多个名称空间
            }
        )
        ,
        TypeOrmModule.forFeature(entities) // ORM for features. For example: TypeOrmModule.forFeature([myEntity1, myEntity2]) 创建一个模块
    ]
} 