// test requires
AUI.add(
    'liferay-input-localized',
    function(A) {
    },
    '',
    {
        requires: ['aui-base', 'aui-form', 'aui-component', 'aui-event-input', 'aui-delayed-task', 'aui-set', 'aui-tooltip', 'liferay-form', 'portal-available-languages']
    }
);

// test provide
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
    ['aui-panel']
);