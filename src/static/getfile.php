<?php

header('Content-Type: text/plain; charset=utf-8');

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
    echo $return == "inline";

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
            header('Content-Description: File Transfer');
            header('Content-Type:'.$content );
            header('Content-Disposition: '.$return.'; filename='.basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($uploadedname));
            ob_clean();
            flush();
            readfile($uploadedname);
            exit;
        } else {
            // fail silently
            // C4 = invalid download file param
            throw new RuntimeException('C4: File not available. Contact your admin with info:'.$uploadedname);
        }
        
    } catch (RuntimeException $e) {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header('Access-Control-Allow-Origin: http://localhost:3000', false);
            header('Access-Control-Allow-Headers: Access-Control-Allow-Origin');
            header('Access-Control-Allow-Methods: POST, OPTIONS');
            header('Content-Type: application/json', false);
            header('Content-Type: text/plain; charset=utf-8', false);
            header('Allow: POST, OPTIONS');
            header('HTTP/1.1 200 OK');
        } else {
            header('access-control-allow-origin: http://localhost:3000', false);
            header('HTTP/1.1 500 Internal Server Error');
            echo $e->getMessage();
        }
        
    }
    
    ?>