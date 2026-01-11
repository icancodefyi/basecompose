declare module "js-yaml" {
  export function load(input: string | Buffer): any;
  export function dump(data: any, options?: any): string;
}

declare module "tar" {
  export function c(options: any, files: string[]): NodeJS.ReadWriteStream;
  export function create(options: any, files: string[]): Promise<void>;
}
