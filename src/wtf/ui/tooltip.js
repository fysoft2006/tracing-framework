/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Tooltip control.
 *
 * @author rsturgell@google.com (Ryan Sturgell)
 */

goog.provide('wtf.ui.Tooltip');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.style');



/**
 * Tooltip control.
 *
 * @param {!goog.dom.DomHelper} dom DOM helper.
 * @constructor
 * @extends {goog.Disposable}
 */
wtf.ui.Tooltip = function(dom) {
  goog.base(this);

  /**
   * DOM helper.
   * @type {!goog.dom.DomHelper}
   * @private
   */
  this.dom_ = dom;

  /**
   * Root control UI.
   * @type {!Element}
   * @private
   */
  this.rootElement_ = this.createDom(this.dom_);
  goog.style.setUnselectable(this.rootElement_, true);

  /**
   * Whether the tooltip is visible.
   * @type {boolean}
   * @private
   */
  this.visible_ = false;

  var body = dom.getDocument().body;
  goog.asserts.assert(body);
  this.dom_.appendChild(body, this.rootElement_);
};
goog.inherits(wtf.ui.Tooltip, goog.Disposable);


/**
 * @override
 */
wtf.ui.Tooltip.prototype.disposeInternal = function() {
  if (this.visible_) {
    goog.array.remove(wtf.ui.Tooltip.allVisibleTooltips_, this);
  }
  this.dom_.removeNode(this.rootElement_);
  goog.base(this, 'disposeInternal');
};


/**
 * Creates the control UI DOM.
 * @param {!goog.dom.DomHelper} dom DOM helper.
 * @return {!Element} Control UI.
 * @protected
 */
wtf.ui.Tooltip.prototype.createDom = function(dom) {
  var el = dom.createElement(goog.dom.TagName.DIV);
  goog.style.showElement(el, false);
  goog.dom.classes.add(el, goog.getCssName('uiTooltip'));
  return el;
};


/**
 * Gets a value indicating whether the tooltip is currently visible.
 * @return {boolean} True if the tooltip is visible.
 */
wtf.ui.Tooltip.prototype.isVisible = function() {
  return this.visible_;
};


/**
 * Show the tooltip at the given location.
 * @param {number} x Parent-relative X, in DOM units.
 * @param {number} y Parent-relative Y, in DOM units.
 * @param {string} content Tooltip content.
 */
wtf.ui.Tooltip.prototype.show = function(x, y, content) {
  var el = this.rootElement_;
  goog.dom.setTextContent(el, content);
  goog.style.setStyle(el, {
    'left': x + 10 + 'px',
    'top': y + 10 + 'px'
  });
  goog.style.showElement(el, true);

  if (!this.visible_) {
    wtf.ui.Tooltip.allVisibleTooltips_.push(this);
  }
  this.visible_ = true;
};


/**
 * Updates the tooltip content if visible.
 * @param {string} content Tooltip content.
 */
wtf.ui.Tooltip.prototype.update = function(content) {
  if (!this.visible_) {
    return;
  }
  var el = this.rootElement_;
  goog.dom.setTextContent(el, content);
};


/**
 * Hides the tooltip.
 */
wtf.ui.Tooltip.prototype.hide = function() {
  if (!this.visible_) {
    return;
  }
  this.visible_ = false;
  goog.array.remove(wtf.ui.Tooltip.allVisibleTooltips_, this);
  goog.style.showElement(this.rootElement_, false);
};


/**
 * All tooltips that are currently visible.
 * @type {!Array.<!wtf.ui.Tooltip>}
 * @private
 */
wtf.ui.Tooltip.allVisibleTooltips_ = [];


/**
 * Hide all tooltips.
 */
wtf.ui.Tooltip.hideAll = function() {
  var allVisible = wtf.ui.Tooltip.allVisibleTooltips_;
  wtf.ui.Tooltip.allVisibleTooltips_ = [];
  for (var n = 0; n < allVisible.length; n++) {
    allVisible[n].hide();
  }
};
