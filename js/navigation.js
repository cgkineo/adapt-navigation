define([
    'coreJS/adapt',
    'coreViews/navigationView',
    './navigationButton',
    './defaultSettings'
],function(Adapt, NavigationView, NavigationButtonView, defaultSettings) {

    _.extend(NavigationView.prototype, {

        className: "navigation",

        events: {
            'click button':'triggerEvent'
        },

        initialize: function() {
            this.setupConfig()
            this.preRender();
            this.setupEventListeners();
        },

        layouts: [],
        setupConfig: function() {
            this.layouts.push ( Adapt.course.get("_navigationLayout") || defaultSettings );
            this.globals = Adapt.course.get("_globals");
        },

        preRender: function() {
            Adapt.trigger('navigationView:preRender', this);
            this.render();
        },

        render: function() {
            var template = Handlebars.templates[this.template]
            this.$el.html(template({_globals: Adapt.course.get("_globals")})).appendTo('#wrapper');
            this.createCoreChildren();
            _.delay(_.bind(function() {
                Adapt.trigger('navigationView:postRender', this);
            }, this), 250);
            return this;
        },

        createCoreChildren: function() {
            var current = this.getCurrentLayout();
            var items = this.getLayoutItems(current);
            items = _.where(items, { _type: "_core"} );
            for (var i = 0, l = items.length; i < l; i++) {
                new NavigationButtonView({ model: new Backbone.Model(items[i]) });
            }
        },

        getCurrentLayout: function() {
            return this.layouts[this.layouts.length -1 ];
        },

        getLayoutItems: function(layout) {
            for (var i = 0, l = layout.length; i < l; i++) {
                var item = layout[i];
                var globals = {};
                switch (item._pluginName) {
                case "text": case "back": case "drawer": case "home": case "graphic":
                    globals = _.findWhere(defaultSettings, {_pluginName: item._pluginName}) || {};
                    item._type = "_core";
                    break;
                default:
                    var k = "_extensions";
                    var e = "_"+item._pluginName;
                    if (this.globals[k] && this.globals[k][e]) {
                        globals = this.globals[k][e];
                    }
                    item._type = k;
                    item._plugin = e;
                }
                item._index = item._index === undefined ? globals._index === undefined ? i : globals._index : item._index;
                item._classes = item._classes || globals._classes;
                item._iconClasses = item._iconClasses || globals._iconClasses;
                item._layout = item._layout || globals._layout;
                item._sizes = item._sizes || globals._sizes;
                item._dataEvent = item._dataEvent || globals._dataEvent;
                item.tooltip = item.tooltip || globals.tooltip;
                item.ariaLabel = item.ariaLabel || globals.ariaLabel;
                item.text = item.text || globals.text;
            }
            return layout;
        },

        setupEventListeners: function() {
            this.listenTo(Adapt, 'router:location', this.onSectionLoading);
            this.listenTo(Adapt, 'menuView:ready pageView:ready pluginView:ready', this.onSectionLoaded);

            this.listenTo(Adapt, 'navigation:addLayout', this.addLayout);
            this.listenTo(Adapt, 'navigation:updateLayout', this.updateLayout);
            this.listenTo(Adapt, 'navigation:removeLayout', this.removeLayout);
        },

        onSectionLoading: function(location) {
            this.$el.hide();
            this.hideNavigationButton(location);
        },

        hideNavigationButton: function(location) {
            if (location._currentLocation === "course") {
                $('.navigation-back-button').addClass('display-none');
            } else {
                this.showNavigationButton();
            }
        },

        showNavigationButton: function() {
            $('.navigation-back-button').removeClass('display-none');
        },

        onSectionLoaded: function() {
            this.getCurrentLayout().$elements = this.removeCurrentElements();
            this.drawLayout();
            this.generateCurrentLayoutStylesheet();
            this.$el.fadeIn('fast');
        },

        removeCurrentElements: function() {
            var $elements = this.getCurrentElements();
            $elements.detach();
            return $elements;
        },

        getCurrentElements: function() {
           return this.$(".navigation-inner, .navigation-center").children(":not(.aria-label, .navigation-center)");
        },

        drawLayout: function() {
            var $elements = this.getCurrentLayout().$elements;

            var sortedElements = this.sortElements($elements);

            this.injectTooltips(this.getCurrentLayout(), $elements);

            this.generateCurrentLayoutStylesheet();

            //sort elements here
            this.$(".navigation-inner").append(sortedElements.$lefts);
            this.$(".navigation-center").append(sortedElements.$centers);
            this.$(".navigation-inner").append(sortedElements.$rights);
        },

        sortElements: function($elements) {

            var currentLayout = this.getCurrentLayout();
            var layoutItems = this.getLayoutItems(currentLayout);

            var lefts = _.where(layoutItems, { _layout: "left"});
            var centers = _.where(layoutItems, { _layout: "center"});
            var rights = _.where(layoutItems, { _layout: "right"});

            lefts.sort(function(a,b) {
                return a._index - b._index;
            });
            centers.sort(function(a,b) {
                return a._index - b._index;
            });
            rights.sort(function(a,b) {
                return b._index - a._index;
            });


            var $lefts = $([]);
            var $centers = $([]);
            var $rights = $([]);

            for (var i = 0, l = lefts.length; i < l; i++) {
                var item = lefts[i];
                var selector = "."+item._classes.split(" ").join(".");
                var $selected = $elements.filter(selector);
                if ($selected.length === 0) continue;
                $lefts.push($elements.filter(selector)[0]);
            }
            for (var i = 0, l = centers.length; i < l; i++) {
                var item = centers[i];
                var selector = "."+item._classes.split(" ").join(".");
                var $selected = $elements.filter(selector);
                if ($selected.length === 0) continue;
                $centers.push($elements.filter(selector)[0]);
            }
            for (var i = 0, l = rights.length; i < l; i++) {
                var item = rights[i];
                var selector = "."+item._classes.split(" ").join(".");
                var $selected = $elements.filter(selector);
                if ($selected.length === 0) continue;
                $rights.push($elements.filter(selector)[0]);
            }

            return { 
                $lefts: $lefts, 
                $centers: $centers, 
                $rights: $rights
            };

        },

        injectTooltips: function(items, $elements) {
            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i];
                var selector = "."+item._classes.split(" ").join(".");
                var $selected = $elements.filter(selector);
                if ($selected.length === 0) continue;
                if (item._type == "_extensions") {
                    var $tooltip = $selected.find(".tooltip");
                    if ($tooltip.length !== 0) continue;
                    $selected.append($("<div class='tooltip'>"+item.tooltip+"</div>"));
                }
            }

        },

        generateCurrentLayoutStylesheet: function() {
            var items = this.getLayoutItems(this.getCurrentLayout());

            var cssStyling = "";

            for (var i = 0, l = items.length; i < l; i++) {
                if (!items[i]._isEnabled) {
                    cssStyling += ".navigation > .navigation-inner ." + items[i]._classes.split(" ").join(".") + "{ display: none; } \n";
                } else if (items[i]._sizes) {
                    var showSizes = items[i]._sizes.split(" ");
                    var hideSizes = _.difference(['small', 'medium', 'large'],showSizes);
                    if (hideSizes.length === 0) continue;
                    for (var s = 0, sl = hideSizes.length; s < sl; s++) {
                        cssStyling += ".size-" + hideSizes[s] + " .navigation > .navigation-inner ." + items[i]._classes.split(" ").join(".") + " { display: none; } \n"; 
                    }
                    
                }
                if (items[i]._type == "_extensions") {
                    var floatValue = items[i]._layout == "right" ? "right" : items[i]._layout == "center" ? "none": "left";
                    cssStyling += ".navigation > .navigation-inner ." + items[i]._classes.split(" ").join(".") + "{ float: "+floatValue+"; } \n";
                }
            }

            this.$("> style").html(cssStyling);
        },

        triggerEvent: function(event) {
            event.preventDefault();
            var currentEvent = $(event.currentTarget).attr('data-event');
            Adapt.trigger('navigation:' + currentEvent);
        },

        addLayout: function(layout) {
            layout = layout || {};

            var oldlayout = this.getCurrentLayout();
            oldlayout.$elements = this.removeCurrentElements();
            

            if (layout instanceof Array) {
                var merged = this.getMergedLayouts();
                var items = this.getLayoutItems(merged);

                var arr = layout;
                layout = {};

                if (items.length > 0 ) {
                    for (var i = 0, l = items.length; i < l; i++) {
                        var item = items[i];
                        var isEnabled = _.contains(arr, item._pluginName );
                        layout[item._type] = layout[item._type] || {};
                        layout[item._type][item._plugin] = _.extend({}, item, {_isEnabled:isEnabled});
                    }
                }
            }

            this.layouts.push(layout);

            this.pullElementsIntoLayout(layout);

            this.drawLayout();
        },

        updateLayout: function(layout) {
            layout = layout || {};

            this.layouts.pop();
            this.layouts.push(layout);

            layout.$elements = this.removeCurrentElements();
            
            if (layout instanceof Array) {
                var merged = this.getMergedLayouts();
                var items = this.getLayoutItems(merged);

                var arr = layout;
                layout = {};

                if (items.length > 0 ) {
                    for (var i = 0, l = items.length; i < l; i++) {
                        var item = items[i];
                        var isEnabled = _.contains(arr, item._pluginName );
                        layout[item._type] = layout[item._type] || {};
                        layout[item._type][item._plugin] = _.extend({}, item, {_isEnabled:isEnabled});
                    }
                }
            }

            this.pullElementsIntoLayout(layout);

            this.drawLayout();
        },

        getMergedLayouts: function() {
            var merged = {};
            for (var i = 0, l = this.layouts.length; i < l; i++) {
                for (var k in this.layouts[i]) {
                    merged[k] = merged[k] || {};
                    _.extend(merged[k], this.layouts[i][k]);
                }
            }
            return merged;
        },

        pullElementsIntoLayout: function(toLayout) {
            var $allElements = $(this.getAllLayoutElements());

            var items = this.getLayoutItems(toLayout);

            if (!toLayout.$elements) toLayout.$elements = $([]);

            for (var i = 0, l = items.length; i < l; i++) {
                if (items[i]._isEnabled) {
                    if (!items[i]._classes) continue;
                    var $element = $allElements.filter("."+items[i]._classes.split(" ").join("."));
                    if ($element.length === 0) continue;
                    toLayout.$elements.push($element[0]);
                }
            }

        },

        getAllLayoutElements: function() {
            var $elementsArr = _.pluck(this.layouts, "$elements");

            return _.reduce($elementsArr, function(memo, $item) {
                if ($item === undefined) return memo;
                return memo.concat($item.toArray());
            }, []);
        },

        removeLayout: function() {
            if (this.layouts.length <= 1) return;

            this.getCurrentLayout().$elements = this.removeCurrentElements();

            this.layouts.pop();

            this.drawLayout();
        },

        template: "navigation-alternative"

    });

});
