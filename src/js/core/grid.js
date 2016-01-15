import $ from 'jquery';
import {extend, matchHeights, stackMargin, debounce} from '../util/index';

let grids = [];

$(window).on('load resize orientationchange', e => {
    grids.forEach(grid => {
        grid.check();
    });
});


export default function(UI) {

    UI.webcomponent('grid', {

        props: {
            margin  : 'uk-grid-margin',
            match   : false,
            rowfirst: 'uk-grid-first'
        },

        methods: {

            $attached() {
                this.check();
                grids.push(this);
            },

            check() {

                this.columns = this.$el.children();

                if (this.match) this.matcher();
                if (this.margin) this.margins();

                if (!this.rowfirst) {
                    return this;
                }

                // Mark first column elements
                let pos_cache = this.columns.removeClass(this.rowfirst).filter(':visible').first().position();

                if (pos_cache) {

                    let $this = this;

                    this.columns.each(function() {
                        $(this)[$(this).position().left == pos_cache.left ? 'addClass':'removeClass']($this.rowfirst);
                    });
                }
            },

            matcher(){

                if (this.match) {

                    let children     = this.columns;
                    let firstvisible = children.filter(":visible:first");

                    if (!firstvisible.length) return;

                    let elements = this.match === true ? children : this.$find(this.match);
                    let stacked  = Math.ceil(100 * parseFloat(firstvisible.css('width')) / parseFloat(firstvisible.parent().css('width'))) >= 100;

                    if (stacked && !this.ignorestacked) {
                        elements.css('min-height', '');
                    } else {
                        matchHeights(elements, this.options);
                    }
                }

                return this;
            },

            margins() {

                if (this.margin) {
                    stackMargin(this.columns, {margin: this.margin});
                }

                return this;
            }
        }

    });

}
