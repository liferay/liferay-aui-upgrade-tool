AUI.add(
	'liferay-input-localized',
	function(A) {
	},
	'',
	{
		requires: ['aui-base', 'aui-component', 'aui-event-input', 'aui-palette', 'aui-set', 'aui-tooltip', 'liferay-form', 'portal-available-languages']
	}
);



Liferay.provide(
	Util,
	'toggleDisabled',
	function(button, state) {
		if (!A.instanceOf(button, A.NodeList)) {
			button = A.all(button);
		}

		button.each(
			function(item, index, collection) {
				item.attr('disabled', state);

				item.toggleClass('disabled', state);
			}
		);
	},
	['aui-base']
);