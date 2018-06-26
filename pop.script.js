function closeSelf() {
	try {
		if (ta_wysiwyg) ta_wysiwyg.close_window_modal();
		self.close();
	} catch (e) {

	}
}
if (window && window.dialogArguments) {
	opener = window.dialogArguments;
}

if (window.parent != window.self) {
	opener = window.parent;
}
var ta_wysiwyg = null;
try {
	if (opener && opener.mb_wysiwyg && opener.mb_wysiwyg.ta_wysiwyg) {
		var ta_wysiwyg = opener.mb_wysiwyg.ta_wysiwyg;
	}
} catch (e) {}

if (opener == null) {
	alert('Not Exist Parent Window');
	closeSelf();
}