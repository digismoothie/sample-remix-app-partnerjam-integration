# Sample PartnerJam remix app for attribution and app subscription discount

## Attribution

For app attribution we have put a code snippet to root.tsx file with APP_ID parameter.

[app/root.tsx](app/root.tsx)

```jsx
<script type="application/javascript" dangerouslySetInnerHTML={{__html: `
  (function(d,o) {
    var sc="https://cdn.partnerjam.com/sdk/pj.umd.js",
    h=d.getElementsByTagName('head')[0],s=d.createElement('script');
    s.async=true;s.charset='utf-8';s.type='text/javascript';
    s.onload=function(){PJ.init(o)};s.src=sc;h.appendChild(s);
    })(document, {
      appId: 123456789, // <-- Shopify APP_ID (REQUIRED)
  });
`}}/>
```

### Example of all options
```jsx
<script type="application/javascript" dangerouslySetInnerHTML={{__html: `
  (function(d,o) {
    var sc="https://cdn.partnerjam.com/sdk/pj.umd.js",
    h=d.getElementsByTagName('head')[0],s=d.createElement('script');
    s.async=true;s.charset='utf-8';s.type='text/javascript';
    s.onload=function(){PJ.init(o)};s.src=sc;h.appendChild(s);
    })(document, {
      debug: true,
      appId: 123456789, // <-- Shopify APP_ID (REQUIRED)
      onComplete: function() {
        console.log("onComplete");
      },
  });
`}}/>
```

### Options

| KEY        | REQUIRED | TYPE     |  DESCRIPTION                             |
|------------|----------|----------|------------------------------------------|
| appId      | required | INT      | Shopify App ID                           | 
| debug      | optional | BOOLEN   | enables debugging messages to JS console |
| onComplete | optional | FUNCTION | Called when attribution was finished     | 


When a client opens our application, this snippet creates a browser fingerprint and automatically sends it to PartnerJam with the myshopify domain.

### Advanced

For the attribution you can call the PJ Init function from the window object.

```html
<script type="application/javascript" src="https://cdn.partnerjam.com/sdk/pj.umd.js"></script>

<script type="text/javascript">
  window.PJ.init({
    debug: true,
    appId: 123456789,
    onComplete: function() {
      console.log("onComplete");
    },
  });
</script>
```

## Subscription discount

⚠️ To get the value of the discount, you must first make the [[attribution described above]](#Attribution). You can make sure that attribution was finished by subscribing to `onComplete ` callback

If we provide an discount for new users comming from PartnerJam we have to send request to PartnerJam with myshopify domain and our APP_ID.

This request return amount of discount if myshopify domain with APP_ID exists in PartnerJam database.

[app/app.upgrade.ts](app/routes/app.upgrade.ts)

```ts
const fetchPartnerjamDiscount = async (myshopifyDomain: string) => {
  const discountCheckUrl = "https://be-app.partnerjam.com/api/v1/discount-check/";
  const params = {
    app_id: "123456789",
    myshopify_domain: myshopifyDomain,
  };
  const res = await fetch(`${discountCheckUrl}?${new URLSearchParams(params)}`);
  const data = await res.json();
  const discount = data.discount;
  return discount > 0 ? discount / 100 : 1;
};
```

After getting a discount from PartnerJam, we can create a subscription plan.

[app/app.upgrade.ts](app/routes/app.upgrade.ts)

```ts
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
```
