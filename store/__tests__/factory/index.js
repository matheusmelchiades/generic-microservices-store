const database = require('../../engine/dao/dbFactory');

function Factory(model) {
    this.db = {};
    this.model = {};

    // eslint-disable-next-line global-require
    this.model = require(`./models/${model}`);
}

Factory.prototype.launch = async function() {

    try {

        if (!global.databases[process.env.MONGO_GLOBAL_NAME]) {
            await database.connect();
        }

        this.db = global.databases[process.env.MONGO_GLOBAL_NAME];

    } catch (err) {
        console.log('ERROR CONNECT');

        return {};
    }
};

Factory.prototype.destroy = async function() {

    try {

        await this.db.dropAll(this.model.collection);

    } catch (err) {
        console.error(`Erro to drop ${this.model.collection}`);

        return null;
    }
};

Factory.prototype.build = function(assign = {}) {
    const builded = this.model.build(this.db.ObjectId);
    const sample = {
        ...builded,
        ...assign
    };

    if (assign && assign._id) {
        assign._id = this.db.ObjectId(assign._id);
    }

    return Object.entries(sample).reduce((prev, [key, value]) => {

        if (value) {
            prev[key] = value;
        }

        return prev;
    }, {});
};

Factory.prototype.buildMany = function(length = 0, assign = {}) {

    return new Array(length).fill({}).map(() => this.build(assign));
};

Factory.prototype.create = async function(assign = {}) {

    try {

        const dataMock = {
            '_id': this.db.ObjectId(),
            ...this.build(assign)
        };

        await this.db.insertOne(this.model.collection, dataMock);

        return dataMock;

    } catch (err) {
        return null;
    }
};

Factory.prototype.createMany = async function(length = 1, assign = {}) {
    try {

        const dataMock = new Array(length).fill({}).map(() => this.build(assign));

        await this.db.insertMany(this.model.collection, dataMock);

        return dataMock;
    } catch (err) {
        console.log(err);

        return [];
    }
};

module.exports = Factory;
