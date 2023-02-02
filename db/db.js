let mongoose = require('mongoose');
mongoose.set('strictQuery', true);
class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(process.env.MONGODB_URL)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }
}

module.exports = new Database()