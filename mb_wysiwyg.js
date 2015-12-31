/**
* 저작권:mins(mins01@lycos.co.kr)가 가집니다.
* 허락받지 않고서는 쓸 수 없습니다.
* http://www.mins01.com (old http://mins01.zerock.net)
* 위지윅 에디터 mb_wysiwyg(ver DOM)
* Last Modify : 20091230,20120521
*/

var ta_wysiwyg = null;
var ta_wysiwyg_path = null;
var ta_arr = new Array();
var outname= new Object();
var ck_submit = false;
var mb_wysiwyg_head_dtd = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
var mb_wysiwyg_head_css = '<style> body{ margin:2px;font-family: "돋움",Arial; overflow:scroll;  scrollbar-face-color:rgb(153,153,153); scrollbar-shadow-color:rgb(153,153,153);scrollbar-3dlight-color:rgb(102,102,102);scrollbar-darkshadow-color:rgb(51,51,51);scrollbar-base-color:rgb(153,153,153);scrollbar-arrow-color:rgb(51,51,51);scrollbar-track-color:rgb(204,204,204); }</style>';
//mb_wysiwyg_head_css : 위지윅 에디터 안의 head에 들어가는 스타일
//외부 파일에서 따로 정의하면 그 정의된 내용으로 대체된다. 다만 에디터 객체를 만들기 전에 정의해야한다.

//위지윅 JS의 URL경로
var temp = document.getElementsByTagName("SCRIPT");
temp = temp[temp.length-1].src;
temp = temp.substr(0,temp.lastIndexOf('/'));
if(temp!=''){var ta_wysiwyg_path = temp;
}else{var ta_wysiwyg_path='.';}
temp = null;






var mb_wysiwyg = function(v_ta, v_width, v_height, init_value,init_title){
	this.version = '20140424'; //version : date  
	this.path =".";
	if(ta_wysiwyg_path){
		this.path = ta_wysiwyg_path;
	}
	this.icon_pack="wr_24px";
	this.icon_path =this.path+this.icon_pack;
	this.isXhtml = false;	//XHTML 형식으로 태그를 변경한다.
	this.stat = 0; //0일 경우 에디터 생성전. 1일경우 에디터 생성후
	this.ctrlContType = 0; //0일 경우 body내용만 제어함, 1일 경우 html전부 제어함
	//=======================================================================
	// 입력받은 v_ta가 문자열일 경우
	//=======================================================================
	var temp = typeof(v_ta);
	if(temp != 'object' && temp =='string'){
		var v_ta_v = document.getElementById(v_ta);
		if(v_ta_v){ v_ta = v_ta_v ; }
		else{
			var v_ta_v = document.getElementsByName(v_ta);
			if(v_ta_v[0]){ v_ta = v_ta_v[0]; }
			else{
				this.ck_browser=false;
				return;
			}
		}
	}
	//=======================================================================
	// 레이아웃 변수 설정
	//=======================================================================
	this.layout_root= null;//최외각 div
	this.layout_toolbar= null;//툴바용 div
	this.layout_toolbar_tools = null	////툴바용 div 안의 툴들
	this.layout_editer= null;	//에디터용 div
	this.layout_editer_ifrme = null; //에디터용 div -> iframe용
	this.layout_editer_textarea = null; //에디터용 div -> textarea용

	//=======================================================================
	// 타이틀바의 타이틀
	//=======================================================================

	this.titlebar_title = null; //타이틀 부분의 타이틀

	//=======================================================================
	// textarea 변수 설정
	//=======================================================================
	this.textarea = v_ta;			//대상 textarea
	this.textareaClone = this.textarea.cloneNode(false); //대상 textarea의 프로퍼티 카피용


	if(!this.textarea.id)	this.textarea.id = this.textarea.name;
	else if(!this.textarea.name)	this.textarea.name = this.textarea.id;
	this.name = this.textarea.name;
	this.id = this.textarea.id;
	if(outname[this.textarea.id]){
		alert('개체의 ID나 Name가 중복되었습니다!\n에디터를 만들 수 없습니다.\n\n중복된 ID,Name : '+this.textarea.id+'\nID와 Name를 학인해주시기 바랍니다.');
		return;
	}
	outname[this.textarea.id] = this;	//외부 접근용으로 변수에 연결시킨다.(앞에 var을 붙이면 안됨!)
	//=======================================================================
	// iframe 변수 설정
	//=======================================================================
	this.ifrm_id = 'ifrm:'+this.textarea.id;
	this.ifrm = null;

	this.ifrm_element = null;
	this.ifrm_window = null;	
	this.ifrm_document = null;
	this.txtRange = null

	this.width = v_width || '100%';
	if(this.width.toString().indexOf('px')==-1 && this.width.toString().indexOf('%')==-1){
		this.width+='px';
	}
	this.height = v_height || '300px';
	if(this.height.toString().indexOf('px')==-1 && this.height.toString().indexOf('%')==-1){
		this.height+='px';
	}	

	//=======================================================================
	// 모드체인지 변수 설정
	//=======================================================================
	this.input_design = null
	this.input_html = null
	//=======================================================================
	// 색상표
	//=======================================================================	
	this.ForeColor_pallete = null;
	this.HiliteColor_pallete = null;
	//=======================================================================
	// Style와 메타 변수 설정
	//=======================================================================
	this.ifrm_dtd = mb_wysiwyg_head_dtd
	this.ifrm_css = mb_wysiwyg_head_css; //위지윅 에디터 안에서 사용되는 CSS(Style)
//	this.ifrm_meta = '<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">';
	this.ifrm_meta = '';


	//=======================================================================
	// 기타 변수 설정
	//=======================================================================
	if(!init_value){init_value=this.textarea.value;}
	this.value = init_value || '';
	if(!init_title){init_title='mb_wysiwyg Ver.'+this.version;}
	this.title = init_title || '';
	
	this.ck_browser=false;
	temp = this._ck_browser();	//check : browser
	this.ck_browser = temp[0];	//this class support? true:false
	this.browsername = temp[1]; //browser name : MSIE,Genko(Fire Fox),Opera,Safari

	this.c_table_type = true; //Color Table type : true:Layer , false:Popup
	this.c_table_gap = 0x11;	//layer C-Table :  color gap

	this.mspan = new Array();
	
	this.insertimage_filename = 'pop.insertimage.html';  //
//  this.insertimage_path = this.path+'/insertimage';    //uploaded Image dir

	this.this_outname = 'out_'+this.textarea.id;		//dynamic variable;
	temp = ' '+this.ta_variablename+' = this;';
	eval(temp);
	mb_wysiwyg.ta_wysiwyg = this;
	//=======================================================================
	// 팝업 레이어 사용이 가능할 경우
	//=======================================================================
	this._M_UI_POPLAYER = null;
	if(window._M && _M.UI && _M.UI.POPLAYER){
		this._M_UI_POPLAYER = new _M.UI.POPLAYER();
		var t = this._M_UI_POPLAYER.getNodeBg();
		t.className = "_M-UI-POPLAYER-bg-white";
	}

}
mb_wysiwyg.ta_wysiwyg = null
//========================================================================
// 생성자
//========================================================================
mb_wysiwyg.prototype.mk_wysiwyg = function(v_cfg_toolbar,v_icon_pack,v_use_button){
	if(this.stat==1){alert('이미 에디터가 생성되어있습니다.');return false;}
	if(!this.ck_browser){alert(this.browsername); document.write("<!--not support this browser-->"); return;}
	
	//========================================== 아이콘팩 설정
	if(!v_icon_pack) icon_pack=this.icon_pack;
	this.icon_path = this.path+'/icon/'+icon_pack;
	
	this.mk_layout();	//레이아웃 생성
	this.mk_toolbar(v_cfg_toolbar,v_icon_pack,v_use_button);	//툴바 생성
	this.mk_editer();	//에디터 생성

//	this.execute('insertbronreturn',true); //FF에선 엔터를 <BR/>로 처리
	
	this.HeightReSize(0);
	this.ModeChange(true);	//워지웍을 우선
//	this.ModeChange(false);	//소스보기를 우선
	this.stat = 1;
	return true;
}
//========================================================================
// 에디터 제거
//========================================================================
mb_wysiwyg.prototype.remove = function(){
	if(this.stat==0){alert('이미 에디터가 제거되어있습니다.');return false;}
	if(!confirm('입력되는 내용은 초기값으로 되돌려집니다. 계속하시겠습니까?')){return false;}
	this.remove_wysiwyg();
	if(this._M_UI_POPLAYER){
		this._M_UI_POPLAYER.remove();
	}
	return true;
}
mb_wysiwyg.prototype.remove_wysiwyg = function(){
	this.layout_root.parentNode.insertBefore(this.textarea,this.layout_root)
	this.textarea.value = this.textarea.defaultValue;
	try{
		this.textarea.className = this.textareaClone.className; //클래스 복사
	}catch(e){}
	try{
		this.textarea.style.cssText = this.textareaClone.style.cssText; // 스타일 복사
	}catch(e){}
	
	this.layout_root.parentNode.removeChild(this.layout_root);
	this.stat = 0;	
}
//========================================================================
// 레이아웃 생성함수
//========================================================================
mb_wysiwyg.prototype.mk_layout = function(){
	if(!this.ck_browser){document.write("<!--not support this browser-->"); return;}

	this.layout_root= document.createElement('div');;//최외각 div
	this.layout_root.className="mb_wysiwyg";
	this.layout_root.style.width=(this.width);
	this.layout_root.style.overflow='visible';
	this.layout_toolbar= document.createElement('div');//툴바용 div
	this.layout_toolbar_tools= document.createElement('div');//툴바용 div 안의 툴들
	this.layout_editer= document.createElement('div');	//에디터용 div
	this.layout_editer_ifrme = document.createElement('div'); //에디터용 div -> iframe용
	this.layout_editer_ifrme.style.overflow='hidden';	
	this.layout_editer_textarea = document.createElement('div'); //에디터용 div -> textarea용
	this.layout_editer_textarea.style.overflow='hidden';

	this.layout_editer.className = "editer";

	this.textarea.parentNode.insertBefore(this.layout_root,this.textarea)

	var  temp= this._mk_ModeChange();
	this.layout_root.appendChild(temp);
	this.layout_root.appendChild(this.layout_toolbar);
	this.layout_toolbar.appendChild(this.layout_toolbar_tools);
	this.layout_root.appendChild(this.layout_editer);
	this.layout_editer.appendChild(this.layout_editer_ifrme);
	this.layout_editer.appendChild(this.layout_editer_textarea);


}
//========================================================================
// 입력키에 따른 자동 동작(key 처리전에 한다. this.exit_event(evt)로 이후처리 무시할 수 있다.)
//========================================================================
mb_wysiwyg.prototype._documentOnkeyDown = function(evt){
	if(!evt) evt = this.ifrm_window.event;
	var key = evt.which?evt.which:evt.keyCode;
	var shiftKey = evt.shiftKey;
	var ctrlKey = evt.ctrlKey;
	var altKey = evt.altKey;
	if(key == 9){ //TAB key

		var rng = this._getRNG();
		var sel = this._getSEL();

		if(this.browsername=="MSIE"){
			var seltype = sel.type;
			if(seltype == 'Text' || seltype == 'None'){ 	var p_rng = rng.parentElement(); }
			else{ 	var p_rng = rng.parentNode;	}
			var f = p_rng
		}else{
			var f = sel.focusNode;
		}




		if(
			(f.nodeType==1 && f.nodeName =='LI')
			|| (f.parentNode && f.parentNode.nodeType==1 && f.parentNode.nodeName =='LI')
			|| (f.parentNode.parentNode && f.parentNode.parentNode.nodeType==1 && f.parentNode.parentNode.nodeName =='LI')
		){
			if(shiftKey){
				this.execute('Outdent');
			}else{
				this.execute('Indent');
			}
			this.exit_event(evt)
			return false;
		}
	}
}
//========================================================================
// 툴바 만드는 부분
//========================================================================
mb_wysiwyg.prototype.mk_toolbar = function(v_cfg_toolbar,v_icon_pack,v_use_button){
	var this_s = this;
	this.use_button = v_use_button;
	if(!this.ck_browser){document.write("<!--not support this browser-->"); return;}

//	if(c_table_type)
//		this.c_table_type = c_table_type;
//	if(c_table_gap)
//		this.c_table_gap = c_table_gap;

	if(v_cfg_toolbar){
		var cfg_toolbar = v_cfg_toolbar;
	}else{
		var cfg_toolbar = Array();
	}

if(cfg_toolbar.length<1){
//if(true ||cfg_toolbar.length<1){
	cfg_toolbar = new Array();	//툴바메뉴 구성
	
	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar.push(Array('FontName','글자종류','FontName'));
	cfg_toolbar.push(Array('FontSize','글자크기','FontSize'));
	cfg_toolbar.push(Array('FormatBlock','서식','FormatBlock'));
	
	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar.push(Array('bold','굵게','Bold'));
	cfg_toolbar.push(Array('Italic','이탈릭','Italic'));
	cfg_toolbar.push(Array('Underline','밑줄','Underline'));
	cfg_toolbar.push(Array('StrikeThrough','취소선','StrikeThrough'));
	cfg_toolbar.push(Array('ForeColor','글자색','ForeColor'));
	cfg_toolbar.push(Array('HiliteColor','글자배경색','HiliteColor'));
	cfg_toolbar.push(Array('SuperScript','윗첨자','SuperScript'));
	cfg_toolbar.push(Array('SubScript','아래첨자','SubScript'));
	cfg_toolbar.push(Array('RemoveFormat','꾸밈삭제','RemoveFormat'));


	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar.push(Array('JustifyLeft','정렬:왼쪽','JustifyLeft'));
	cfg_toolbar.push(Array('JustifyCenter','정렬:가운데','JustifyCenter'));
	cfg_toolbar.push(Array('JustifyRight','정렬:오른쪽','JustifyRight'));
	cfg_toolbar.push(Array('Indent','들여쓰기','Indent'));
	cfg_toolbar.push(Array('Outdent','내어쓰기','Outdent'));
	cfg_toolbar.push(Array('InsertOrderedList','순차목록','InsertOrderedList'));
	cfg_toolbar.push(Array('InsertUnorderedList','비순차목록','InsertUnorderedList'));
	
	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar.push(Array('CreateLink','링크만들기','CreateLink'));
	cfg_toolbar.push(Array('UnLink','링크지우기','UnLink'));	
	cfg_toolbar.push(Array('InsertTable','테이블삽입','InsertTable'));
	cfg_toolbar.push(Array('InsertImage','이미지삽입','InsertImage'));
	cfg_toolbar.push(Array('InsertMedia','미디어삽입','InsertMedia'));	
	cfg_toolbar.push(Array('InsertIFrame','Iframe삽입','InsertIFrame'));	
	cfg_toolbar.push(Array('InsertFolder','접히는내용삽입','InsertFolder'));	
	cfg_toolbar.push(Array('InsertChar','특수문자삽입','InsertChar'));
	cfg_toolbar.push(Array('InsertHorizontalRule','수평선삽입','InsertHorizontalRule'));

	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	cfg_toolbar.push(Array('Undo','Undo','Undo'));
	cfg_toolbar.push(Array('Redo','Redo','Redo'));
	cfg_toolbar.push(Array('Zoom','Zoom','Zoom')); //only IE
	cfg_toolbar.push(Array('t_section','구분자','t_section')); // section, division
	
	cfg_toolbar.push(Array('Help','도움말','Help'));
	cfg_toolbar.push(Array('Test','실험용','Test')); //for test


	//cfg_toolbar.push(Array("br1","br","t_Tag"));
}

	var str = new String();
	var m=cfg_toolbar.length;
	if(m<=0) {document.write("<!--not setting toolbar-->"); return;}



//	this.layout_toolbar.appendChild();
	this.layout_toolbar.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';
	this.layout_toolbar.className="toolbar";

	for(var i=0;i<m;i++)
	{	
		if(cfg_toolbar[i][3]){
			var temp = this._addbutton(cfg_toolbar[i][0],cfg_toolbar[i][1],cfg_toolbar[i][2],cfg_toolbar[i][3]);
		}else{
			var temp = this._addbutton(cfg_toolbar[i][0],cfg_toolbar[i][1],cfg_toolbar[i][2]);
		}
		this.layout_toolbar_tools.appendChild(temp);
	}
//	this.layout_toolbar_tools.innerHTML = str;
	return;
//------------- 디버그용
	document.write('<div id="'+this.div_toolbar+'"  class="toolbar" style="width:'+this.width+';background-image:url('+this.icon_path+'/backgroundImage.gif);">');
//	document.write('<div id="'+this.div_toolbar+'"  class="toolbar" style="background-image:url('+this.icon_path+'/backgroundImage.gif);">');
	for(var i=0;i<m;i++)
	{
		str+=this._addbutton(cfg_toolbar[i][0],cfg_toolbar[i][1],cfg_toolbar[i][2])+' ';		/// section, division	

	}
	document.write(str);
	document.write('</div>');
}
//====================================
// 버튼 추가 제어함수
//====================================
mb_wysiwyg.prototype._addbutton = function(name,title,command,fn){
	var str = new String();
	var name = 'btn_'+name;
	if(fn && typeof(fn) == 'function') //커스텀 버튼
	btn = this._CustomButton(name,title,command,fn);
	else if(command == 'InsertIFrame')
	btn = this._InsertIFrame(name,title,command);	
	else if(command == 'InsertFolder')
	btn = this._InsertFolder(name,title,command);		
	else if(command == 'InsertTable')
	btn = this._InsertTable(name,title,command);
	else if(command == 'Help')
	btn = this._Help(name,title,command);	
	else if(command == 'Test')
	btn = this._Test(name,title,command);	
	else if(command == 'InsertImage')
	btn = this._InsertImage(name,title,command);
	else if(command == 'InsertMedia')
	btn = this._InsertMedia(name,title,command);		
	else if(command == 'InsertChar')
	btn = this._InsertChar(name,title,command);	
	else if(command == 'FontName')
	btn = this._FontName(name,title,command);
	else if(command == 'FontSize')
	btn = this._FontSize(name,title,command);
	else if(command == 'ForeColor')
	btn = this._ForeColor(name,title,command);
	else if(command == 'BackColor')
	btn = this._HiliteColor(name,title,command);
	else if(command == 'HiliteColor')
	btn = this._HiliteColor(name,title,command);
	else if(command == 'CreateLink')
	btn = this._CreateLink(name,title,command);	
	else if(command == 'UnLink')
	btn = this._UnLink(name,title,command);		
	else if(command == 'FormatBlock')
	btn = this._FormatBlock(name,title,command);
	else if(command == 'Zoom')
	btn = this._Zoom(name,title,command);		
	else if(command == 't_section')
	btn = this._t_section(name,title,command);
	else if(command == 't_Tag')
	btn = this._t_Tag(name,title,command);
	else{
		var btn = this.mk_image_btn(name,title,command);
		var this_s = this;
		btn.onclick= function(){;
			this_s.execute(command);
		}
	}
	return btn;
}
//====================================
// 버튼 생성 함수 : 일반 태그 생성
//====================================
mb_wysiwyg.prototype._t_Tag = function(name,title,command){	//not menu: only print tag for boolbar
	try{
	var obj = this.mk_element(title);
	}catch(e){
		alert(title);
	}
	return obj;
}
//====================================
// 커스텀 버튼 생성 함수 : 커스텀 버튼
//====================================
mb_wysiwyg.prototype._CustomButton = function(name,title,command,fn){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	//image_btn.style.cursor='help';

	//var src=this.path+'/pop.help.html';

	image_btn.onclick = fn

	return image_btn;
}
//====================================
// 버튼 생성 함수 : 도움말 버튼
//====================================
mb_wysiwyg.prototype._Help = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	image_btn.style.cursor='help';

	var src=this.path+'/pop.help.html';

	image_btn.onclick = function(){
		this_s.mspan_close();
		this_s.window_open(src,'pop_help','600','430');
	}

	return image_btn;
}
//====================================
// 버튼 생성 함수 : 접히는 내용 삽입 버튼 : IE전용
//====================================
mb_wysiwyg.prototype._InsertFolder = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	if(this.browsername!='MSIE'){
		var image_btn = this.mk_div();
		image_btn.style.display="none";
		return image_btn;
	}	
	image_btn.onclick = function(){
		this_s.InsertFolder();
	}
	return image_btn;
}
mb_wysiwyg.prototype.InsertFolder = function(){
	var root = document.createElement('div');
	var button1 = document.createElement('input');
	var date = new Date();
	var id = 'folder_'+date.getTime() ;
	button1.type='button';
	button1.value='접혀있는 내용';
	button1.id = 'btn1_'+date.getTime() ;
	with(button1.style){
		backgroundColor='#ffffff';
		border='1px dotted #aabbcc';
		display='block';
		color ='#336699';
	}
	//var button2 = button1.cloneNode(true);
	//button2.id = 'btn2_'+date.getTime() ;	
	var div =  document.createElement('div');
	div.id=id;
	with(div.style){
		padding='5px';
		margin='5px';
		display = 'none';
		backgroundColor='#f2f2f2';
		border='1px dotted #cccccc';
	}		
	div.innerHTML = '<div><p>이곳에 원하는 내용을 적어주세요.</p></div>'
	
	var fn ="var ta=document.getElementById('"+id+"'),btn1=document.getElementById('"+button1.id+"');"
	fn+="if(ta.style.display !='none'){";
	fn+="ta.style.display = 'none';";
	fn+="btn1.value='접혀있는 내용';";
	fn+="}else{";
	fn+="ta.style.display = '';";
	fn+="btn1.value='펼쳐진 내용';}";
	
	button1.onclick = fn;
	//button2.onclick = fn;
	root.appendChild(button1);
	root.appendChild(div);
	//root.appendChild(button2);
	this._pasteHTML(root);
}
//====================================
// 버튼 생성 함수용 onclick 이벤트 만들기
//====================================
mb_wysiwyg.prototype._createBtnOnClick=function(src,name,widht,height){
	var thisC = this;
	return function(){
		thisC.mspan_close();
		thisC.window_modal(src,name,widht,height);
		this.blur();
	}
}

//====================================
// 버튼 생성 함수 : iframe 삽입 버튼
//====================================
mb_wysiwyg.prototype._InsertIFrame = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);

	var src=this.path+'/pop.insertiframe.html';

	image_btn.onclick = this._createBtnOnClick(src,'pop_insert_iframe','620','520');
	return image_btn;
}
mb_wysiwyg.prototype.InsertIFrame = function(ta){
	this._pasteHTML(ta);
}
//====================================
// 버튼 생성 함수 : 테이블 삽입 버튼
//====================================
mb_wysiwyg.prototype._InsertTable = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);

	var src=this.path+'/pop.inserttable.html';

	image_btn.onclick = function(){
		this_s.mspan_close();
		this_s.window_modal(src,'pop_insert_table','520','420');
		this.blur();
	}
	return image_btn;
}
mb_wysiwyg.prototype.InsertTable = function(ta){
  this._pasteHTML(ta);
}
//====================================
// 버튼 생성 함수 : 특수문자 삽입 버튼
//====================================
mb_wysiwyg.prototype._InsertChar = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src=this.path+'/pop.insertchar.html';
	image_btn.onclick = function(){
		this_s.mspan_close();
		this_s.window_modal(src,'pop_insert_char','400','320');
		this.blur();
	}
	return image_btn;
}
mb_wysiwyg.prototype.InsertChar = function(ta){
  this._pasteHTML(ta);
}
//====================================
// 버튼 생성 함수 : 이미지 삽입 버튼
//====================================
mb_wysiwyg.prototype._InsertImage = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src= this.path+'/'+this.insertimage_filename;

	image_btn.onclick = function(){
		this_s.mspan_close();
		this_s.window_modal(src,'pop_insert_Image','520','360');
		this.blur();
	}

	return image_btn;

}
mb_wysiwyg.prototype.InsertImage = function(ta){
		this._pasteHTML(ta);
}
//====================================
// 버튼 생성 함수 : 미디어 삽입 버튼
//====================================
mb_wysiwyg.prototype._InsertMedia = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src= this.path+'/pop.insertmedia.html';

	image_btn.onclick = function(){
		this_s.mspan_close();
		this_s.window_modal(src,'pop_insert_Media','520','490');
		this.blur();
	}

	return image_btn;

}
mb_wysiwyg.prototype.InsertMedia = function(ta){
		this._pasteHTML(ta);
}
//====================================
// 버튼 생성 함수 : 링크생성 버튼
//====================================
mb_wysiwyg.prototype._CreateLink = function(name,title,command){
//	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src=this.path+'/pop.createlink.html';

	image_btn.onclick = function(this_s,src){
		return function(){
			this_s.mspan_close();
			var popup = this_s.window_modal(src,'pop_createlink','400','150');
			//this.blur();
		}
	}(this,src)

	return image_btn;
}
mb_wysiwyg.prototype._UnLink = function(name,title,command){ //링크 삭제
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src=this.path+'/pop.createlink.html';

	image_btn.onclick = function(){
		result = this_s._execCommand("Unlink",false,null);
	}

	return image_btn;
}
mb_wysiwyg.prototype.CreateLink = function(url,target,title){
	this._execCommand("Unlink",false,null);
//	alert(url);
	var result = this._execCommand("CreateLink",false,url);
//	alert(result);
	var pSel = this.currentParent('A',5);
	if(pSel){
		if(target)			pSel.target = target;
		if(title)			pSel.title = title;
	}
}
mb_wysiwyg.prototype.stripTags = function(str){
	return str.replace(/<[^>]*>/g,'');
}
mb_wysiwyg.prototype.selectedHtml = function(){
	var html = "";
	if(this.browsername=="MSIE"){
		var rng = this._getRNG();
		html = rng.htmlText;
	}else{
		var sel = this._getSEL();

		var container = document.createElement("div");
		for (var i = 0, len = sel.rangeCount; i < len; ++i) {
		container.appendChild(sel.getRangeAt(i).cloneContents());
		}
		var html = container.innerHTML;
	}
	return html;
}
mb_wysiwyg.prototype.currentElement = function(){
	var rng = this._getRNG();
	var sel = this._getSEL();
	var seltype = sel.type;
	var msg = '';
	if(this.browsername=="MSIE"){
		return rng;
	}else{
		if(seltype == 'None'){
			alert('대상을 지정해주세요.(currentElement)');
			return;
		}
		return sel.focusNode
	}
	return false;
}
mb_wysiwyg.prototype.currentParent = function(shTagName,Limit){
	var rng = this._getRNG();
	var sel = this._getSEL();
	var seltype = sel.type;
	var fn = null ;// 선택된 대상의 node
	var msg = '';
	if(this.browsername=="MSIE"){
		if(rng.parentNode){var fn = rng.parentNode; }
		else{ var fn = rng.parentElement(); }
	}else{
		if(seltype == 'None'){
			alert('대상을 지정해주세요.(currentParent)');
			return;
		}
		var fn = sel.focusNode.parentNode;
	}
	if(shTagName){
		shTagName = shTagName.toUpperCase()
		var ilimit = 0; 
		if(!Limit){ Limit = 5; }
		while(fn && fn.nodeName!=shTagName && ilimit<Limit){
			fn = fn.firstChild;
			ilimit++;
		}
	}
	return fn;
	return false;
}
//====================================
// 버튼 생성 함수 : 구분자 이미지
//====================================
mb_wysiwyg.prototype._t_section = function(name,title,command){
	var image_btn = this.mk_image_btn(name,title,command);
		image_btn.style.cursor='auto';
	var this_s = this;
	return image_btn;
}
//====================================
// 메뉴 레이어 제목/닫기 버튼
//====================================
mb_wysiwyg.prototype.mk_closeX = function(title){
	var this_s = this;
	title = title?title:'';

	var div_out = this.mk_element('table');
	div_out.className="closeX"
	div_out.style.borderWidth="0px";
	div_out.style.borderStyle="solid";
	div_out.align="center";
	div_out.cellspacing="0";
	div_out.cellpadding="0"
	div_out.width="100%";
	var new_tr = div_out.insertRow(-1);

	var div_title=this.mk_div();
	div_title.innerHTML = title;
	div_title.className="title";
	var closebtn=this.mk_element('input');
	closebtn.type='button';
	//closebtn.value='×';
	closebtn.className="btn";
	closebtn.onclick=function(){
		this_s.mspan_close();
	}

	new_td =new_tr.insertCell(-1);
	new_td.appendChild(div_title);
	new_td.align="center";
	
	new_td =new_tr.insertCell(-1);
	new_td.appendChild(closebtn);
	new_td.align="right";
	new_td.valign="top";	
	
	return div_out;
}
//====================================
// 버튼 생성 함수 : 포맷(서식) 버튼
//====================================
mb_wysiwyg.prototype._FormatBlock = function(name,title,command){
	var format_arr = new Array("h1","h2","h3","h4","h5","h6","pre","p","div","address");
	var format_arr_name = new Array("<h1>","<h2>","<h3>","<h4>","<h5>","<h6>","<pre>","<p>","<div>","<address>");
	var this_s = this;
	var idname = 'mspan:'+command+':'+this.id;
	var image_btn = this.mk_image_btn(name,title,command);

		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);


		var div1 = this.mk_span();
		div1.className='view';
		div1.style.overflow='visible';
		div1.style.width='180px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		

		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);
	
		var input_temp = this.mk_element('button');
		//input_temp.type='button';
		input_temp.className="btn_100p";
		
		var tmp_arr = format_arr;
		for(i=0,m=tmp_arr.length;i<m;i++){
			var div1_child = input_temp.cloneNode(true);
			div1_child.value2 = format_arr[i];
			var temp = this.mk_element(format_arr[i]);
			temp.innerHTML = '&lt;'+format_arr[i]+'&gt;'+'가Ab韓';
			div1_child.appendChild(temp);			
			if(this.browsername !='MSIE'){
				div1_child.onclick=function(){
					this_s.mspan_close();
					this_s._execCommand("FormatBlock",false,this.value2);
					return false;
				}
			}else{
				div1_child.onclick=function(){
					this_s.mspan_close();
					this_s._execCommand("FormatBlock",false,'<'+this.value2+'>');
					return false;
				}				
			}
			var div2 = this.mk_div();
			div2.appendChild(div1_child);
			div1.appendChild(div2);
		}
		
		span.appendChild(div1);
		span.appendChild(image_btn);
		

		image_btn.onclick=function(){
			this_s.mspan_close();
			span.className = 'view-show';
		}

		return span;

}
mb_wysiwyg.prototype._Zoom = function(name,title,command){		//only IE
	if(this.browsername!='MSIE'){
		//var image_btn = this.mk_div();
		//image_btn.style.display="none";
		//return image_btn;
	}
	var format_arr = new Array("10%","30%","50%","70%","100%","150%","200%","300%","400%","500%");
	var this_s = this;
	var idname = 'mspan:'+command+':'+this.id;
//	var image_btn = this.mk_image_btn(name,title,command);
	//var image_btn = this.mk_element('input');
	var image_btn = this.mk_button_btn(name,title,command);
	// image_btn.type="button";
	// image_btn.readonly=true;
	// image_btn.className="imgbtn_0";
	// image_btn.size=5;
	// image_btn.maxlength=5;
	image_btn.innerHTML= image_btn.innerHTML="100%";
	// with(image_btn.style){
		// textAlign="center";
		// width="40px";
		// height='18px';
		// margin="1px";
		// padding="0px";
		// cursor='pointer';
		// borderWidth='1px';
	// }
	// image_btn.title=title;
	// image_btn.alt=title;
	//이미지 버튼 마우스 오버 기능(구분자 빼고 적용)
	// image_btn.onmouseover=function(){	
	// this.className='imgbtn_1';
	// }
	// image_btn.onmouseout=function(){ 
	// this.className='imgbtn_0';
	// }	
//	str += '<input class="imgbtn" type="text" readonly="true" size="5" maxlength="5" value="100%" style="margin:0px;padding:0px;text-align:center;" title="'+title+'" alt="'+title+'" onclick="'+this.mspan_onclick_cmd()+'" />';	



		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);

		var div1 = this.mk_span();
		div1.className='view';
		div1.style.overflow='visible';
		div1.style.width='120px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		
		
		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);
	
		var input_temp = this.mk_element('input');
		input_temp.type='button';
		input_temp.className="btn_100p";
		
		var tmp_arr = format_arr;
		for(i=0,m=tmp_arr.length;i<m;i++){
			var div1_child = input_temp.cloneNode(true);
			div1_child.value = tmp_arr[i];
				div1_child.onclick=function(){
					this_s.mspan_close();
					image_btn.innerHTML = image_btn.value = this.value;
					
					this_s.Zoom(this.value);
					return false;
				}
			div1.appendChild(div1_child);
		}
		span.appendChild(div1);
		span.appendChild(image_btn);

		image_btn.onclick=function(){
			this_s.mspan_close();
			this.blur();
			span.className = 'view-show';
		}
	return span;
}
mb_wysiwyg.prototype.Zoom = function(value){
	this.mspan_close();
	if(value.indexOf('%')>-1){
		value = parseInt(value)/100;
	}
	if(value)	this.ifrm_document.body.style.zoom = value;
}
//====================================
// 버튼 생성 함수 : 폰트 이름
//====================================
mb_wysiwyg.prototype._FontName = function(name,title,command){


	var font_eng_arr = new Array("Arial","Arial Black","Arial Narrow","Courier New","System","Times New Roman","Tahoma","Terminal","Verdana");
	var font_kor_arr = new Array("굴림","돋움","바탕","궁서");	

	var this_s = this;
	var idname = 'mspan:'+command+':'+this.id;
	var image_btn = this.mk_image_btn(name,title,command);



		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);

		var div1 = this.mk_span();
		div1.className='view';
		div1.style.overflow='visible';
		div1.style.width='130px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		

		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);

		var input_temp = this.mk_element('input');
		input_temp.type='button';
		input_temp.className="btn_100p";

		var tmp_arr = font_kor_arr;
		for(i=0,m=tmp_arr.length;i<m;i++){
			var div1_child = input_temp.cloneNode(true);
			div1_child.value = tmp_arr[i];
			div1_child.style.fontFamily = tmp_arr[i];
				div1_child.onclick=function(){
					this_s.mspan_close();
					this_s.execute('FontName',false,this.style.fontFamily);
					return false;
				}
			div1.appendChild(div1_child);
		}
		var tmp_arr = font_eng_arr;
		for(i=0,m=tmp_arr.length;i<m;i++){
			var div1_child = input_temp.cloneNode(true);
			div1_child.value = tmp_arr[i];
			div1_child.style.fontFamily = tmp_arr[i];
				div1_child.onclick=function(){
					this_s.mspan_close();
					this_s.execute('FontName',false,this.style.fontFamily);
					return false;
				}
			div1.appendChild(div1_child);
		}
		span.appendChild(div1);
		span.appendChild(image_btn);

		image_btn.onclick=function(){
			this_s.mspan_close();
			span.className = 'view-show';
		}
	return span;
}
//====================================
// 버튼 생성 함수 : 글자크기
//====================================
mb_wysiwyg.prototype._FontSize = function(name,title,command){
	var font_size = new Array("1","2","3","4","5","6","7");
	var font_size_name = new Array("xx-small","x-small","small","medium","large","x-large","xx-large");
var this_s = this;
	var idname = 'mspan:'+command+':'+this.id;
	var image_btn = this.mk_image_btn(name,title,command);


		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);

		var div1 = this.mk_span();
		div1.className='view';
		div1.style.overflow='visible';
		div1.style.width='130px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		

		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);

		var input_temp = this.mk_element('input');
		input_temp.type='button';
		input_temp.className="btn_100p";
		
		var tmp_arr = font_size;
		for(i=0,m=tmp_arr.length;i<m;i++){
			var div1_child = input_temp.cloneNode(true);
			div1_child.value = tmp_arr[i]+'가Ab韓';
			div1_child.value2 = tmp_arr[i];
			div1_child.style.fontSize = font_size_name[i];
//			div1_child.text = "<font size="+tmp_arr[i]+">"+tmp_arr[i]+"</font>";
				div1_child.onclick=function(){
					this_s.mspan_close();
					this_s.execute('FontSize',false,this.value2);
					return false;
				}
			div1.appendChild(div1_child);
		}
		span.appendChild(div1);
		span.appendChild(image_btn);

		image_btn.onclick=function(){
			this_s.mspan_close();
			span.className = 'view-show';
		}
	return span;

}
//====================================
// 버튼 생성 함수 : 글자색
//====================================
var method_color = 0;	//method type for color change : 1:font , 2:back
mb_wysiwyg.prototype._ForeColor = function(name,title,command){
	var this_s = this;

	var image_btn = this.mk_image_btn(name,title,command);

	//this.c_table_type = true;

	if(this.c_table_type){
		var idname = 'mspan:'+command+':'+this.id;


		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);

		var div1 = this.mk_div();
		div1.className='view';
		div1.style.overflow='visible';
		div1.style.width=Math.floor(color_arr.length*((7*3)+1)+10)+'px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		
		
		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);


		var div2 = this.mk_div();
		this.ForeColor_pallete = div2;

		span.appendChild(div1);
		div1.appendChild(div2);
		span.appendChild(image_btn);
		image_btn.onclick=function(){
			this_s.mspan_close();
			span.className = 'view-show';
			this_s._ForeColor_show();
		}
		return span;
	}else{
		var src=this.path+'/pop.colortable.html';
		var image_btn = this.mk_image_btn(name,title,command);
		image_btn.onclick=function(){
			this_s.mspan_close();
			method_color = 1;
			this_s.window_modal(src,'pop_forecolor','250','340');
			this.blur();
		}
		return image_btn;
	}
	return false;
}
mb_wysiwyg.prototype._ForeColor_show = function(){
	if(!this.ForeColor_pallete.firstChild){
		var temp= this.c_table_total('0');
		this.ForeColor_pallete.appendChild(temp);
	}
}
mb_wysiwyg.prototype.ForeColor = function(this_s){
	value = this_s.style.backgroundColor;
	this._execCommand("ForeColor",false,value);
	this.mspan_close();
}
//====================================
// 버튼 생성 함수 : 글자 배경색
//====================================
mb_wysiwyg.prototype._HiliteColor = function(name,title,command){
	var this_s = this;

	var image_btn = this.mk_image_btn(name,title,command);

	//this.c_table_type = true;

	if(this.c_table_type){
		var idname = 'mspan:'+command+':'+this.id;


		var span = this.mk_span();
		span.id = idname;
		span.className = 'view-hide';
		this.mspan.push(span);

		var div1 = this.mk_div();
		div1.className='view';
		div1.style.overflow='visible';
//		div1.style.width='150px';
		div1.style.width=Math.floor(color_arr.length*((7*3)+1)+10)+'px';
		div1.style.backgroundImage='url("'+this.icon_path+'/backgroundImage.gif")';		
		
		var closeX = this.mk_closeX(title);
		div1.appendChild(closeX);

		var div2 = this.mk_div();
		this.HiliteColor_pallete = div2;

		span.appendChild(div1);
		div1.appendChild(div2);
		span.appendChild(image_btn);
		image_btn.onclick=function(){
			this_s.mspan_close();
			span.className = 'view-show';
			this_s._HiliteColor_show();
		}
		return span;
	}else{
		var src=this.path+'/pop.colortable.html';
		var image_btn = this.mk_image_btn(name,title,command);
		image_btn.onclick=function(){
			this_s.mspan_close();
			method_color = 2;
			this_s.window_modal(src,'pop_hilitecolor','250','340');
			this.blur();
		}
		return image_btn;
	}
	return false;
}

mb_wysiwyg.prototype._HiliteColor_show = function(){
	if(!this.HiliteColor_pallete.firstChild){
		var temp= this.c_table_total('1');
		this.HiliteColor_pallete.appendChild(temp);
	}
}
mb_wysiwyg.prototype.HiliteColor = function(this_s){
	value = this_s.style.backgroundColor;
	if(this.browsername=="MSIE")
	this._execCommand("BackColor",false,value);
	else
	this._execCommand("HiliteColor",false,value);
	this.mspan_close();
}

//====================================
//  모든 도구레이어 닫기 함수
//====================================
mb_wysiwyg.prototype.mspan_close = function(){
	var ta ;
	mb_wysiwyg.ta_wysiwyg = this;
	this_s = this;
	this.ifrm_window.focus();
	for(var i = 0,m=this.mspan.length;i<m;i++){
		ta = this.mspan[i];
		ta.className="view-hide";
	}
}
mb_wysiwyg.prototype.mspan_close_nofocus = function(){
	var ta ;
	mb_wysiwyg.ta_wysiwyg = this;
	this_s = this;
	for(var i = 0,m=this.mspan.length;i<m;i++){
		ta = this.mspan[i];
		ta.className="view-hide";
	}
}
mb_wysiwyg.prototype.mspan_onclick_cmd = function(){
	return ''+this.ta_variablename+'.mspan_close();this.parentNode.className=this.parentNode.className!=\'view-show\'?\'view-show\':\'view-hide\';';
}
//-----------------------------------------------------------------------------

//======================================================================================================
// 에디터 만드는 부분
//======================================================================================================
mb_wysiwyg.prototype.mk_editer = function(){	//make editer in html
	if(!this.id || !this.name){
	document.write('<!-- Error : No id or name -->');
		return false;
	}
	if(!this.ck_browser){document.write("<!-- not support this browser -->");return}

	//========================================================================
	// Iframe을 붙인다.
	//========================================================================
	this.ifrm = this._mk_Iframe()
	this.layout_editer_ifrme.appendChild(this.ifrm);
//	this.layout_editer_ifrme.className="edit_ifame";
	this.layout_editer_ifrme.className="noborder";
	this.ifrm.className="edit_ifame";

	this.ifrm_element = this.ifrm;
	try{		this.ifrm_window = this.ifrm.contentWindow;	}
	catch(e){		this.ifrm_window = this.ifrm;		}
	this.ifrm_document = this.ifrm_window.document;
	//this.ifrm_document = this.ifrm_window.contentDocument;
	//this.ifrm_document.location = 'http://kr.yahoo.com';		//기본 내용이 든 페이지를 로드한다.
	this.ifrm_window.onkeyup = this._documentOnkeyup
	//========================================================================
	// textarea를 붙인다.
	//========================================================================
	this.layout_editer_textarea.appendChild(this.textarea);
	this.layout_editer_textarea.style.height="100%";
	this.textarea.wrap="off";
	//this.textarea.wrap="soft";
	this.layout_editer_textarea.className="noborder";
	this.textarea.className="edit_textarea";
	this.textarea.wrap="soft";
	with(this.textarea.style){
//	backgroundColor="#eeeeee";
//	width='100%';
//	overflow='scroll';
//	overflowX='scroll';
//	overflowY='scroll';
	//width=this.width;
	height=this.height;	//IE때문에 사용한다.
	//border='1px solid #0000ff';
//	margin='0px';
//	padding='0px';
	}

	//========================================================================
	//모드 변경등의 작업
	//========================================================================
	this._init_content(); //이둘의 순서가 바뀌면 FF에서 iframe 오류가 생김
	this._designmode(true);	//이둘의 순서가 바뀌면 FF에서 iframe 오류가 생김
	//this.ed_submit(); //modify onSubmit event in <form>
}
mb_wysiwyg.prototype._designmode = function(bool){
	var bool = bool?bool:true;
	
	this.ifrm_document.designMode="On";
	this.ModeChange(bool);
	return;
}
mb_wysiwyg.prototype._DeleteTextarea = function(bool){
	var ta_ById = document.getElementById( this.id ) ;
	var ta_ByName = document.getElementsByName( this.name ) ;	
	var object = null;
	if ( ta_ById && ta_ById.tagName == 'TEXTAREA' ){
	object = ta_ById;
	}else{
		var m = ta_ByName.length
		for(i=0;i<m;i++){
			if ( ta_ByName[i] && ta_ByName[i].tagName == 'TEXTAREA' ){
				object = ta_ByName[i];
				break;
			}
		}
	}
	var obj = object.cloneNode(true);
	if(object){
		var parnet = object.parentNode;
		parnet.removeChild(object);		//	object.removeNode(); : just for IE
		return object;
	}else{
		return object;
	}
	
}
//====================================
// 이벤트 초기화, iframe의 이벤트를 초기화 시킨다.
//====================================
mb_wysiwyg.prototype._init_event = function(){ 
	//this.ifrm_window.onkeydown = (function(thisC){ return function(event){ thisC._documentOnkeyDown(event); } })(this);
	this.ifrm_document.onkeydown = (function(thisC){ return function(event){ thisC._documentOnkeyDown(event); } })(this);
	
}
//====================================
// 내용 초기화. textarea에서 iframe으로 값을 복사한다.
//====================================
mb_wysiwyg.prototype._init_content = function(){ //ifarme content init
	try{
		this.setIframeHtml(this.textarea.value);
		//this.ifrm_document.body.innerHTML ='';
		//this._pasteHTML(this.textarea.value);
	}catch(e){
		var str = this.ifrm_dtd+'<html><head>'+this.ifrm_css+this.ifrm_meta+'</head><body>'+this.textarea.value+'</body></html>'
		this.setIframeHtml(str);
	}
	this.ifrm_window.focus();
	//==================================== 메뉴레이어 제어용
	var this_s = this;
	this.layout_editer_ifrme.onmouseover=function(){this_s.mspan_close_nofocus();}
	this._init_event();
}
//====================================
// 지원 브라우저 체크, IE6.0+, FF1.5+, Opera9+
//====================================
mb_wysiwyg.prototype._ck_browser = function(){
//check : browser
	var str_userAgent = navigator.userAgent.toLowerCase() ;
	var ck_ie = str_userAgent.indexOf("msie");
	var ck_safari = str_userAgent.indexOf("mac");
	var ck_gecko = str_userAgent.indexOf("gecko");
	var ck_opera = str_userAgent.indexOf("opera");
	
	var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./)
	if(isIE11){ //IE11
		return Array(true,'MSIE 11');
	}else if ( ck_ie != -1 || (ck_safari ==-1 && ck_gecko==-1 && ck_opera==-1))		//IE
	{
		var BrowserVersion = parseFloat(navigator.appVersion.match(/MSIE (\d{1,3}\.\d{1,3})/)[1]);
		if(BrowserVersion >= 6.0)			return Array(true,'MSIE');
		else 			return Array(false,'FALSE');
	}
	// Gecko (Opera 9 tries to behave like Gecko at this point).
	// firefox
	else if ( ck_gecko!= -1 && navigator.productSub >= 20030210 && !( typeof(opera) == 'object' && opera.postError ) )
	{return Array(true,'gecko');}
	// Opera
	else if ( ck_opera!= -1 && navigator.appName == 'Opera' && parseInt( navigator.appVersion ) >= 9 )
	{
    return Array(true,'Opera');
    //return Array(false,'Opera:not support');	  
	}
	// Safari
	else if ( ck_safari && str_userAgent.indexOf( 'safari' ) != -1 )
	{
		//return Array(false,'Safari:not support');
		return Array(true,'Safari:not support');
	}
	return Array(false,'FALSE');
	//return Array(true,'Testing');
}

//====================================
// Iframe 생성
//====================================
mb_wysiwyg.prototype._mk_Iframe = function(  )	// Iframe
{
	var str=new String();
	var onfocus =this.ta_variablename+'.mspan_close();';

	var iframe = this.mk_element('iframe');
	iframe.style.border="none";
	iframe.name = 'ifrm:'+this.id;
	iframe.id = 'ifrm:'+this.id;
	iframe.style.width='100%';
	iframe.style.height=this.height;
	iframe.scrolling='auto';
	iframe.marginWidth="0";
	iframe.marginHeight="0";
	iframe.frameBorder="0";
//	iframe.border="0";

	return iframe;

}
//====================================
// 모드 체인지 / 에디터 높이 변경 버튼생성
//====================================
mb_wysiwyg.prototype._mk_ModeChange = function(){
	var this_s=this;



	var div_out = this.mk_element('table');
	div_out.className="titlebar"
	div_out.border="0";
	div_out.align="center";
	div_out.cellspacing="0";
	div_out.cellpadding="0"
	with(div_out.style){
	width="100%";	
	//backgroundColor="#cccccc";
	tableLayout="fixed";
	height="20px";	
	}
	
	var new_tr = div_out.insertRow(-1);
	td_left =new_tr.insertCell(-1);
	td_right =new_tr.insertCell(-1);	
	
	td_left.noWrap=true;	
	td_left.style.textAlign='left';
	td_left.vAlign='middle';
	td_left.style.height="20px";
	td_left.style.overflow="hidden";
	
	td_right.style.textAlign='right';
	//td_right.style.width='260px';
	td_right.vAlign='middle';	
	

	var titlebar =  this.mk_span();
	titlebar.innerHTML=this.title;
	//titlebar.className="noborder12px"
	titlebar.title=this.title;
	titlebar.style.overflow='hidden';
	titlebar.style.lineHeight='19px';
	this.titlebar_title =titlebar;
	
/*	var input_design = this.mk_element("input");
	input_design.type="button";
	input_design.className="btn_80"
	input_design.value="Design";
	input_design.title="디자인 모드";
	input_design.style.margin="1px";*/
	
	var input_design = this.mk_image_btn('designmode','디자인 모드','designmode');
//	input_design.hspace='2';
	var input_html = this.mk_image_btn('codemode','코드 모드','codemode');
//	input_html.hspace='2';
	var h_m = this.mk_image_btn('minusmark','높이감소','minusmark');
//	h_m.hspace='1';
	var h_i = this.mk_image_btn('zeromark','원래대로','zeromark');
//	h_i.hspace='0';
	var h_p = this.mk_image_btn('plusmark','높이증가','plusmark');
//	h_p.hspace='1';
	var maker_home =  this.mk_image_btn('questionmark','만든이 홈페이지로','questionmark');
//	maker_home.hspace='2';
	
	maker_home.onclick=function(){
		window.open("http://www.mins01.com","_blank");
	}

	this.input_design = input_design;
	this.input_html = input_html;

	input_design.onclick=function(){
		this_s.ModeChange(true);this.blur();
	}
	input_html.onclick=function(){
		this_s.ModeChange(false);this.blur();
	}
	h_m.onclick=function(){
		this_s.HeightReSize(2);this.blur();
	}
	h_i.onclick=function(){
		this_s.HeightReSize(0);this.blur();
	}
	h_p.onclick=function(){
		this_s.HeightReSize(1);this.blur();
	}

	td_left.appendChild(titlebar);
	td_right.appendChild(input_design);
	td_right.appendChild(input_html);
	td_right.appendChild(h_m);
	td_right.appendChild(h_i);
	td_right.appendChild(h_p);
	td_right.appendChild(maker_home);
	return div_out;
}
//====================================
// 에디터 높이 제어 생성
//====================================
mb_wysiwyg.prototype.HeightReSize = function(type){
	var height1 = 0; 
	height1 = this.strtoint(this.ifrm_element.style.height);
	if(type==1 && height1 < 1000){
		this.ifrm_element.style.height = (height1+100).toString()+'px';
		this.textarea.style.height = (height1+100).toString()+'px'; //IE 때문에
		this.layout_editer.style.height = (height1+100).toString()+'px';
	}else if(type==2 && height1 > 100){
		this.ifrm_element.style.height = (height1-100).toString()+'px';
		this.textarea.style.height = (height1-100).toString()+'px'; //IE 때문에
		this.layout_editer.style.height = (height1-100).toString()+'px';
	}else if(type == 0){
		this.ifrm_element.style.height = this.height;
		this.textarea.style.height = this.height; //IE 때문에
		this.layout_editer.style.height = this.height;
	}
}
//====================================
// 모드 체인지 동작
//====================================
mb_wysiwyg.prototype.ModeChange = function(bool,force){		//true:iframe , fase:textarea
	if(bool){
		if(this.layout_editer_ifrme.style.display=='none' || force)
		{
			this.sync();
		}
		//this.layout_toolbar_tools.style.display = "";
		this.layout_toolbar_tools.style.visibility = "";
		this.layout_editer_textarea.style.display='none';
		this.layout_editer_ifrme.style.display='';
		this.ModeChangeFocus_ifame();
		this.input_design.style.backgroundColor='#BBF9B0';
		this.input_html.style.backgroundColor='';		

	}else{
		if(this.layout_editer_textarea.style.display=='none' ||force)
		{
			this.sync();
		}
		this.layout_toolbar_tools.style.visibility = "hidden";
		this.layout_editer_textarea.style.display='';
		this.layout_editer_ifrme.style.display='none';
		this.ModeChangeFocus_textarea();
		this.input_design.style.backgroundColor='';
		this.input_html.style.backgroundColor='#BBF9B0';
		
	}
	this._init_event();
}
//====================================
// 내용 동기화
//====================================
//=== 태그를 XHTML 형식에 맞게(계속 수정중)
mb_wysiwyg.prototype.tagForXhtml = function(str){
	var regTag = new RegExp('(<[^>]*>|.[^<]*)','gm')
	
	var snglTags = Array('BASE','META','LINK','HR','BR','BASEFONT','PARAM','IMG','AREA','INPUT','ISINDEX','COL');
	var regSnglTags = Array();
	var regSnglReplaceTags = Array();
	for(var i=0,m=snglTags.length;i<m;i++){
		regSnglTags.push(new RegExp('<'+snglTags[i]+'[^>]*[^/]{0,1}>','i'));
		regSnglReplaceTags.push(new RegExp('(<)('+snglTags[i]+')([^>]*)(>)','i'));
	}
	var regUpper = new RegExp('(<)(/[A-Z]+|[A-Z]+)( |)([^>]*)(>)','i');
	var regAttr = new RegExp('([^=]*=)(.*)','m');
	
	
	var tags = str.match(regTag);
	var tNum = 0;
	var tArr = Array();
	var tArr2 = Array();
	var t = Array();
	
	if(!tags){	//아무런 내용도 없을 경우
		return '';	
	}
	for(var i=0,m=tags.length;i<m;i++){
		if(tags[i].substr(0,1)==='<'){
			//=== 단일태그 처리
			for(var i2=0,m2=regSnglTags.length;i2<m2;i2++){
				tNum = tags[i].search(regSnglTags[i2]);
				if(tNum != -1){
					tags[i] = tags[i].replace(regSnglReplaceTags[i2],'$1$2$3 /$4');
					break;
				}
			}
			//=== 태그 소문자로
			tArr = regUpper.exec(tags[i]);
			if(tArr && tArr.length>3){
				//=== 애트리뷰트 값 "로 감싸기
				tArr2 = tArr[4].split(' ');
				for(var i3=0,m3=tArr2.length;i3<m3;i3++){
					t = regAttr.exec(tArr2[i3]);
					if(t && t.length>2){
						if(t[2].indexOf('"')===0){
							continue;
						}else if(t[2].indexOf("'")===0){
							t[2] = '"'+t[2].substr(1,t[2].length-2)+'"';
						}else{
							t[2] = '"'+t[2]+'"';
						}
						tArr2[i3] = t[1]+t[2];
					}
					
				}
				tArr[4] = tArr2.join(' ');
				tags[i]=tArr[1]+tArr[2].toLowerCase()+tArr[3]+tArr[4]+tArr[5];
			}
		}
	}
	return tags.join('');
}
mb_wysiwyg.prototype.sync = function(force){
	if(force||this.layout_editer_ifrme.style.display=='none'){
		if(this.browsername=='MSIE') this.ifrm_document.designMode="Off";
		try{
			this.setIframeHtml(this.textarea.value);
			//this.ifrm_document.body.innerHTML ='';
			//this._pasteHTML(this.textarea.value);
		}catch(e){
			var str = this.ifrm_dtd+'<html><head>'+this.ifrm_css+this.ifrm_meta+'</head><body>'+this.textarea.value+'</body></html>'
			this.setIframeHtml(str);
		}
		if(this.browsername=='MSIE') this.ifrm_document.designMode="On";				  
	}else{
		//this.textarea.value = this.ifrm_document.body.innerHTML;
		this.textarea.value = this.getIframeHtml();
		//IE에서 tag대문자로 된거 소문자로
		if(this.isXhtml){
			this.textarea.value = this.tagForXhtml(this.textarea.value);
		}
		//this.textarea.value = 
	}
	this._init_event();
}
mb_wysiwyg.prototype.getIframeHtml = function(){
	if(this.ctrlContType==0){ //body의 내용만
		return this.ifrm_document.body.innerHTML;
	}else{
		var d = document.createElement('div');
		d.appendChild(this.ifrm_document.getElementsByTagName('html')[0].cloneNode(true));
		return d.innerHTML;
	}
}
mb_wysiwyg.prototype.setIframeHtml = function(text){
	if(this.ctrlContType==0){ //body의 내용만
		try{
			this.ifrm_document.body.innerHTML = text;
		}catch(e){
			var str = '<html><head>'+this.ifrm_css+this.ifrm_meta+'</head><body>'+text+'</body></html>'
			this.ifrm_document.open();
			this.ifrm_document.write(str);
			this.ifrm_document.close();
		}
	}else{
		this.ifrm_document.open();
		this.ifrm_document.write(text);
		this.ifrm_document.close();
	}
	return true;
}
mb_wysiwyg.prototype.ModeChangeFocus_ifame = function(){
	var ta = document.getElementById(this.ifrm_id);
	/*============= 맨 민으로 커서 보내기 : 사용안함
	this._execCommand("SelectAll", false, null);	
	try{
		if(this.browsername=='MSIE'){
			var rng = ta.contentWindow.document.selection.createRange();
			rng.collapse(false);
			rng.select();					
		}
		else {
			var sel = ta.contentWindow.getSelection();
			sel.collapseToEnd();
		}
	}catch (e) {	}
	//=============================*/
	ta.contentWindow.focus();
}
mb_wysiwyg.prototype.ModeChangeFocus_textarea = function(){
		var ta = this.textarea
		ta.focus();
		/*============= 맨 민으로 커서 보내기 : 사용안함
		if( ta.setSelectionRange ) { //FF
			ta.setSelectionRange(ta.value.length,ta.value.length);
		} else if(ta.createTextRange){	//MSIE
			var range = ta.createTextRange();
			range.collapse(true);
			range.moveEnd('character',ta.value.length);
			range.moveStart('character',ta.value.length);
			range.select();
		}else 
		//===============================*/
		ta.focus();

}
//====================================
//  <form>의 onsubmit에 이벤트 추가
//====================================
mb_wysiwyg.prototype.ed_submit = function(){
	// 이 함수는 사용되지 않는다.
	return true;
  if(!this.ck_browser){document.write("<!--not support this browser-->"); return;} 
  if(ck_submit) return;	//onsubmit 이벤트는 한번만 수정하면 된다.
  var this_s =  this;
  ck_submit = true;  
	var frm =	this.textarea.form;
	var ori_submit = frm.onsubmit;
	//frm.onsubmit.toString() = "return confirm('dfdf');";
	//alert(ori_submit);
	//frm.onsubmit = function(){  this_s.submit(); return ori_submit(); }	//Reset form.onsubmit	
/*	
 if(frm.attachEvent){
	frm.onsubmit = function(){ }	//Reset form.onsubmit		 
	frm.attachEvent("onsubmit", ori_submit);	 
	frm.attachEvent("onsubmit", this.submit );
 }
 else{
	frm.onsubmit = function(){ }	//Reset form.onsubmit			 
	frm.addEventListener("submit", this.submit , false);
 	frm.addEventListener("submit", ori_submit , false);	
	frm.onsubmit = ori_submit;
 }
//*/	
	

}
mb_wysiwyg.prototype.exit_event = function(evt){
	if(evt && evt.stopPropagation){
		evt.stopPropagation(); 
		evt.preventDefault();
		evt.cancelBubble = true;		
	}else if(evt){
		 evt.keyCode = 0;
		 evt.cancelBubble = true;
		 evt.returnValue = false;
	}else{
		 window.event.keyCode = 0; 
		 window.event.cancelBubble = true;
		 window.event.returnValue = false;    
	}
	return false;
}
//====================================
// submit 동작
//====================================
mb_wysiwyg.prototype.submit = function(){
	if(this.stat != 1){ //위지웍이 정상적으로 만들져있을 때만 동작한다.
		return;
	}
	for(x in outname){
		outname[x].sync();
	}
}
//====================================
// 외부에서 제어할 때 사용하는 함수
//====================================
mb_wysiwyg.prototype.input_value = function( str ) 
{
//this.ifrm.style.position="absolute";
	try{
		this.ifrm_document.body.innerHTML = str;
	}catch(e){
		var str = '<html><head>'+this.ifrm_css+this.ifrm_meta+'</head><body>'+str+'</body></html>'
		this.ifrm_document.open();
		this.ifrm_document.write(str);
		this.ifrm_document.close();
	}
	this.textarea.value = str;
//alert(this.textarea.value);
	this._init_event();
}
mb_wysiwyg.prototype.input_title = function( str ) 
{
	this.titlebar_title.innerHTML = str;
}
//--------------------------------------------------------------------------------- for execCommand()
mb_wysiwyg.prototype._execCommand = function(sCommand,bUserInterface,vValue){
//	alert(sCommand+','+bUserInterface+','+vValue);
//	return;
	this.mspan_close();
	this.ifrm_window.focus();
	if(!sCommand) return false;
	bUserInterface = bUserInterface==null?false:bUserInterface;
	vValue = vValue==null?null:vValue;	
	try{
		var r = this.ifrm_document.execCommand(sCommand, bUserInterface, vValue);
		if(!r && this.txtRange){
			var r = this.txtRange.execCommand(sCommand, bUserInterface, vValue);
			this.txtRange.select();
			this.txtRange = null;
		}
		return r;		
	}catch(e){
		return false;
	}
	this.ifrm_window.focus();
	
}
mb_wysiwyg.prototype.execute = function(sCommand,bUserInterface,vValue){
	this._execCommand(sCommand,bUserInterface,vValue);
//	this.mspan_close();
}
//----------------------------------------------------------------------------------
mb_wysiwyg.prototype._getSEL = function(){
	this.ifrm_window.focus();
	try{
		if(this.browsername=='MSIE'){
			var sel = this.ifrm_document.selection;
			return sel;
		}else{
			var sel = this.ifrm_window.getSelection();
			return sel;
		}
	}catch(e){  alert('Error:_getSEL : '+e.description+':'+(e.number & 0xFFFF)); }
}
mb_wysiwyg.prototype._getRNG = function(){
	var sel = this._getSEL();
	this.ifrm_window.focus();
	try{
		if(this.browsername=='MSIE'){
			var rng = sel.createRange();
			if(rng.length){		return rng.item(0);	}
			return rng;
		}else{
			//var sel = this.ifrm_window.getSelection();
			var rng = sel.getRangeAt(0); 
			return rng;
		}
	}catch(e){  alert('Error:_getRNG : '+e.description+':'+(e.number & 0xFFFF)); }
}


mb_wysiwyg.prototype._pasteHTML = function(sHTML){

	//this.ifrm_window.focus();
	//try{
		if(this.browsername=='MSIE'){
			if(sHTML.nodeType==1){	sHTML = sHTML.outerHTML; }
			if(this.txtRange){
				var rng = this.txtRange;
			}else{
				var rng = this._getRNG();
			}
			rng.pasteHTML(sHTML);	//rng.text = sHTML;
			rng.select();
			if(this.txtRange){
				this.txtRange = null;
			}

		}else{
			if(sHTML.nodeType!=1){
				this._execCommand("InsertHTML",false,sHTML); //그냥 문자열일 때
				return;
			}else if( sHTML.nodeType==3 && rng.createContextualFragment){ sHTML = rng.createContextualFragment(sHTML);	}//for Genko
			else if(!sHTML.nodeType){ sHTML = document.createTextNode(sHTML);	} //for Opera
			var sel = this.ifrm_window.getSelection();
			if(sel.rangeCount==0){return;}
			
			var rng = sel.getRangeAt(0);
	        var pos = rng.startOffset;
	        sel.removeAllRanges();
			rng.deleteContents();

			var container = rng.startContainer||sel.focusNode;
			var range = document.createRange();

			if(container.nodeName.toLowerCase()=='html'){		//for FF , <HTML> -> <BODY>
			container = this.ifrm_document.body;
			}
			// pickup in chediter 
			if (container.nodeType==3 && sHTML.nodeType==3) {		//nodeType : 1(Element Node), 3(Text Node)
				container.insertData(pos, sHTML.nodeValue);

				range.setEnd(container, pos+sHTML.length);	 //selection Range to end
	            range.setStart(container, pos+sHTML.length);
			}else {
				var afterNode;
				if (container.nodeType==3) {		//ElementNode intput TextNode
					var txt_this = container;
					container = txt_this.parentNode;
					var txt = txt_this.nodeValue;
					var txt_st = txt.substr(0,pos);
					var txt_ed = txt.substr(pos);
					var beforeNode = document.createTextNode(txt_st);
					var afterNode = document.createTextNode(txt_ed);

					container.insertBefore(afterNode, txt_this);
					var x = container.insertBefore(sHTML.cloneNode(true), afterNode);
					container.insertBefore(beforeNode, x);
					container.removeChild(txt_this);
				}else{
					afterNode = container.childNodes[pos];
					if(afterNode){
						afterNode.parentNode.insertBefore(sHTML.cloneNode(true),afterNode);
					}else{
						container.appendChild(sHTML.cloneNode(true));
					}
				}
				if(sel.focusNode){
					range.setEnd(sel.focusNode, 0); //selection Range to end
					range.setStart(sel.focusNode, 0);
				}
				
			}
			sel.addRange(range);
		}	
	//}catch(e){  
	//alert('Error:_pasteHTML : '+e.description+':'+(e.number & 0xFFFF));
	//}


}
mb_wysiwyg.prototype._pasteHTML_tag = function(sTag,eTag){
	this.ifrm_window.focus();
	if(this.browsername=='MSIE'){
		var rng = this.ifrm_document.selection.createRange();
		//rng.collapse(true);
		//rng.expand("character");
		sHTML = sTag+rng.text+eTag;
		rng.pasteHTML(sHTML);	
		rng.select();
	}else{
		var rng = this.ifrm_window.getSelection().getRangeAt(0); 
		sHTML = sTag+rng.toString()+eTag;
		rng.deleteContents();
		rng.insertNode(rng.createContextualFragment(sHTML));
	}
}
mb_wysiwyg.prototype._pasteHTML_tag_remove = function(){
	this.ifrm_window.focus();
	if(this.browsername=='MSIE'){
		var rng = this.ifrm_document.selection.createRange();
		sHTML = rng.text.replace(/<(.)*>/g,'');
		rng.text='';
		rng.pasteHTML(sHTML);	
		rng.select();
	}else{
		var rng = this.ifrm_window.getSelection().getRangeAt(0); 
		sHTML = rng.toString().replace(/<(.)*>/g,'');
		rng.deleteContents();
		rng.insertNode(rng.createContextualFragment(sHTML));
	}
}
//---------------------------------------------------------------- util function
mb_wysiwyg.prototype.strtoint = function(str){	 // Sting -> Int
	var ta = parseInt(str);
	if(isNaN(ta))
		ta = 0;
	return ta;

}
mb_wysiwyg.prototype.tag = function(str){
return '<'+str+'>';
}
mb_wysiwyg.prototype._htmlspecialchars = function( str )	//PHP:htmlspecialchars
{
	str = str.toString() ;
	str = str.replace(/&/g, "&amp;") ;
	str = str.replace(/</g, "&lt;") ;
	str = str.replace(/>/g, "&gt;") ;	
	str = str.replace(/\"/g, "&quot;") ;
	str = str.replace(/'/g, "&#39;") ;	
	return str ;
}
mb_wysiwyg.prototype._htmlspecialchars_totext = function( str ) //PHP:htmlspecialchars
{
	str = str.toString() ;
	str = str.replace(/&amp;/g, "&") ;
	str = str.replace(/&lt;/g, "<") ;
	str = str.replace(/&gt;/g, ">") ;	
	str = str.replace(/&quot;/g, "\"") ;
	str = str.replace(/&#39;/g, "'");	
	return str;
}
//====================================
// 색상 테이블 생성함수
//====================================
//var color_arr = new Array('00','11','22','33','44','55','66','77','88','99','AA','BB','CC','DD','EE','FF');	
//0x11을 gap으로 했을 경우: 느립니다.
var color_arr = new Array('00','33','66','99','cc','ff');	//기본 6단계
mb_wysiwyg.prototype.c_table_black= function(type,ta){
	var div_out = this.mk_span();
	//div_out.className="float_left";	
	var span_out = this.mk_div();
	var img = this.mk_element('input');
	img.type = 'button';
	with(img.style){
	width = '7px';
	height = '7px';
	borderStyle='none';
	margin='0px';
	padding='0px';
	cursor='crosshair';
	verticalAlign='baseline';
	//backgroundColor = rgb;
	}
//	img.title = rgb;

		for(i=0,m=color_arr.length;i<m;i++){
			var r = color_arr[i].toString();
			var g = color_arr[i].toString();
			var b = color_arr[i].toString();                
			
			var rgb = '#'+r+g+b;
			img_c = img.cloneNode(true);
			img_c.style.backgroundColor = rgb;
			img_c.title = rgb;
					if(type=='0'){
						img_c.onclick = function(){
							this_s.ForeColor(this);
						}
						img_c.onmouseover = function(){
							ta.style.color = this.style.backgroundColor;
						}							
					}else if(type=='1'){
						img_c.onclick = function(){
							this_s.HiliteColor(this);
						}
						img_c.onmouseover = function(){
							ta.style.backgroundColor = this.style.backgroundColor;
						}							
					}
			span_out.appendChild(img_c);
			if(i != (m-1)){
				var temp=this.mk_element('br');
				span_out.appendChild(temp);
			}			
		}
		div_out.appendChild(span_out);
	return div_out;
}

mb_wysiwyg.prototype.c_table_= function(ru,gu,bu,type,ta){
	var this_s = this;

	var div_out = this.mk_div();
	div_out.style.padding="0px";
	div_out.style.margin="0px";
	//div_out.style.border="1px solid #333333";

	//div_out.className="float_left";
	var img = this.mk_element('input');
	img.type = 'button';
	with(img.style){
	width = '7px';
	height = '7px';
	borderStyle='none';
	margin='0px';
	padding='0px';
	cursor='crosshair';
	verticalAlign='baseline';
	//backgroundColor = rgb;
	}
//	img.title = rgb;
	var r,g,b;
	var m = color_arr.length;
    for(j=0;j<m;j++){
		if(ru){    
		if(ru==2) var r = color_arr[Math.ceil(m/2)];
		else var r = color_arr[j].toString();
		}
		if(gu){
		if(gu==2) var g = color_arr[Math.ceil(m/2)];
		else var g = color_arr[j].toString();
		}
		if(bu){
		if(bu==2) var b = color_arr[Math.ceil(m/2)];
		else var b = color_arr[j].toString();
		}
			var span_out = this.mk_span();
			for(i=0,m=color_arr.length;i<m;i++){
				if(!ru)        var r = color_arr[i].toString();
				if(!gu)        var g = color_arr[i].toString();
				if(!bu)        var b = color_arr[i].toString();                
				
				var rgb = '#'+r+g+b;
				img_c = img.cloneNode(true);
				img_c.style.backgroundColor = rgb;
				img_c.title = rgb;
					if(type=='0'){
						img_c.onclick = function(){
							this_s.ForeColor(this);
						}
						img_c.onmouseover = function(){
							ta.style.color = this.style.backgroundColor;
						}							
					}else if(type=='1'){
						img_c.onclick = function(){
							this_s.HiliteColor(this);
						}
						img_c.onmouseover = function(){
							ta.style.backgroundColor = this.style.backgroundColor;
						}							
					}

				//span_out.appendChild(img_c);
				div_out.appendChild(img_c);
			}
			
			//div_out.appendChild(span_out);
			if(j != (m-1)){
				var temp=this.mk_element('br');
				div_out.appendChild(temp);
			}
    }
	return div_out;
}
mb_wysiwyg.prototype.c_table_total= function(type){
	var ta = this.mk_element('table');
	ta.className="c_table"
	ta.border="0";
	ta.style.border="0px solid #333333";
	ta.style.margin="0px auto";
	//ta.style.tableLayout="fixed";
	ta.align="center";
	ta.cellspacing="0";
	ta.cellpadding="0"

	var new_tr = ta.insertRow(-1);
	new_td =new_tr.insertCell(-1);
	new_td.colSpan='4';
	new_td.align="center";
	new_td.innerHTML = '가Ab韓';
	new_td.className ="border12px";
	new_td.style.borderStyle='solid';
	new_td.style.borderWidth='1px';	
	new_td.style.lineHeight='18px';	
	preview = new_td;
	
	var new_tr = ta.insertRow(-1);
	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;
	new_td.className="nopadding";
	var temp = this.c_table_black(type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;
	new_td.className="nopadding";	
	var temp = this.c_table_(1,0,0,type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp =  this.c_table_(0,1,0,type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp = this.c_table_(0,0,1,type,preview)
	new_td.appendChild(temp);

	var new_tr = ta.insertRow(-1);
	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp = this.c_table_black(type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp = this.c_table_(1,0,2,type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp =  this.c_table_(2,1,0,type,preview)
	new_td.appendChild(temp);

	new_td =new_tr.insertCell(-1);
	new_td.noWrap=true;	
	new_td.className="nopadding";	
	var temp = this.c_table_(0,2,1,type,preview)
	new_td.appendChild(temp);

	return ta;
}
//=======================================================================
// 팝업관련 함수
//=======================================================================
//------------------------------------------------------- popup function
mb_wysiwyg.prototype.popup_simple= function(url,name , width, height)
{
 var toolbar =0;
 var menubar =0;
 var statusbar =0;
 var scrollbar =0;
 var resizable =0;
 var left = (screen.width-width)/2;
 var top = (screen.height-height)/3;
  
  toolbar_str = toolbar ? 'yes' : 'no';
  menubar_str = menubar ? 'yes' : 'no';
  statusbar_str = statusbar ? 'yes' : 'no';
  scrollbar_str = scrollbar ? 'yes' : 'no';
  resizable_str = resizable ? 'yes' : 'no';
  w_result = window.open(url, name, 'left='+left+',top='+top+',width='+width+',height='+height+',toolbar='+toolbar_str+',menubar='+menubar_str+',status='+statusbar_str+',scrollbars='+scrollbar_str+',resizable='+resizable_str); 
 return w_result;
}
//--------------------------------------------------------window open
mb_wysiwyg.prototype.window_open = function(url, name, width, height) 
{ 
 var left = (screen.width-width)/2;
 var top = (screen.height-height)/3; 
 var property ='left='+left+',top='+top+',height='+height+',width='+width+',toolbar=no,directories=no,status=no,linemenubar=no,scrollbars=no,resizable=no,modal=yes,dependent=yes';
 var win = window.open(url, name, property); 
 return win;
}
//--------------------------------------------------------showModelessDialog for FF
mb_wysiwyg.prototype.window_modal = function(url, name, width, height) 
{ 
	this.txtRange = this.currentElement();
 /* 
 if (window.showModalDialog) { 
 window.showModalDialog(url, window, 'dialogWidth:'+width+'px;dialogHeight:'+height+'px'); 
 } */
 if(this._M_UI_POPLAYER){
	var d = _M.DOM.create('iframe',{"width":"80%","height":"80%","frameborder":"0","src":url
									,"style":"width:90%;height:90%;margin:5%;border-width:0px;","allowTransparency":"false"});
	this._M_UI_POPLAYER.html(d);
	this._M_UI_POPLAYER.openByElement(this.layout_root);
 }else if (window.showModelessDialog) { 
 var property ='dialogWidth:'+(parseInt(width)+10)+'px;dialogHeight:'+(parseInt(height)+40)+'px;'+'scroll:no;resizable:no;help:no;center:yes;status:no;edge:raised;unadorned:yes;';
 var win = window.showModelessDialog(url, window, property); 
 } else { 
 var win = this.window_open(url, name, width, height)
 }
 return win;
}
mb_wysiwyg.prototype.close_window_modal = function(url, name, width, height) 
{ 
 /* 
 if (window.showModalDialog) { 
 window.showModalDialog(url, window, 'dialogWidth:'+width+'px;dialogHeight:'+height+'px'); 
 } */
 if(this._M_UI_POPLAYER){
	this._M_UI_POPLAYER.close();
 }
}
//--------------------------------------------------------showModelessDialog for FF : abled scroll
mb_wysiwyg.prototype.window_modal_scroll = function(url, name, width, height) 
{ 
 /* 
 if (window.showModalDialog) { 
 window.showModalDialog(url, window, 'dialogWidth:'+width+'px;dialogHeight:'+height+'px'); 
 } */
 if (window.showModelessDialog) { 
 var property ='dialogWidth:'+(parseInt(width)+10)+'px;dialogHeight:'+(parseInt(height)+40)+'px;'+'scroll:yes;resizable:no;help:no;center:yes;status:no;edge:raised;unadorned:yes;';
 window.showModelessDialog(url, window, property); 
 } else { 
 var win = this.window_open(url, name, width, height) } 
}

//=======================================================================
// util 함수
//=======================================================================
mb_wysiwyg.prototype.mk_image_btn = function(name,title,command) // DOM으로 이미지 버튼 만들기 
{	
	if(this.use_button){
		return this.mk_button_btn(name,title,command);
	}
	var icon = this.icon_path+'/icon.'+command.toLowerCase()+'.gif';
	var image_btn = document.createElement('img');
	//image_btn.style.margin='1px';
	image_btn.src = icon;
	image_btn.name=name;
	image_btn.id=name;
	image_btn.title=title;
	image_btn.alt=title;
	image_btn.style.cursor='pointer';
	image_btn.align="absmiddle"
	image_btn.className='imgbtn_0';
	if(command != 't_section'){
		//이미지 버튼 마우스 오버 기능(구분자 빼고 적용)
		image_btn.onmouseover=function(){	this.className='imgbtn_1';}
		image_btn.onmouseout=function(){ this.className='imgbtn_0';}	
	}
	return image_btn;
}
// 버튼으로 만들기. class 설정됨
mb_wysiwyg.prototype.mk_button_btn = function(name,title,command)
{	
	var icon = this.icon_path+'/icon.'+command.toLowerCase()+'.gif';
	var image_btn = document.createElement('button');
	//image_btn.style.margin='1px';
	//image_btn.src = icon;
	//image_btn.name=name;
	//image_btn.id=name;
	image_btn.title=title;
	//image_btn.alt=title;
	image_btn.style.cursor='pointer';
	image_btn.type="button";
	image_btn.align="absmiddle"
	//image_btn.appendChild(document.createTextNode(name));
	console.log('mbw-'+name)
	//image_btn.className='imgbtn_0';
	image_btn.className='mbw-button fontawesome- mbw-'+name
	return image_btn;
}

mb_wysiwyg.prototype.mk_div = function(v1,v2,v3) // DOM으로 DIV 만들기 
{	
	var div = document.createElement('div');
	return div;
}
mb_wysiwyg.prototype.mk_span = function(v1,v2,v3) // DOM으로 SPAN 만들기 
{	
	var span = document.createElement('span');
	return span;
}
mb_wysiwyg.prototype.mk_element = function(type,v2,v3) // DOM으로 DIV 만들기 
{
	if(!type){ return false;}
	var span = document.createElement(type);
	if(type=='mk_element')span.style.overflow="hidden";

	return span;
}
//====================================
// 버튼 생성 함수 : 테스트
//====================================
mb_wysiwyg.prototype._Test = function(name,title,command){
	var this_s = this;
	var image_btn = this.mk_image_btn(name,title,command);
	var src=this.path+'/pop.createlink.html';

	image_btn.onclick = function(event){
		this_s.mspan_close();
		this_s.Test(event);
	}

	return image_btn;
}

mb_wysiwyg.prototype.Test = function(evt){
	alert('test');
	//this.CreateLink('http://mins01.com','_blank','111222333');
/*
		var ce = this.currentElement();
		var cp = this.currentParent('A',5);
		//var tx = this.stripTags(this.selectedHtml());
		var tx = this.selectedHtml();
		alert('cp:'+cp);
		alert('ce:'+ce);
		alert('tx:'+tx);

/*

//	this._documentOnkeyup(evt);
	return false;
//this.execute('fontname',false,'궁서');
//ta = document.getElementById('test');
//this._pasteHTML('test');
//this._pasteHTML(ta);
alert('test');

//var height; 
//	height = this.strtoint(this.ifrm_element.style.height);
//	alert('에디터의 높이 :'+height);
*/
}
