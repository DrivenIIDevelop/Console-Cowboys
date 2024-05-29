// For use in type guard functions. Casting any value to type Anything should be safe.
// We don't want to use type 'any' because that won't be type checked at all inside the function.
// Example: obj.foo is allowed, even though obj might be undefined.
// We don't use type 'unknown' because TypeScript is too restrictive.
// Example: obj && obj.foo is not allowed despite the fact that it would never raise an error in JavaScript. (Unless foo property has a getter method that throws... but that's not a type issue so it's weird if TypeScript cares.)
//          obj && typeof obj.foo === 'string' is also not allowed, which is really strange!
export type Anything = {[key: string | number | symbol]: unknown} | null | undefined;

export type ErrorResult = { error: string }
export function isError(obj: Anything): obj is ErrorResult {
	return Boolean(obj && obj.error !== undefined);
}

