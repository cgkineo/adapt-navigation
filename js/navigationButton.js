define([
    'coreJS/adapt'
],function(Adapt) {

    var NavigationButtonView = Backbone.View.extend({

        initialize: function(options) {
            this.$parent = options.$parent;
            this.$el = null; //clear backbone div

            this.preRender();
        },

        preRender: function() {
            Adapt.trigger('navigationButtonView:preRender', this);
            this.render();
        },

        render: function() {
            var template = Handlebars.templates["navigationButton-"+this.model.get("_pluginName")];

            //replace current element or add new element to navigation bar

            var $old = this.$el;
            this.$el = $(template(this.model.toJSON()));
            this.el = this.$el[0];
            if ($old) {
                $old.replaceWith(this.$el);
            } else {
                this.$el.appendTo(this.$parent);
            }

            _.defer(_.bind(function() {
                Adapt.trigger('navigationButtonView:postRender', this);
            }, this));
            return this;
        },

        template: "navigationButton"

    });

    return NavigationButtonView;
    

});
