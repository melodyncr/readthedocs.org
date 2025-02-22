/*
 * Sphinx builder specific JS code.
 */


var rtddata = require('./rtd-data');
var sphinx_theme;


function init() {
    var rtd = rtddata.get();

    /// Click tracking on flyout
    document.addEventListener('click', function () {
        var flyout_state = $("[data-toggle='rst-versions']").hasClass('shift-up') ? 'was_open' : 'was_closed';

        // Only report back if analytics is enabled
        if (typeof READTHEDOCS_DATA !== 'undefined' && READTHEDOCS_DATA.global_analytics_code) {
            // This needs to handle old style legacy analytics for previously built docs
            // as well as the newer universal analytics and Google Site Tag
            if (typeof gtag !== 'undefined') {
                // https://developers.google.com/analytics/devguides/collection/gtagjs/events
                gtag('event', 'Click', {
                    'event_category': 'Flyout',
                    'event_label': flyout_state,
                    'send_to': 'rtfd'
                });
            } else if (typeof ga !== 'undefined') {
                ga('rtfd.send', 'event', 'Flyout', 'Click', flyout_state);
            } else if (typeof _gaq !== 'undefined') {
                _gaq.push(
                    ['rtfd._setAccount', 'UA-17997319-1'],
                    ['rtfd._trackEvent', 'Flyout', 'Click', flyout_state]
                );
            }
        }
    });

    /// Inject the Read the Docs Sphinx theme code
    /// This is necessary on older versions of the RTD theme (<0.4.0)
    /// and on themes other then the RTD theme (used for the version menu)
    if (window.SphinxRtdTheme === undefined) {
        sphinx_theme = require('sphinx-rtd-theme');  // eslint-disable-line global-require

        var theme = sphinx_theme.ThemeNav;

        // Enable the version selector (flyout) menu
        // This is necessary for 3rd party themes
        $(document).ready(function () {
            setTimeout(function () {
                if (!theme.navBar) {
                    theme.enable();
                }
            }, 1000);
        });

        if (rtd.is_rtd_like_theme()) {
            // Add a scrollable element to the sidebar on the RTD sphinx theme
            // This fix is for sphinx_rtd_theme<=0.1.8
            var navBar = $('div.wy-side-scroll:first');
            if (!navBar.length) {
                console.log('Applying theme sidebar fix...');
                var navInner = $('nav.wy-nav-side:first');
                var navScroll = $('<div />')
                        .addClass('wy-side-scroll');

                navInner
                    .children()
                    .detach()
                    .appendTo(navScroll);
                navScroll.prependTo(navInner);

                theme.navBar = navScroll;
            }
        }
    }
}


module.exports = {
    init: init
};
