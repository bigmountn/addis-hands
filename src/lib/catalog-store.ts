import { promises as fs } from "fs";
import path from "path";
import type { Company, Product } from "@/data/types";
import { fillLocalized } from "@/lib/localized";

export { fillLocalized };

const companiesPath = path.join(process.cwd(), "data", "companies.json");
const productsPath = path.join(process.cwd(), "data", "products.json");

async function writeJson(filePath: string, data: unknown) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function saveCompanies(companies: Company[]) {
  await writeJson(companiesPath, companies);
}

export async function saveProducts(products: Product[]) {
  await writeJson(productsPath, products);
}

export async function upsertCompany(company: Company) {
  const { getCompanies } = await import("./catalog");
  const companies = await getCompanies();
  const index = companies.findIndex((item) => item.slug === company.slug);
  if (index >= 0) {
    companies[index] = company;
  } else {
    companies.push(company);
  }
  await saveCompanies(companies);
  return company;
}

export async function deleteCompany(slug: string) {
  const { getCompanies, getProducts } = await import("./catalog");
  const companies = await getCompanies();
  const next = companies.filter((item) => item.slug !== slug);
  await saveCompanies(next);

  const products = await getProducts();
  const remaining = products.filter((item) => item.companySlug !== slug);
  if (remaining.length !== products.length) {
    await saveProducts(remaining);
  }
}

export async function upsertProduct(product: Product) {
  const { getProducts } = await import("./catalog");
  const products = await getProducts();
  const index = products.findIndex((item) => item.slug === product.slug);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  await saveProducts(products);
  return product;
}

export async function deleteProduct(slug: string) {
  const { getProducts } = await import("./catalog");
  const products = await getProducts();
  await saveProducts(products.filter((item) => item.slug !== slug));
}
