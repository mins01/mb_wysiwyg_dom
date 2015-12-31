<?php
//서버 언어셋에 맞게 파일을 다시 저장해주세요.
//이 파일은 euc-kr로 인코딩 되어있습니다.

// 과거의 날짜
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// 항상 변경됨
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// HTTP/1.0
header("Pragma: no-cache");

$allow_exp = array('jpg','jpeg','jpe','gif','png');
?>
<?
	$upload_path = dirname(__FILE__).'/upload/'.date('Ym');
	$upload_url = dirname($_SERVER['HTTP_REFERER']).'/upload/'.date('Ym');
	$uploaded = false;
	$uploaded_file = '';
	$max_size = 500*1024;  //================ 필수수정
	$error_msg = '';
	print($upload_path);
	
	/*
	if($_REQUEST['timedata'])
	{
		$timedata = $_REQUEST['timedata'];	
	}else{
		$timedata =	time().'_'.str_replace('.','',$_SERVER['REMOTE_ADDR']);
	}
	*/
	
?><?
//--------------------------------------------------------------------------
if(strlen($_FILES['file']['name'])>1){
	$uploaded = true;
//print_r($_FILES);
	$filename_arr = pathinfo($_FILES['file']['name']);
	/*
echo $path_parts['dirname'], "\n";
echo $path_parts['basename'], "\n";
echo $path_parts['extension'], "\n";
echo $path_parts['filename'], "\n"; // since PHP 5.2.0
	*/
	$exp = $filename_arr['extension'];
	if(strpos($_FILES['file']['type'],'image')!==false){
		if(!in_array(strtolower($exp),$allow_exp)){
			$error_msg = 'Error : Not Allow Image';
			exit("<script>alert('$error_msg');</script>");	
		}	
		if(function_exists("md5_file")){ //4.2.0 이상에서만 존재
			$md5_file = md5_file ($_FILES['file']['tmp_name']);
		}else{
			$temp_file = file($_FILES['file']['tmp_name']);
			$check_line = $temp_file[0].$temp_file[flooe((count($temp_file)-1)/2)].$temp_file[count($temp_file)-1];
			$md5_file = md5($check_line);
			unset($temp_file);
			$temp_file = array();
			unset($temp_file);
		}
		
		$timedata = $md5_file;
		$uploaded_file = $upload_path.'/'.$timedata.'.'.$exp;		
		$uploaded_file_url = $upload_url.'/'.$timedata.'.'.$exp;		
		if($_FILES['file']['size']>$max_size){
		$error_msg = "file size too big! \\n[{$_FILES['file']['size']}>$max_size] byte";
		$uploaded = false;
		}else{
	
			if(!is_dir($upload_path)){
				mkdir($upload_path) or exit('Error : make dir');
				@chmod($upload_path,0777);
			}
			//============== 중복파일 체크 용 md5_file
			
			if(is_file($uploaded_file)){
				//같은 파일이 있으므로 업로드 하지 않고 그 파일을 사용한다
				//md5 를 사용하기 때문에 완벽하지는 않다. 하지만 거의 중복될 일은 없다.
			}else if (move_uploaded_file($_FILES['file']['tmp_name'], $uploaded_file)) {
				@chmod($uploaded_file,0777);
				print "파일이 존재하고, 성공적으로 업로드 되었습니다.";
	//			print "추가 디버깅 정보입니다:\n";
			} else {
				$error_msg = 'Error : Upload Fail';
				exit("<script>alert('$error_msg');</script>");
				
			}
			list($width, $height, $type, $attr) = getimagesize($uploaded_file);
			if($_REQUEST['v_width'] < 30){$_REQUEST['v_width']=$width;}
			if($_REQUEST['v_height'] < 30){$_REQUEST['v_height']=$height;}
			if($_REQUEST['v_width']>=500){$_REQUEST['v_width']=500;}
			if($_REQUEST['v_height']>=500){$_REQUEST['v_height']=500;}
		}
	}else{
		$error_msg = 'Error : Not Image';
		exit("<script>alert('$error_msg');</script>");	
	}
}
?><?
if($uploaded && $uploaded_file_url != ''){
?>
	<script>
	opener = parent;

	var url = '<?=$uploaded_file_url?>';
	var width = '<?=$_REQUEST['v_width']?>';
	var height = '<?=$_REQUEST['v_height']?>';
	var error = '<?=$error_msg?>';
	var timedata = '<?=$timedata?>';
	opener.init_value_upload(url,width,height,timedata,error);
	</script>
	<?
	exit('Sucess upload');
}else if($uploaded){
	$error_msg = 'Error : File is not Image';
	exit("<script>alert('$error_msg');</script>");
}else{
	exit("<script>alert('$error_msg');</script>");
}
exit();
//-------------------------------------------------------------------------------------------------------------

//print_r($_REQUEST);
//print_r($_FILES);
?>