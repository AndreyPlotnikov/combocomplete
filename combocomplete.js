/**
 * Combocomplete - jqueryui widget which combines combobox and autocomplete concepts
 * Version 0.1
 * 
 * Copyright  (c) 2010-2011 Andrey Plotnikov
 * Licensed under BSD license.
 *
 * Depends:
 *    jquery.ui.core.js
 *    jquery.ui.widget.js
 *    jquery.ui.position.js
 *    jquery.ui.autocomplete.js
 *    jquery.ui.button.js
 */

(function($) {

    var modes = { view : 0, select : 1 };

    $.widget("ui.combocomplete", {
	options: {
	    appendTo: "body",
	    delay: 300,
	    minLength: 1,
	    position: {
		my: "left top",
		at: "left bottom",
		collision: "none"
	    },
	    source: null,
	    value : null,
	    empty_label : "select..."
	},

	_create : function() {

	    var self = this;
	    this.element.addClass("ui-combocomplete ui-widget");

	    this.label_btn = $('<button></button')
		.addClass('ui-combocomplete-label')
		.button({label : self._get_label()})
		.click(function(){ self._select_mode();})
		.appendTo(this.element);

	    this.select_box = $('<span></span>')
		.addClass('ui-combocomplete-select')
		.addClass('ui-widget')
		.addClass('ui-state-default')
		.addClass('ui-corner-all')
		.appendTo(this.element);

	    $('<span class="ui-combocomplete-text">text</span>').appendTo(this.select_box);

	    this.autocomplete = $('<input>')
		.autocomplete({ source : this.options.source,
				delay : this.options.delay,
				minLength : this.options.minLength,
				position : this.options.positions,
				appendTo : this.options.appendTo
			      })
		.appendTo(this.select_box)
		.bind('autocompleteselect', function(event, ui) {
		    if (false !== self._trigger("select", event, { item: ui.item })){
			self.options.value = ui.item;
			self._set_value();
		    }
		});

	    this.switch_btn = $('<button></button')
		.button({ text : false,
			  label : 'switch button',
			  icons : { primary : 'ui-icon-triangle-1-s' }})
		.click(function(){self._switch_mode()})
		.appendTo(this.element);

	    this.hidden = $('<input type="hidden">')
		.attr('name', this.element.attr('name'))
		.appendTo(this.element);

	    if (this.options.value != null) {
		this.hidden.val(this.options.value.id);
	    }
	    this._view_mode();

	},

	_view_mode : function() {
	    this._mode = modes.view;
	    this.select_box.hide();
	    this.label_btn.button("option", "label", this._get_label());
	    this.label_btn.show();
	    this.switch_btn.button('option', 'icons', { primary : 'ui-icon-triangle-1-s' });
	},


	_select_mode : function() {
	    this._mode = modes.select;
	    this.label_btn.hide();
	    this.autocomplete.val('');
	    this.select_box.show();
	    this.switch_btn.button('option', 'icons', { primary : 'ui-icon-triangle-1-n' });
	    this.autocomplete.focus();
	},

	_switch_mode : function() {
	    if (this._mode == modes.view) {
		this._select_mode();
	    } else {
		this._view_mode();
	    }
	},

	_get_label : function() {
	    return this.options.value == null ? this.options.empty_label : this.options.value.label;
	},

	_set_value : function() {
	    this.hidden.val(this.options.value.id);
	    this._view_mode();
	},

	_setOption: function( key, value ) {
	    $.Widget.prototype._setOption.apply( this, arguments );
	    if ( key === "value" ) {
		this._set_value();
	    }

	}

	    
    });

})(jQuery)