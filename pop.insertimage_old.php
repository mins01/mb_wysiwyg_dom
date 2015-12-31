<?php
// 과거의 날짜
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// 항상 변경됨
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// HTTP/1.0
header("Pragma: no-cache");
?>
<?
	$upload_path = dirname(__FILE__).'/upload/'.date('Ym');
	$upload_url = dirname($_SERVER['HTTP_REFERER']).'/upload/'.date('Ym');
	$uploaded = false;
	$uploaded_file = '';
	$max_size = 50*1024;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8r">
<title>Insert Image</title>
<style type="text/css">
<!--
form{margin:0; padding:0;}
.ta input,select{border-width:1; border-style:solid;  border-color:#999999;font-size:12px;}
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}
.ta td{font-size:12px;}
.ta .border{border-style:solid; border-width:1px; border-color:#999999;}
-->
</style>
<script type="text/javascript">
function insert_image_url(){
	var ta_img = document.getElementById('ta_img_url');	//for preview
	if(!opener){alert('not exist parent page'); self.close();}
	var str = '<img src="'+ta_img.src+'" border=0 width="'+ta_img.width+'" height="'+ta_img.height+'" />';
	opener.ta_wysiwyg._pasteHTML(str);
	self.close();
}
function view_change(bool){
	var ta1 = document.frm_upload;
	var ta2 = document.frm_url;
	if(bool){
	ta1.style.display="block";
	ta2.style.display="none";
	document.getElementsByName('rd_mode')[0].checked=true;
	document.getElementsByName('rd_mode')[1].checked=false;
	}else{
	ta1.style.display="none";
	ta2.style.display="block";	
	document.getElementsByName('rd_mode')[0].checked=false;
	document.getElementsByName('rd_mode')[1].checked=true;
	}
}
function preview_url(){
	var ta1 = document.frm_url;
	var ta_img = document.getElementById('ta_img_url');
	ta_img.src=ta1.url.value;
	preview_url_onload()
}
function preview_url_onload(){
	var ta1 = document.frm_url;
	var ta_img = document.getElementById('ta_img_url');
	ta_img.style.visibility='visible';
	ta1.ta1_width.value = ta_img.width;
	ta1.ta1_height.value = ta_img.height;	 
}
function preview_url_resize(){
	var ta1 = document.frm_url;
	var ta_img = document.getElementById('ta_img_url');
//	ta_img.style.visibility='visible';
	ta_img.width = ta1.ta1_width.value;
	ta_img.height = ta1.ta1_height.value;
}
function preview_file(){
	var ta1 = document.frm_upload;
	var ta_img = document.getElementById('ta_img_file');
	ta_img.src=ta1.file.value;
	preview_file_onload()
}
function preview_file_onload(){
	var ta1 = document.frm_upload;
	var ta_img = document.getElementById('ta_img_file');
	ta_img.style.visibility='visible';
	ta1.ta1_width.value = ta_img.width;
	ta1.ta1_height.value = ta_img.height;	 
}
function preview_file_resize(){
	var ta1 = document.frm_upload;
	var ta_img = document.getElementById('ta_img_file');
//	ta_img.style.visibility='visible';
	ta_img.width = ta1.ta1_width.value;
	ta_img.height = ta1.ta1_height.value;
}
</script>
</head>

<body>
<table width="100%" border="0" cellpadding="0" cellspacing="0" class="ta">
  <tr>
    <td valign="top"><table width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td height="20" align="center" bgcolor="#999999"><strong>Insert Image </strong></td>
      </tr>

      <tr>
        <td height="20" align="center" style="padding:2px; "><table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; ">
          <tr>
            <td width="120" height="20" align="left" bgcolor="#CCCCCC" class="border"><strong>
              <input type="radio" name="rd_mode" value="radiobutton" onClick="view_change(true);this.blur();" style="border-style:none;">
              Image Upload</strong></td>
            <td width="120" height="20" align="left" bgcolor="#CCCCCC" class="border"><strong>
              <input type="radio" name="rd_mode" value="radiobutton"  onClick="view_change(false);this.blur();" style="border-style:none;">
              Image URL </strong></td>
            <td>&nbsp;</td>
          </tr>
        </table></td>
      </tr>
      <tr>
        <td height="45" align="center" style="padding:2px; "><form name="frm_upload" enctype="multipart/form-data" method="post" action="?"><table width="100%" height="100%" border="0" cellpadding="0" cellspacing="1" id="ta_upload">
          <tr>
            <td height="20" align="center" bgcolor="#999999"><div id="preview_file" style="width:390px; height:250px; overflow:scroll; vertical-align:middle; margin:2px; ">
		<img id="ta_img_file" style="visibility:hidden; " onload="preview_file_onload();"  onerror="this.style.visibility='hidden';alert('Error');">
		</div></td>
          </tr>
          <tr>
            <td height="20">
             <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="80" align="center">Image</td>
    <td><input type="file" name="file" style="width:98%; "  onchange="preview_file();"></td>
  </tr>
</table>
 
           </td>
          </tr>
          <tr>
            <td height="20" align="left">width:
              <input name="ta1_width" type="text" id="ta1_width" size="5" maxlength="5" onKeyUp="preview_file_resize();">
              &nbsp;×&nbsp;height:
              <input name="ta1_height" type="text" id="ta1_height" size="5" maxlength="5"  onKeyUp="preview_file_resize();">
              <input type="hidden" name="MAX_FILE_SIZE" value="<?=$max_size?>" /></td>
          </tr>
          <tr>
            <td height="20" align="right">File Max Size :
              <?=$max_size?>
Byte&nbsp;&nbsp;
<input type="submit" value="Insert Image"></td>
          </tr>
        </table>
        </form><form name="frm_url" action="" onSubmit="insert_image_url();return false;" enctype="multipart/form-data" method="post" ><table width="100%" height="100%" border="0" cellpadding="0" cellspacing="1" id="ta_url">
          <tr>
            <td height="20" align="center" bgcolor="#999999"><div id="preview_url" style="width:390px; height:250px; overflow:scroll; vertical-align:middle; margin:2px; ">
			<img id="ta_img_url" style="visibility:hidden; " onload="preview_url_onload();"  onerror="this.style.visibility='hidden';alert('Error');"> </div></td>
          </tr>
          <tr>
            <td height="20">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="80" align="center">URL</td>
    <td><input type="text" name="url" style="width:98%; " onKeyUp="preview_url();"></td>
  </tr>
</table>

           </td>
          </tr>
          <tr>
            <td height="20" align="left">width:
                <input name="ta1_width" type="text" id="ta1_width" size="5" maxlength="5" onKeyUp="preview_url_resize();">
&nbsp;×&nbsp;height:
    <input name="ta1_height" type="text" id="ta1_height" size="5" maxlength="5"  onKeyUp="preview_url_resize();">
            </td>
          </tr>
          <tr>
            <td height="20" align="right"><input type="submit" value="Insert Image"></td>
          </tr>
        </table>
        </form></td>
      </tr>
      <tr>
        <td height="20" align="center" style="padding:2px; ">&nbsp;</td>
      </tr>
    </table></td>
  </tr>
</table>
</body>
</html>
<script type="text/javascript">
view_change(false);
</script>
<?
//--------------------------------------------------------------------------
if(strlen($_FILES['file']['name'])>1){
	$uploaded = true;
//print_r($_FILES);
	if(strpos($_FILES['file']['type'],'image')!==false){
		$filename_arr =explode('.',$_FILES['file']['name']);
		if(count($filename_arr)<2)		{ $exp = ''; }
		else{ $exp = $filename_arr[count($filename_arr)-1];}
		$uploaded_file = $upload_path.'/'.time().'_'.str_replace('.','',$_SERVER['REMOTE_ADDR']).'.'.$exp;		
		$uploaded_file_url = $upload_url.'/'.time().'_'.str_replace('.','',$_SERVER['REMOTE_ADDR']).'.'.$exp;		
		if($_FILES['file']['size']>$max_size){
		print("
		<script> 
		alert('file size too big! \\n[{$_FILES['file']['size']}>$max_size] byte');
		</script>
		");
		$uploaded = false;
		}else{
	
			if(!is_dir($upload_path)){
				mkdir($upload_path) or exit('Error : make dir');
				@chmod($upload_path,0777);
			}
			if (move_uploaded_file($_FILES['file']['tmp_name'], $uploaded_file)) {
				@chmod($uploaded_file,0777);
	//			print "파일이 존재하고, 성공적으로 업로드 되었습니다.";
	//			print "추가 디버깅 정보입니다:\n";
			} else {
				exit('Error : upload file');
			}
			list($width, $height, $type, $attr) = getimagesize($uploaded_file);
			if($_REQUEST['ta1_width'] < 30){$_REQUEST['ta1_width']=$width;}
			if($_REQUEST['ta1_height'] < 30){$_REQUEST['ta1_height']=$height;}
			if($_REQUEST['ta1_width']>=500){$_REQUEST['ta1_width']=500;}
			if($_REQUEST['ta1_height']>=500){$_REQUEST['ta1_height']=500;}
		}
	}
}
?><?
if($uploaded && $uploaded_file_url != ''){
?>
<script type="text/javascript">
function insert_image_file(href){
	if(!opener){alert('not exist parent page'); self.close();}
//	opener.ta_wysiwyg._execCommand("insertimage",false,href);
	var str = '<img src="'+href+'" border=0 width="<?=$_REQUEST['ta1_width']?>" height="<?=$_REQUEST['ta1_height']?>" />';
	opener.ta_wysiwyg._pasteHTML(str);
	self.close();
}
insert_image_file('<?=$uploaded_file_url?>');
</script>
<?
exit();
}else if($uploaded){
?>
<script>
alert('Error : File is not Image');
self.close();
</script>
<?
exit();
}
//-------------------------------------------------------------------------------------------------------------
?>
