import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,
} from "./utils.js"

import {initAllBookings} from "./pages/calendar/calendar.js";
import {initAccess} from "./pages/calendar/getAccess.js";
import {initAccess2} from "./pages/calendar/getAccess2.js";


window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templatePictures = await loadHtml("./pages/pictures/pictures.html")
  const templateCalendar= await loadHtml("./pages/calendar/calendar.html")
  const templateAccess= await loadHtml("./pages/calendar/get-access.html")
  const templateAccess2= await loadHtml("./pages/calendar/get-access-2.html")
  const templateActivities= await loadHtml("./pages/activities/activities.html")
  const templateAbout= await loadHtml("./pages/about/about.html")
  const templateGuides= await loadHtml("./pages/guides/guides.html")

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
      "/": () => renderTemplate(templateHome, "content")
      ,
      "/about": () => renderTemplate(templateAbout, "content"),
      "/pictures": () => renderTemplate(templatePictures, "content"),
      "/activities": () => renderTemplate(templateActivities, "content"),
      "/guides": () => renderTemplate(templateGuides, "content"),
      "/calendar": () => {
        renderTemplate(templateCalendar, "content")
        initAllBookings()
      },

      "/get-access": () => {
        renderTemplate(templateAccess, "content")
        initAccess()
      },
      "/get-access-2": () => {
        renderTemplate(templateAccess2, "content")
        initAccess2()
      },

    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)