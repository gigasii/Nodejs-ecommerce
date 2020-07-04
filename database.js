// Third-party packages
const mongodb = require('mongodb');

// Initialization
const MongoClient = mongodb.MongoClient;
let database;

// Create connection to the database
function connect(callback)
{
    MongoClient.connect('mongodb+srv://giggs:123@shop.nlvcf.mongodb.net/Shop?retryWrites=true&w=majority')
    .then(client => {
        database = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
    })
};

function getDatabase()
{
    if (database)
    {
        return database;
    }
    console.log('No database found');
}

// Exports
exports.connect = connect;
exports.db = getDatabase;