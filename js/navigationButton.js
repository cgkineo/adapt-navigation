define([
    'coreJS/adapt'
],function(Adapt) {

    var NavigationButtonView = Backbone.View.extend({

        initialize: function() {
            this.preRender();
        },

        preRender: function() {
            Adapt.trigger('navigationButtonView:preRender', this);
            this.render();
        },

        render: function() {
            var template = Handlebars.templates[this.template];
            this.$el = $(template(this.model.toJSON()));
            this.el = this.$el[0];
            this.$el.appendTo('.navigation > .navigation-inner');
            _.defer(_.bind(function() {
                Adapt.trigger('navigationButtonView:postRender', this);
            }, this));
            return this;
        },

        template: "navigationButton"

    });

    return NavigationButtonView;
    

});
