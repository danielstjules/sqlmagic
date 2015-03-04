# SQLMagic

WIP. Ignore. ORM progress in branch.

## Parametrized Queries and Prepared Statements

Many node ORMs and querying DSLs try to escape queries to avoid SQL
injection, which is cumbersome and error-prone. SQLMagic uses parametrized
queries with mysql2, pg and sqlite3 to avoid SQL injection. In addition, it
provides a name when required to enable prepared statements. This improves
performance as only a short name is sent to be parsed, rather than a full query,
and the DB is able to re-use cached query plans for common queries.

``` javascript
'use strict';

let co     = require('co');
let config = {dialect: 'mysql2', host: 'localhost', database: 'test'};
let orm    = require('sqlmagic')(config);

co(function*() {
  let id = 1;
  let row = yield orm.execute`
    SELECT *
    FROM users
    WHERE user_id = ${id}`;
  orm.close();
});

// With mysql2: 'SELECT * FROM users WHERE user_id = ?', [1]
// With pg: 'SELECT * FROM users WHERE user_id = $1', [1]
```

To prevent errors such as forgetting to parametrize a query, `orm.execute`
must be invoked in one of the following ways:
``` javascript
let foo = 'bar';
// Used as a tag for a tagged template string as seen above
orm.execute`SELECT * FROM...{$foo}`;
// Passed a query string and array of values:
orm.execute('SELECT * FROM...?', [foo]);
// Passed an object of the form:
orm.execute({text: 'SELECT * FROM...?', values: [foo]});
```

Invoking the function with a string, without an array of values, will result in
an error.

``` javascript
let id = req.query.id;

// Not safe, since id hasn't been escaped/filtered/validated, and isn't
// being used in a parametrized query
orm.execute(`SELECT * FROM products WHERE product_id = ${id}`).catch((err) => {
  // Error: Expected array of values for prepared statement
});

orm.execute`SELECT * FROM products WHERE product_id = ${id}`.then((res) => {
  // Succeeds. Your query is safe!
});
```

## Supported drivers

Since SQLMagic requires parametrized queries and encourages prepared statements,
the mysql module is not supported. The only supported drivers are:
[mysql2](https://github.com/sidorares/node-mysql2),
[pg](https://github.com/brianc/node-postgres) and
[sqlite3](https://github.com/mapbox/node-sqlite3).
