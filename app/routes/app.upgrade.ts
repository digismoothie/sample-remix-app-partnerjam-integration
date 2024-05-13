import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN, MONTHY_PLAN_AMOUNT } from "~/shopify.server";

const fetchPartnerjamDiscount = async (myshopifyDomain: string) => {
  const discountCheckUrl = "https://be-app.partnerjam.com/api/v1/discount-check/";
  const params = {
    app_id: "2525233",
    myshopify_domain: myshopifyDomain,
  };
  const res = await fetch(`${discountCheckUrl}?${new URLSearchParams(params)}`);
  const data = await res.json();
  const discount = data.discount;
  return discount > 0 ? discount / 100 : 1;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  const { shop } = session;
  const partnerjamDiscount = await fetchPartnerjamDiscount(shop);
  const amount = MONTHY_PLAN_AMOUNT * partnerjamDiscount;
  await billing.request({
    amount,
    isTest: true,
    plan: MONTHLY_PLAN,
  });
};
