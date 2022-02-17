const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                idx: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: Sequelize.STRING(60),
                    allowNull: false,
                },
                username: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                nickname: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                role: {
                    type: Sequelize.TINYINT,
                    allowNull: false,
                },
                money: {
                    type: Sequelize.DOUBLE,
                },
                profile: {
                    type: Sequelize.JSON,
                    defaultValue: {
                        image: "",
                        description: "",
                    },
                },
                language: {
                    type: Sequelize.STRING(20),
                },
                country: {
                    type: Sequelize.STRING(20),
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "User",
                tableName: "user",
                paranoid: false,
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {}
};
