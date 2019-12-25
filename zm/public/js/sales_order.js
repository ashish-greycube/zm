frappe.ui.form.on('Sales Order Item', {
	widht_cf(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if (row.widht_cf) {
			row.qty = (row.widht_cf * row.height_cf);
			frm.refresh_field('items');
		}

	},
	height_cf(frm, cdt, cdn) {
		let row = frappe.get_doc(cdt, cdn);

		if (row.height_cf) {
			row.qty = (row.widht_cf * row.height_cf);
			frm.refresh_field('items');
		}

	},	
})