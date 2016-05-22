'use strict';
module.exports = function(sequelize, DataTypes) {
    var word = sequelize.define('word', {
        value: DataTypes.STRING,
        lang: DataTypes.STRING,
        class: DataTypes.STRING,
        synonym: DataTypes.STRING,
        inflection: DataTypes.STRING,
        translation: DataTypes.STRING
    }, {
        timestamps: true,
        underscored: true,
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return word;
};
