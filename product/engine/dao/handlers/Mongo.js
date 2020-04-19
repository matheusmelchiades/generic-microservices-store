const { MongoClient, ObjectId } = require('mongodb');

function Mongo(config = {}) {
    this.config = config;
    this.db = null;
    this.client = this.createClient();
    this.ObjectId = ObjectId;
}

function createUrl({ host, port, user, password, database, uri }) {

    if (uri) return uri;

    if (password) {
        return `mongodb://${user}:${password}@${host}:${port}/${database}`;
    }

    return `mongodb://${host}${port ? `:${port}` : ''}/${database}`;
}

Mongo.prototype.createClient = function() {
    const url = createUrl(this.config);

    return new MongoClient(url, { 'useUnifiedTopology': true });
};

Mongo.prototype.open = function() {

    return new Promise((resolve, reject) => {

        this.client.connect(err => {
            if (err) return reject(err);

            this.db = this.client.db(this.config.database);

            return resolve({});
        });
    });
};

Mongo.prototype.close = function() {

    return new Promise((resolve, reject) => {

        this.client.close((err, success) => {
            if (err) return reject(err);

            return resolve(success);
        });
    });
};

Mongo.prototype.deleteOne = function(collection, query) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).deleteOne(query, (err, success) => {
            if (err) return reject(err);

            return resolve(success);
        });
    });
};

Mongo.prototype.dropAll = function(collection) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).deleteMany((err, success) => {
            if (err) return reject(err);

            return resolve(success);
        });
    });
};

Mongo.prototype.find = function(collection, query, projection) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).find(query).project(projection).toArray((err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });
};

Mongo.prototype.findOne = function(collection, query = {}, projection = {}, options = {}) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).findOne(query, { projection, ...options }, (err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });
};

Mongo.prototype.findPagination = function(collection, query, projection, options) {
    const orderBy = query.sort || {};
    const currentPage = options.page - 1 > 0 ? options.page - 1 : 0;
    const limit = parseInt(options.limit);
    const skip = parseInt(currentPage) * parseInt(limit);

    delete query.sort;

    return new Promise((resolve, reject) => {

        this.db.collection(collection).find(query).count((err, length) => {
            if (err) return reject(err);

            this.db.collection(collection).find(query).project(projection)
                .skip(skip).limit(limit).sort(orderBy)
                .toArray((err, data) => {
                    if (err) return reject(err);

                    return resolve({
                        'count': length,
                        'rows': data || []
                    });
                });
        });
    });
};

Mongo.prototype.aggregate = function(collection, pipeline = [], options = {}) {
    return new Promise((resolve, reject) => {

        this.db.collection(collection).aggregate(pipeline, options).toArray((err, data) => {
            if (err) return reject(err);

            return resolve(data);
        });
    });
};

Mongo.prototype.insertOne = function(collection, document) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).insertOne(document, (err, data) => {
            if (err) return reject(err);

            return resolve(data.ops[0]);
        });
    });
};

Mongo.prototype.insertMany = function(collection, documents) {

    return new Promise((resolve, reject) => {

        this.db.collection(collection).insertMany(documents, (err, data) => {
            if (err) return reject(err);

            return resolve(data.ops);
        });
    });
};

Mongo.prototype.updateOne = function(collection, query, update, options = {}) {

    options = { ...options, 'returnOriginal': false };

    return new Promise((resolve, reject) => {

        this.db.collection(collection).findOneAndUpdate(query, update, options, (err, data) => {
            if (err) return reject(err);

            return resolve(data.value || null);
        });
    });
};

module.exports = Mongo;
