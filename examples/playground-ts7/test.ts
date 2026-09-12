// Test TypeScript file
interface Greeting {
  message: string
}

function sayHello(name: string): Greeting {
  return { message: `Hello, ${name}!` };
}

const result = sayHello('ESLint');
console.log(result.message);
