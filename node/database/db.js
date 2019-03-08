var models = require('express-cassandra');
var db = models.setDirectory('./models').bind(
    {
        clientOptions: {
            contactPoints: ['172.16.159.13'],
            protocolOptions: { port: 9042 },
            keyspace: 'mykeyspace',
            queryOptions: {consistency: models.consistencies.one},
			authProvider: new models.driver.auth.PlainTextAuthProvider('test', 'test')
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function(err) {
        if(err) throw err;
		
        // You'll now have a `person` table in cassandra created against the model
        // schema you've defined earlier and you can now access the model instance
        // in `models.instance.Person` object containing supported orm operations.
    }
);

module.exports = db;