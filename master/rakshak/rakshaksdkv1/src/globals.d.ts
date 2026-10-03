declare const process: any;

declare module 'crypto' {
  export function createHmac(algorithm: string, key: any): any;
  export function createHash(algorithm: string): any;
  export function randomBytes(size: number): any;
}

declare module 'fs' {
  export function existsSync(path: any): boolean;
  export function readFileSync(path: any, options?: any): any;
  export function writeFileSync(path: any, data: any, options?: any): void;
  export function mkdirSync(path: any, options?: any): any;
}

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}

declare module 'os' {
  export function homedir(): string;
  export function platform(): string;
}

declare module 'child_process' {
  export function execSync(command: string, options?: any): any;
}
