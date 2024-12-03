# TechTalk

## Introduction to Prisma ORM

Introduction to Prisma Object Relational Mapper

*"Object relational mappers" (ORMs) exist to bridge the gap between the programmers' friend (the object), and the database's primitive (the relation)"*



## Why do we need something like that?

- Thinking in **objects** instead of mapping relational data
- Queries not classes to avoid complex model objects
- **Single source of truth** for database and application models
- Healthy **constraints** that prevent common pitfalls and anti-patterns
- An abstraction that makes the right thing easy ("pit of success")
- **Type-safe database queries** that can be validated at compile time
- Less boilerplate so developers can focus on the important parts of their app
- **Auto-completion in code editors** instead of needing to look up documentation

## Security

- Prevent SQL Injection by default

## Migration and "live developing"

### The Need

"*a database model is something you should lay out once and best never touch again*"

Since this is not realistic, we need a way to actively change the database schema while developing.

- adding tables
- modifying fields (unique? optional?)
- adding relations between tables

### The Problem

When changing the database, we dont know i we break existing stuff:

**inside the database**

- exisiting data might not fit to new table structure
- we might need new default data entries for the new structure
- existing relations might break since they are not pointing to the right table anymore

(Disclaimer: I dont know much about database tools that help in this particular field, so i dont want to say, an ORM like Prisma is the *only* way to go..)

**inside our codebase**

- any function using inline SQL Code will break without any warning/sign

### The solution in detail

- prisma compiler (in your IDE) will check that the database model definition is valid (squiggly lines...)
- there is a single `prisma migrate` command that provides detailed analysis of the compatibility of the changes to the exisiting database content

## Code comparison (example)

**raw sql**

```typescript
const query = `
      SELECT o.id, o.order_date, p.name, p.price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.order_date DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
```

- full control over your database operations

- productivity suffers

- high risk of typos and all similar annoying stuff

**prisma query**

```typescript
const orders = await prisma.order.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        orderDate: true,
        orderItems: {
          select: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    })
    return orders
```

- we are staying typed object syntax

- but still we understand the underlying table structure

- unlike other traditional ORMs we can still understand, where prisma will add computational expensive joins

## Model definition (example)

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)    // check enum at the bottom
  posts   Post[]   // this is a relation to Post(s) (one to many)
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}

model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

// enums are possible :)
enum Role {
  USER
  ADMIN
}
```



## Live Code Example

We have a typescripted *todo app* with nextJS and prisma querying a postgres database running in a docker containert.



1. Project Overview
   
   1. page.tsx 
   
   2. actions.ts
   
   3. schema.prisma

2. changing something
   
   1. adding an importance field to a todo
   
   2. doing the database migration
   
   3. fixing bugs in actions.ts. // implementing the new functionality
   
   4. reflecting changes in the frontend



# Thanks :)


