frappe.ui.form.on('Sales Invoice', {
	onload_post_render: function (frm) {
		frm.trigger('set_customer_balance');
	},
	customer: function (frm) {
		frm.trigger('set_customer_balance');
	},
	set_customer_balance: function (frm) {
		var customer = frm.doc.customer
		if (customer) {
			return frappe.call({
				method: 'erpnext.accounts.utils.get_balance_on',
				args: {
					'party_type': 'Customer',
					'party': customer,
					'date': frappe.datetime.get_today(),
					'company': frm.doc.company
				},
				callback: (r) => {
					frm.set_df_property('customer', 'description', __("Today's balance is : {0}", [r.message]));
				},
				error: (r) => {
					console.log('error', r)
				}
			})

		}
	},	
	set_item_qty: function (frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		let widht_cf = row.widht_cf
		let height_cf = row.height_cf
		let nos_cf = row.nos_cf
		if (widht_cf && height_cf) {

			if (widht_cf < row.minimum_width_cf) {
				widht_cf = row.minimum_width_cf
			}
			if (height_cf < row.minimum_height_cf) {
				height_cf = row.minimum_height_cf
			}

			row.qty = (nos_cf * widht_cf * height_cf) / 10000;
			console.log('row.qty', row.qty)
			frm.refresh_field('items');
		}
	}
});
frappe.ui.form.on('Sales Invoice Item', {
	widht_cf(frm, cdt, cdn) {
		frm.events.set_item_qty(frm, cdt, cdn);
	},
	height_cf(frm, cdt, cdn) {
		frm.events.set_item_qty(frm, cdt, cdn);
	},
	nos_cf(frm, cdt, cdn) {
		frm.events.set_item_qty(frm, cdt, cdn);
	},
	item_code(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);
		if (row.item_code) {
			frappe.db.get_value('Item', row.item_code, 'minimum_height_cf')
				.then(r => {
					if (r.message.minimum_height_cf) {
						let minimum_height_cf = r.message.minimum_height_cf
						row.minimum_height_cf = minimum_height_cf
						frm.refresh_field('items');
					}
				})
			frappe.db.get_value('Item', row.item_code, 'minimum_width_cf')
				.then(r => {
					if (r.message.minimum_width_cf) {
						let minimum_width_cf = r.message.minimum_width_cf
						row.minimum_width_cf = minimum_width_cf
						frm.refresh_field('items');
					}
				})
		}
	},
})