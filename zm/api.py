from __future__ import unicode_literals
import frappe

def update_SO_qty_based_on_width_height(self,method):
	items= self.get("items")
	for item in items:
		item.qty=item.widht_cf*item.height_cf
		qty_cf=frappe.db.get_value('Item', item.item_code, 'minimum_width_cf')
		if item.qty < qty_cf:
			item.qty=qty_cf
		
