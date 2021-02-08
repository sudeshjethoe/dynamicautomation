/* https://ptc-it.de/enabling-cookie-consent-with-jekyll-minimal-mistakes/ */
window.cookieconsent.initialise({
	"palette": {
		"popup": {
			"background": "#343c66",
			"text": "#cfcfe8"
		},
		"button": {
			"background": "#f71559"
		}
	},
	"type": "opt-in",
	"content": {
		"message": "This website uses cookies to improve to optimize the user experience.",
		"dismiss": "No thanks",
		"allow": "Yes please",
		"link": "Learn more",
		"href": "https://dynamicautomation.nl/privacy/"
	},
	onInitialise: function (status) {
		var type = this.options.type;
		var didConsent = this.hasConsented();
		if (type == 'opt-in' && didConsent) {
			// enable cookies
			loadGAonConsent();
		}
		if (type == 'opt-out' && !didConsent) {
			// disable cookies
		}
	},
	onStatusChange: function(status, chosenBefore) {
		var type = this.options.type;
		var didConsent = this.hasConsented();
		if (type == 'opt-in' && didConsent) {
			// enable cookies
			loadGAonConsent();
		},
			if (type == 'opt-out' && !didConsent) {
				// disable cookies
			}
	},
	onRevokeChoice: function() {
		var type = this.options.type;
		if (type == 'opt-in') {
			// disable cookies
		}
		if (type == 'opt-out') {
			// enable cookies
			loadGAonConsent();
		}
	}
});

/* vim:set softtabstop=2 shiftwidth=2 tabstop=2 expandtab: */
