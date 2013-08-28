},
{
 handler1: function() {
}

instance._toolbar = new A.Toolbar(
    {
        boundingBox: instance._userToolbar,
        children: [
            {
                // This handler will be changed to on click
                handler: function(event) {
                    instance._editEntry(contact);
                },
                icon: 'edit'
            },
            {
                // This handler will no more be left alone
                handler: function(event) {
                    instance._deleteEntry(contact);
                },
                icon: 'delete'
            }
        ]
    }
).render();


.push(
    {
        icon: 'add1',
        label: 'button1',
        handler: function(event1) {
            someFunction1();
        },
        test123: 'this is a test'
    }

.push(
    {
        icon: 'add2',
        label: 'button2',
        handler: function(event2) {
            someFunction2();
        }
    }


= [
    {
        icon: 'add3',
        label: 'button3',
        handler: function(event3) {
            someFunction3();
        }
    }
];


= [
    {
        icon: 'add4',
        label: 'button4',
        handler: function(event4) {
            function alabala() {
                function nica() {
                }
            }
        },
        function() {
            var test ='werqwre';
        }
    }
];

new A.Toolbar(
    {
        children: [
            {
                handler: function(event) {
                    instance._editEntry(contact);
                },
                icon: 'edit',
                label: 'label'
            }
        ]
    }
).render();