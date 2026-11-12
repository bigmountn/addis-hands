import { promises as fs } from "fs";
import path from "path";
import type { Company, Product } from "@/data/types";
import { isProductPublic } from "@/lib/product-fields";

const companiesPath = path.join(process.cwd(), "data", "companies.json");
const productsPath = path.join(process.cwd(), "data", "products.json");

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getCompanies(): Promise<Company[]> {
  return readJson<Company[]>(companiesPath);
}

export async function getProducts(options?: {
  includeUnpublished?: boolean;
}): Promise<Product[]> {
  const products = await readJson<Product[]>(productsPath);
  if (options?.includeUnpublished) return products;
  return products.filter(isProductPublic);
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts({ includeUnpublished: true });
}

export async function getCompany(slug: string): Promise<Company | undefined> {
  const companies = await getCompanies();
  return companies.find((company) => company.slug === slug);
}

export async function getProduct(
  slug: string,
  options?: { includeUnpublished?: boolean },
): Promise<Product | undefined> {
  const products = await getProducts(options);
  return products.find((product) => product.slug === slug);
}

export async function getProductsByCompany(
  companySlug: string,
  options?: { includeUnpublished?: boolean },
): Promise<Product[]> {
  const products = await getProducts(options);
  return products.filter((product) => product.companySlug === companySlug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured);
}

export async function getProductCompany(
  product: Product,
): Promise<Company | undefined> {
  return getCompany(product.companySlug);
}
