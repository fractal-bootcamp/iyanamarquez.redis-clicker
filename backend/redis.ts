import { Redis } from "ioredis";

// Create a Redis instance.
// By default, it will connect to localhost:6379.
// We are going to cover how to specify connection options soon.

const uri =
  "redis://default:xs5BQB53SSRKF2z3LN3C1qOxWO39xmJp@redis-16518.c100.us-east-1-4.ec2.cloud.redislabs.com:16518";

const { port, hostname, username, password } = new URL(uri);
const redis = new Redis({
  port: Number(port),
  host: hostname,
  username,
  password,
  db: 0,
});

redis.set("mykey", "bruh"); // Returns a promise which resolves to "OK" when the command succeeds.
redis.set("user1", "clicked something");
// ioredis supports the node.js callback style
redis.get("mykey", (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Prints "value"
  }
});

// Or ioredis returns a promise if the last argument isn't a function
redis.get("mykey").then((result) => {
  console.log(result); // Prints "value"
});

// redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");
// redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((elements) => {
//   // ["one", "1", "dos", "2", "three", "3"] as if the command was `redis> ZRANGE sortedSet 0 2 WITHSCORES`
//   console.log(elements);
// });

// // All arguments are passed directly to the redis server,
// // so technically ioredis supports all Redis commands.
// // The format is: redis[SOME_REDIS_COMMAND_IN_LOWERCASE](ARGUMENTS_ARE_JOINED_INTO_COMMAND_STRING)
// // so the following statement is equivalent to the CLI: `redis> SET mykey hello EX 10`
// redis.set("mykey", "hello", "EX", 10);
