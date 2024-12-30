
document.getElementById('exploreIcon').addEventListener('click', () => {
    const menus = document.getElementById('explore-menus');
    const isVisible = menus.getAttribute("visible") === "false";

    menus.classList.toggle("hide", !isVisible);
    menus.classList.toggle("flex", isVisible);
    menus.setAttribute("visible", isVisible);

    document.getElementById('explore').innerHTML = isVisible
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa fa-bars"></i>';

    document.getElementById('exploreIcon').title = isVisible
        ? "Show Extra Menus"
        : "Hide Extra Menus";
});

