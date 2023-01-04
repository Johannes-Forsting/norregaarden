import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,
} from "./utils.js"

import {initAllProducts} from "./pages/products/getAllProducts.js";
import {initProduct} from "./pages/products/singleProduct.js";

import {initAllDeliveries} from "./pages/deliveries/getAllDeliveries.js";
import {initDelivery} from "./pages/deliveries/singleDelivery.js";

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")

  const templateAllProducts = await loadHtml("./pages/products/get-all-products.html")
  const templateSingleProduct = await loadHtml("./pages/products/single-product.html")

  const templateAllDeliveries = await loadHtml("./pages/deliveries/get-all-deliveries.html")
  const templateSingleDelivery = await loadHtml("./pages/deliveries/single-delivery.html")

  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  router
      .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/products": () => {
        renderTemplate(templateAllProducts, "content")
        initAllProducts()
      },
      "/deliveries": () => {
        renderTemplate(templateAllDeliveries, "content")
        initAllDeliveries()
      },
      "/single-product": (match) => {
        renderTemplate(templateSingleProduct, "content")
        initProduct(match)
      },
      "/single-delivery": (match) => {
        renderTemplate(templateSingleDelivery, "content")
        initDelivery(match)
      }

    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)