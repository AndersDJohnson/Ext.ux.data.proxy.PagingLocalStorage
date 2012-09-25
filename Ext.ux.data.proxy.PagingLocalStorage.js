/**
 * @author Anders D. Johnson <AndersDJohnson atsign gmail dot com>
 * 
 * See: https://github.com/AndersDJohnson/Ext.ux.data.proxy.PagingLocalStorage
 * 
 * @aside guide proxies
 * 
 * PagingLocalStorageProxy is a subclass of {@link Ext.data.proxy.LocalStorage LocalStorage} proxy
 * that implements paging for a {@link Ext.data.Store Store}. Useful when {@link Ext.data.Model Model} count
 * is larger than that amount wished to be displayed at once. Also provides the same interface as a paged
 * {@link Ext.data.proxy.Server Server} proxy, allowing seamless offline caching.
 * 
 * Based on code by Ed Spencer, see:
 *  - http://docs.sencha.com/touch/2-0/source/WebStorage.html#Ext-data-proxy-WebStorage
 *  - http://docs.sencha.com/ext-js/4-1/source/WebStorage.html#Ext-data-proxy-WebStorage
 * 
 * Also inspired by:
 *  Ext.js 4-1's PagingMemoryProxy
 *   - http://docs.sencha.com/ext-js/4-1/#!/api/Ext.ux.data.PagingMemoryProxy
 *   - http://docs.sencha.com/ext-js/4-1/source/PagingMemoryProxy.html#Ext-ux-data-PagingMemoryProxy
 *  dmulcahey's LocalPagingProxy
 *   - https://github.com/dmulcahey/LocalPagingProxy
 *   - http://www.sencha.com/forum/showthread.php?192410-LocalPagingProxy-an-alternative-to-PagingMemoryProxy
 *  nohuhu's Ext.ux.data.proxy.PagingMemory
 *   - https://github.com/nohuhu/Ext.ux.data.proxy.PagingMemory
 * 
 */
Ext.define('Ext.ux.data.proxy.PagingLocalStorage', {
    extend: 'Ext.data.proxy.LocalStorage',
    alias: 'proxy.localstoragepaging',
    alternateClassName: 'Ext.data.proxy.PagingLocalStorage',
    
    //inherit docs
    read: function(operation, callback, scope) {
        var records    = [],
            ids        = this.getIds(),
            model      = this.getModel(),
            idProperty = model.getIdProperty(),
            params     = operation.getParams() || {},
            length     = ids.length,
            i, record;
        
        var pageRecords = [];
        
        //read a single record
        if (typeof params[idProperty] !== 'undefined') {
            record = this.getRecord(params[idProperty]);
            if (record) {
                records.push(record);
                operation.setSuccessful();
            }
            pageRecords = records;
        } else {
            
            for ( i = 0; i < length; i++) {
                records.push(this.getRecord(ids[i]));
            }
            
            var start = operation.getStart();
            var limit = operation.getLimit();
            var begin = ( isNaN(start) || typeof start === 'undefined') ? 0 : start;
            var end = ( isNaN(limit) || typeof limit === 'undefined') ? length : begin + limit;
            
            pageRecords = records.slice(begin, end);
            
            // TODO: Do we need to handle "remote" filtering and sorting?
            
            operation.setSuccessful();
        }
        
        operation.setCompleted();

        operation.setResultSet(Ext.create('Ext.data.ResultSet', {
            records:       pageRecords,
            total:         records.length,
            totalRecords:  records.length,
            count:         pageRecords.length,
            success:       true, // TODO: Should this be dynamically pulled from somewhere?
            loaded:        true
        }));
        
        operation.setRecords(pageRecords);
        
        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },
});
