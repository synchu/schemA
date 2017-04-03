<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
      //  header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

try {
    
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (!isset($_POST['file']))
    {
        // fail silently
        // C2 = invalid download file param
        throw new RuntimeException('C2: Invalid parameters. Contact your admin');
    }
    
    $file = filter_input(INPUT_POST, 'file', FILTER_SANITIZE_STRING);
    $uploadedname = filter_input(INPUT_POST, 'uploadedname', FILTER_SANITIZE_STRING);
    $return = filter_input(INPUT_POST, 'return', FILTER_SANITIZE_STRING);
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $path = pathinfo($uploadedname, PATHINFO_DIRNAME);

    if ($return !== "inline" && $return !== "attachment"){
        // fail silently
        // C6 = invalid return type specified
        throw new RuntimeException('C6: Invalid return type. Contact your admin:'.$return);
    }
    
    if (strpos($path, '../../sch') === false){
        // fail silently
        // C3 = invalid path specified
        throw new RuntimeException('C3: Invalid path. Contact your admin');
    }
    
    $content = 'application/pdf';
    switch ($ext) {
        case 'jpeg':
            case 'jpg':
                $content = 'image/jpeg';
                break;
            case 'gif':
                $content = 'image/gif';
                break;
            case 'tiff':
                $content = 'image/tiff';
                break ;
        }

        if (file_exists($uploadedname)) {
            // ob_end_flush();
            ob_start();
           // header('Access-Control-Allow-Origin:*');
            header('Content-Description: File Transfer');
            header('Content-Type: '.$content);
            header('Content-Disposition: '.$return.'; filename="'.basename($file).'"');
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($uploadedname),false);
            ob_clean();
            ob_end_flush();
            readfile($uploadedname);

            exit;
        } else {
            // fail silently
            // C4 = invalid download file param
            throw new RuntimeException('C4: File not available. Contact your admin with info:'.$uploadedname);
        }
        
    } catch (RuntimeException $e) {

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Access-Control headers are received during OPTIONS requests


        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        
      if (isset($_SERVER['CONTENT_TYPE']))
            header("Content-Type:        {$_SERVER['CONTENT_TYPE']}");

          header('Content-Type: image/jpeg');
        exit(0);
    
        } else {
           // header('access-control-allow-origin: http://localhost:3000', false);
            header('HTTP/1.1 500 Internal Server Error');
            echo $e->getMessage();
        }
       
        
    }
    
    ?>