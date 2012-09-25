Ext.define('ExampleModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
			'name'
		]
    }
});

Ext.define("ExampleView", {
    extend: 'Ext.Panel',
    requires: [
        'Ext.ux.data.proxy.PagingLocalStorage'
    ],
    config: {
		layout: 'fit',
        items: [
            {
                xtype: 'list',
				itemTpl: '<div>name: {name} [id: {id}]</div>',
				store: {
					autoLoad: false,
					storeId: 'Example',
					model: 'ExampleModel',
					proxy: {
						type: 'localstoragepaging',
						id: 'example'
					},
					pageSize: 2,
					clearOnPageLoad: false
				},
				plugins: [
					{
						xclass: 'Ext.plugin.ListPaging',
						autoPaging: false
					}
				],
				listeners: {
					initialize: function () {
						var store = this.getStore();
						if (! store.isLoaded() ) {
							store.load();
						}
						if (store.getAllCount() === 0) {
							alert("First load? Populating localStorage with models. Won't page until refresh.");
							store.add([
								{name: 'One'},
								{name: 'Two'},
								{name: 'Three'},
								{name: 'Four'},
								{name: 'Five'},
								{name: 'Six'},
								{name: 'Seven'},
							]);
							store.sync();
						}
					},
				},
			}
		]
    }
});
