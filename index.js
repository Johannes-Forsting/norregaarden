import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"
import {load} from "./pages/cars/cars.js";
import {start} from "./pages/pagination/pagination.js";

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templateCars = await loadHtml("./pages/cars/cars.html")
  const templatePaginationCars = await loadHtml("./pages/pagination/pagination.html")

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
      "/cars": () => {
        renderTemplate(templateCars, "content")
        load()
      },
      "/pagination": () => {
        renderTemplate(templatePaginationCars, "content")
        start(0)
      }

    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)