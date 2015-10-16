define(function() {
	return [
        {
            "_name": "graphic",
            "_isEnabled": true,
            "_classes": "base navigation-graphic",
            "_layout": "center",
            "_sizes": "medium large",
            "_locations": "course menu page",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_name": "text",
            "_isEnabled": true,
            "_classes": "base navigation-text",
            "_layout": "center",
            "_sizes": "medium large",
            "_locations": "course menu page",
            "text": "Adapt Learning",
            "ariaLabel": "Adapt Learning",
        },
        {
            "_name": "back",
            "_isEnabled": true,
            "_classes": "base navigation-back-button",
            "_iconClasses": "icon icon-controls-small-left",
            "_dataEvent": "backButton",
            "_showTooltip": true,
            "_layout": "left",
            "_sizes": "small medium large",
            "_locations": "menu page",
            "tooltip": "Back",
            "ariaLabel": "Back"
        },
        {
            "_name": "home",
            "_isEnabled": true,
            "_classes": "base navigation-menu-button",
            "_iconClasses": "icon icon-home",
            "_layout": "left",
            "_sizes": "small medium large",
            "_locations": "menu page",
            "_showTooltip": true,
            "_dataEvent": "homeButton",
            "tooltip": "Home",
            "ariaLabel": "Home"
        },
        {
            "_name": "parent",
            "_isEnabled": true,
            "_classes": "base navigation-parent-button",
            "_iconClasses": "icon icon-controls-small-up",
            "_layout": "left",
            "_sizes": "small medium large",
            "_locations": "menu page",
            "_showTooltip": true,
            "_dataEvent": "parentButton",
            "tooltip": "Parent",
            "ariaLabel": "Parent"
        },
        {
            "_name": "drawer",
            "_isEnabled": true,
            "_classes": "base navigation-drawer-toggle-button",
            "_iconClasses": "icon icon-list",
            "_dataEvent": "toggleDrawer",
            "_showTooltip": true,
            "_layout": "right",
            "_sizes": "small medium large",
            "_locations": "course menu page",
            "tooltip": "Drawer",
            "ariaLabel": "Open course resources."
        },
        {
            "_name": "pageLevelProgress",
            "_classes": "base page-level-progress-navigation",
            "_isEnabled": true,
            "_layout": "right",
            "_sizes": "small medium large",
            "_locations": "page",
            "_showTooltip": true,
            "tooltip": "Progress"
        }
    ];
});