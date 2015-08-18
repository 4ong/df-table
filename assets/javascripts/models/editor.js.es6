import df from 'discourse/plugins/df-core/df';
import loadScript from 'discourse/lib/load-script';
/**
 * @external {Chunks}
 * @external Ember.Object
 */
export default Ember.Object.extend({
	init() {
		this._super();
		//this.tableHtml()
		df.loadCss('/plugins/df-table/handsontable.full.css');
		var _this = this;
		loadScript('/plugins/df-table/handsontable.full.js').then(function() {
			$.dfMagnificPopup.open({
				items: {
					src: $('<div/>').addClass('df-table-popup').html('здесь будет таблица')
					,type: 'inline'
				}
				,callbacks: {
					/** @param {Object} data */
					change(data) {_this.render(data.inlineElement);}
					//,close() {debugger;}
		  		}
			});
		});
	},
	/**
	 * @param {jQuery} $c HTMLDivElement
	 */
	render($c) {
		new Handsontable($c.get(0), {
			data: this.tableData(),
			height: 396,
			colHeaders: true,
			rowHeaders: true,
			stretchH: 'all',
			columnSorting: true,
			contextMenu: true
		});
	},
	/** @return {String[][]} */
	tableData() {
		var result = [];
		$('tr', $(this.tableHtml())).each(function() {
			/** @type {String[]} */
			var rowData = [];
			$('th,td', $(this)).each(function() {
				rowData.push($(this).html());
			});
			result.push(rowData);
		});
		debugger;
		return result;
	},
	/**
	 * 2015-08-18
	 * Алгоритм не работает, если курсор расположен внутри открывающего или закрывающего тега table,
	 * но нас это устаивает
	 * @return {String}
	 */
	tableHtml() {
		if (!this.get('_tableHtml')) {
			/** @type {Chunks} */
			const chunk = this.get('chunk');
			/** @type {String} */
			const start = chunk.before.substring(chunk.before.lastIndexOf('<table'));
			/** @type {String} */
			const end = chunk.after.substring(0, chunk.after.indexOf('</table>')) + '</table>';
			this.set('_tableHtml', start + end);
		}
		return this.get('_tableHtml');
	}
});