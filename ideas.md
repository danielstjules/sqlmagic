``` javascript
let co      = require('co');
let orm     = require('sqlmagic')({dialect: 'sqlite', storage: ':memory:'}),
let column  = orm.column;
let execute = orm.execute;
let sql     = orm.sql;

class User() {
  constructor(name) {
    this.id = column({type: orm.integer, primaryKey: true});
    this.name = column({type: orm.varchar(50), init: name});
  }
}

orm.registerModel(User, {table: 'user'});

co(function*() {
  yield orm.connect();

  // Let's create a couple new users
  let user1 = new User('Daniel');
  let user2 = new User('Michael');

  // But those are POJOs, so now let's persist those users to the DB
  let session = yield orm.getSession();
  try {
    session.add(user1);
    session.add(user2);
    yield session.commit();
  } catch (e) {
    yield session.rollback();
  } finally {
    yield session.close();
  }

  // Now we can find our saved user
  let user = yield s.query(User)
    .where(User.name.equals('Michael'));

  // Or just using plain SQL. The execute fn always uses prepared
  // statements, and the sql function parametrizes the query
  let name = 'Michael';
  let user = yield orm.execute(sql`
    SELECT * FROM user
    WHERE name=${name}`);
});
```

## Relationships

``` javascript
class Author() {
  constructor(name) {
    this.id = column({type: orm.integer, primaryKey: true});
    this.name = column({type: orm.varchar(50), init: name});
    this.books = hasMany('Book');
  }
}

orm.registerModel(Author, {table: 'author'});

class Book() {
  constructor(name, author) {
    this.id = column({type: orm.integer, primaryKey: true});
    this.name = column({type: orm.varchar(255), init: name});
    this.authors = hasMany('Author');
  }
}

orm.registerModel(Book, {table: 'book'});

orm.association(
  'book_author',
  {name: 'book_id', type: orm.integer, foreignKey: 'book.id'},
  {name: 'author_id', type: orm.integer, foreignKey: 'author.id'},
);
```

## Query DSL

``` javascript
let s = orm.getSession();

let products = yield s.query(Product)
  .where(Product.name.not.equals('test')).fetch();

let products = yield s.query(Product)
  .whereNotEquals(Product.name, 'test').fetch();

let numProducts = yield s.query(Product).count();

let books = yield s.query(Book).where(Book.title.like('%test%'))
  .limit(2).orderBy(Book.id).fetch();

let user = yield s.query(User)
  .where(User.numPosts.gte(100).lte(1000)).one();

let user = yield s.query(User)
  .where(User.name.like('%ed')).orderBy(User.id);

let user = yield s.query(User).join(Address)
  .where(Address.email.equals('foobar@example.com'));

let addrAlias1 = alias(Address);
let addrAlias2 = alias(Address);
let data = s.query(User.name, addrAlias1.email, addrAlias2.email)
  .join(addrAlias1, User.addresses)
  .join(addrAlias2, User.addresses)
  .filter(addrAlias1.email.equals('foo@example.com'))
  .filter(addrAlias2.email.equals('bar@example.com'));

let products = yield query(Product)
  .whereEquals(Product.name, 'foo')
  .and.whereEquals(Product.type, 'toy')
  .fetch();
```

## Unit of work
``` javascript
session.delete
session.add
session.query
session.commit
session.rollback
session.close
