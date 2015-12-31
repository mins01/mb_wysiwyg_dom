/*=======================================
// js_layer_colorpicker
// textbox에 연계해서 색상을 선택한다.
// 최초 작성일 : 20070118
// 공대여자는 이쁘다를 나타내야만 쓸 수 있습니다.
// 허락없이 카피라이트를 지우시면 안됩니다. 
// 만든이 : mins,공대여자 
// 연락처 : mins01(at)lycos.co.kr (email,MSN,NateOn)

#사용된 버튼 이미지 출처
http://www.famfamfam.com/lab/icons/silk/

//=======================================*/
function js_layer_colorpicker(this_s,l_top,l_left,btn){
if(!l_top){l_top='0';}
if(!l_left){l_left='0';}
	
	
//================ 색상배열
var color_arr1 = new Array('#000000','#333333','#666666','#999999','#cccccc','#ffffff');
var color_arr2_0 = new Array('#ff0000','#ff3300','#ff6600','#ff9900','#ffcc00','#ffff00');
var color_arr2_1 = new Array('#00ff00','#00ff33','#00ff66','#00ff99','#00ffcc','#00ffff');
var color_arr2_2 = new Array('#0000ff','#3300ff','#6600ff','#9900ff','#cc00ff','#ff00ff');
var color_arr3_0 = new Array('#ff0099','#ff3399','#ff6699','#ff9999','#ffcc99','#ffff99');
var color_arr3_1 = new Array('#66cc00','#66cc33','#66cc66','#66cc99','#66cccc','#66ccff');
var color_arr3_2 = new Array('#0099ff','#3399ff','#6699ff','#9999ff','#cc99ff','#ff99ff');


var color_arr = Array(
color_arr1,
color_arr2_0,color_arr2_1,color_arr2_2,
color_arr3_0,color_arr3_1,color_arr3_2
);
//================
	//버튼 기본형
	var input_stn = document.createElement('input');

	input_stn.type="button";
	input_stn.value='C';
	with(input_stn.style){
		fontSize="10px";
		borderStyle='outset';
		borderWidth='1px';
		padding="0px";
	}
	//div 기본형
	var div_stn = document.createElement('div');
	with(div_stn.style){
		//fontSize="0px";
		//lineHeight='0px';
		borderStyle='solid';
		borderWidth='0px';
		borderColor='#999999';
		padding="0px";
		margin='auto';
		//width=height="16px";
	}	
	
//둘러싸는 span
	var span_stn = document.createElement('span');

	//붙이기
	if (this_s.nextSibling){ this_s.parentNode.insertBefore(span_stn,this_s.nextSibling);}
	else{ this_s.parentNode.appendChild(span_stn);}


	//최외각 레이어
	var div_out = div_stn.cloneNode(true);	
	with(div_out.style){
		//width="120px";
		position="absolute";
		top=l_top+"px";
		left=l_left+"px";
		backgroundColor='#eeeeee';
		fontSize="0px";
		lineHeight='0px';
		borderStyle='solid';
		borderWidth='1px';
		borderColor='#999999';
		padding="5px";
		margin='auto';
		display='none';
		zIndex='100';
	}
	var span2 = document.createElement('div');
	span2.style.position="relative";
	span2.style.zIndex="0";
	span2.style.verticalAlign='top';
	span2.appendChild(div_out);
	span_stn.appendChild(span2);	
	span_stn.appendChild(this_s);
	//컬러 레이어 오픈 버튼
	if(!btn){
	var input_open = input_stn.cloneNode(true);	
	//input_open.style.color='#996633';
	input_open.value='C';
	input_open.style.fontWeight='bold';
	}else{
	var input_open = btn;
	}
	input_open.style.cursor='pointer';
	input_open.title='색상선택';
	
	span_stn.appendChild(input_open);
	//색상버튼 : 기본형
	var input_color = input_stn.cloneNode(true);
	input_color.value='';
	try{input_open.style.backgroundColor=this_s.value;}catch(e){}
	with(input_color.style){
		fontSize="0px";
		borderStyle='solid';
		borderWidth='0px';
		borderColor='#cccccc';
		padding="0px";
		width=height="14px";
		margin='1px';
		cursor='pointer';
	}
	//색상 div : 기본형
	var div_color = div_stn.cloneNode(true);
	div_color.style.borderStyle='none';
	div_color.style.whiteSpace='nowrap';
//닫기 버튼	
	var dc = div_color.cloneNode(true);
	dc.style.textAlign='center';
	var ic = input_color.cloneNode(true);
	ic.value='X';
	ic.style.border='1px solid #cccccc';
	ic.style.fontSize='11px';
	ic.title = 'close';
	ic.onclick = function(){
		div_out.style.display='none';
	}
	var dc_temp = document.createElement('span');
	dc_temp.innerHTML = 'Color Picker ';
	dc_temp.style.fontSize='11px';
	dc_temp.style.lineHeight='100%';
	dc.appendChild(dc_temp);	
	dc.appendChild(ic);
	div_out.appendChild(dc);
//========== 색상버튼 붙이기 작업 시작
	for(var i=0,m=color_arr.length;i<m;i++)
	{
		var dc = div_color.cloneNode(true);		
		var color_arr_n = color_arr[i];
		for(var j=0,n=color_arr_n.length;j<n;j++){
			var ic = input_color.cloneNode(true);
			ic.style.backgroundColor=color_arr_n[j];
			ic.value2 = color_arr_n[j];
			ic.title = color_arr_n[j];
			ic.onclick = function(){
				this_s.value=this.value2;
				input_open.style.backgroundColor=this.value2;
				div_out.style.display='none';
			}
			dc.appendChild(ic);
		}
		div_out.appendChild(dc);
	}
//========== 색상버튼 붙이기 작업 끝
//========== 이벤트 등록
	input_open.onclick = function(){
		if(div_out.style.display=='none'){
			div_out.style.display='';
			//div_out.focus();
		}else{
			div_out.style.display='none';
		}
	}
	div_out.onblur =function(){
		this.style.display='none';
	}
//============	
	
	//카피라이트
	var copy_div =  div_stn.cloneNode(true);	
	copy_div.style.textAlign='right';
	copy_div.style.fontSize='12px';	
	copy_div.style.lineHeight='80%';		
	copy_div.style.whiteSpace='nowrap';
	var str = String.fromCharCode(60,97,32,104,114,101,102,61,34,104,116,116,112,58,47,47,119,119,119,46,109,105,110,115,48,49,46,99,111,109,34,32,116,97,114,103,101,116,61,34,95,98,108,97,110,107,34,32,115,116,121,108,101,61,34,102,111,110,116,45,115,105,122,101,58,49,48,112,120,59,34,62,65325,65353,65358,65363,60,47,97,62);
	copy_div.innerHTML =str;
	div_out.appendChild(copy_div);
//=======

}