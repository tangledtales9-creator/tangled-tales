# Tangled Tales website

A complete, ready-to-open website for a handmade crochet shop. No build step and no server needed: unzip it and open `index.html` in your browser.

## Website summary

**What it is:** a friendly online shop and portfolio for Tangled Tales, selling handmade crochet amigurumi, wearables and home pieces, with custom orders.

**Who it is for:** customers who want a handmade, gift-worthy crochet piece, or a custom piece made for them.

**Main goals:**
1. Show the products clearly and make them easy to order.
2. Bring in custom orders, which are the most valuable sales for a handmade shop.
3. Build trust with your story, care guide, FAQ and easy ways to reach you.

**Look and feel:** warm cream and blush backgrounds, coral and gold accents from the logo, Lora headings (same as the logo wordmark) and Nunito body text. A wavy coral "thread" runs between sections and the stitched dashed line from the logo is used as a divider. Works on phones, tablets and desktops, and switches to a dark theme automatically on devices set to dark mode.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, featured pieces, custom-order teaser, story, email signup |
| Shop | `shop.html` | All six products with category filters |
| Product pages | `product-*.html` | Photo, price, description, size, materials, care, related pieces |
| Custom orders | `custom-orders.html` | How it works, what can be customised, request form |
| Our story | `our-story.html` | Your story, values and a care guide |
| Contact and FAQ | `contact.html` | Message form, WhatsApp, email, Instagram, six common questions |
| Cart | `cart.html` | Cart review and one-tap ordering |

## How ordering works

This site has no payment system. It is built so a small shop can start selling right away:

1. The customer adds pieces to the cart (saved in their own browser).
2. On the cart page they enter their name and delivery address and press **Order on WhatsApp** or **Order by email**.
3. Their WhatsApp or email app opens with the full order already written out. They press send.
4. You confirm the total, delivery and payment (for example UPI) with them directly.

The custom-order and contact forms work the same way.

## Set it up in 5 minutes

1. Open `js/config.js` and change your email, WhatsApp number (country code and number, digits only, for example `919876543210`) and Instagram handle. Every page updates automatically.
2. Replace the sample text: your story on `our-story.html`, plus the delivery, payment and returns answers in the FAQ on `contact.html`.
3. Replace the illustrated product pictures with your own photos. Put them in the `images` folder and change the file names in the product pages (search for `images/`). Square photos work best.
4. Change prices and descriptions in each page, or ask Claude to regenerate the pages with your real products.

## Sample content to replace

Everything below is placeholder copy, written to show how the site reads:

- Product names, prices (in rupees), sizes, materials and care details
- The "Please note" child-safety line on products with small parts (keep it if it applies to yours)
- The story, values and "3 to 5 days" and "2 to 3 weeks" timings
- The payment methods and returns policy in the FAQ
- The email address, WhatsApp number and Instagram handle

## Putting it online

Any static host works, and several are free: Netlify (drag the unzipped folder onto netlify.com/drop), GitHub Pages, Cloudflare Pages or Vercel. Connect your own domain name there, for example tangledtales.in.

## Growing later

- **Real checkout and online payments:** when you are ready, move the shop to Shopify, WooCommerce or Wix, or add Razorpay payment links. The design, colours and content here carry over.
- **Real email list:** the signup box currently emails you the address. Connect it to Mailchimp, Brevo or similar when you have a list to send to.
- **Search visibility:** add your real photos with descriptive alt text, and keep the page titles and descriptions up to date. Add a Google Business or Instagram link in the footer.

## Folder guide

```
index.html, shop.html, cart.html, ...   the pages
css/style.css                           all styling and brand colours
js/config.js                            your contact details (edit this)
js/main.js                              cart, filters, forms
images/                                 logo, favicon and product pictures
```

Fonts (Lora and Nunito) load from Google Fonts, so the pages need an internet connection to show them exactly. Without it, they fall back to Georgia and your system font.
