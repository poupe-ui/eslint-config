// Test file for TypeScript linting
export function testFunction(props: { env: string }) {
  const array = [1, 2, 3];
  for (const item of array) console.log(item);
  return props.env;
}
