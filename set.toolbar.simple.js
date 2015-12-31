//-----------------------------------------색상 테이블 형식
//var c_table_type = false ;  //true : 레이어형식 , false : 팝업창형식
var c_table_type = true ;  //true : 레이어형식 , false : 팝업창형식
//레이어 형식으로 16x16 테이블을 생성하면, 초기 에디터 로딩 시간이 길어집니다.
var c_table_gap = 0x8;// 0x11 이면 16x16이 됩니다. 8로 하면 8x8이 됩니다. 크키가 1/4가 되기 때문에 그만큼 빠릅니다. 레이어 형식에만 적용


//-----------------------------------------
//var icon_pack='wr_24px';	//아이콘 팩 폴더 정의
//var icon_pack='wr_20px';	//아이콘 팩 폴더 정의
var icon_pack='black_16px';	//아이콘 팩 폴더 정의

//-----------------------------------------

var cfg_toolbar_simple = new Array();	//툴바메뉴 구성
	cfg_toolbar_simple.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar_simple.push(Array('FontName','글자종류','FontName'));
	cfg_toolbar_simple.push(Array('FontSize','글자크기','FontSize'));
	cfg_toolbar_simple.push(Array('FormatBlock','서식','FormatBlock'));
	
	cfg_toolbar_simple.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar_simple.push(Array('bold','굵게','Bold'));
	cfg_toolbar_simple.push(Array('Italic','이탈릭','Italic'));
	cfg_toolbar_simple.push(Array('Underline','밑줄','Underline'));
	cfg_toolbar_simple.push(Array('StrikeThrough','취소선','StrikeThrough'));
	cfg_toolbar_simple.push(Array('ForeColor','글자색','ForeColor'));
	cfg_toolbar_simple.push(Array('HiliteColor','글자배경색','HiliteColor'));
	cfg_toolbar_simple.push(Array('SuperScript','윗첨자','SuperScript'));
	cfg_toolbar_simple.push(Array('SubScript','아래첨자','SubScript'));
	cfg_toolbar_simple.push(Array('RemoveFormat','꾸밈삭제','RemoveFormat'));


	cfg_toolbar_simple.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar_simple.push(Array('JustifyLeft','정렬:왼쪽','JustifyLeft'));
	cfg_toolbar_simple.push(Array('JustifyCenter','정렬:가운데','JustifyCenter'));
	cfg_toolbar_simple.push(Array('JustifyRight','정렬:오른쪽','JustifyRight'));
	cfg_toolbar_simple.push(Array('Indent','들여쓰기','Indent'));
	cfg_toolbar_simple.push(Array('Outdent','내어쓰기','Outdent'));
	cfg_toolbar_simple.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar_simple.push(Array('Help','도움말','Help'));
