<?php

header('Content-Type: text/plain; charset=utf-8');

//$temp = explode(".", $_FILES["file"]["name"]);
//$newfilename = round(microtime(true)) . '.' . end($temp);
//move_uploaded_file($_FILES["file"]["tmp_name"], "../img/imageDirectory/" . $newfilename);

try {
    
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (!isset($_FILES['upfile']['error']) ||
        is_array($_FILES['upfile']['error'])
    ) {
        // fail silently
        // C1 = invalid file paramater
        throw new RuntimeException('C1: Contact your admin');
    }
    
    // Check $_FILES['upfile']['error'] value.
    switch ($_FILES['upfile']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
            case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException('Exceeded filesize limit.');
                    default:
                        throw new RuntimeException('Unknown errors.');
                }
                
                // You should also check filesize here.
                if ($_FILES['upfile']['size'] > 8000000) {
                    throw new RuntimeException('Exceeded filesize limit.');
                }
                
                // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
                // Check MIME Type by yourself.
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mime = finfo_file($finfo, $_FILES['upfile']['tmp_name']);
                $ok = false;
                if ($mime === 'application/pdf') {
                    $ok = true;
                } else if (false ===  exif_imagetype($_FILES['upfile']['tmp_name'])) {
                    throw new RuntimeException('Invalid file format.');
                }
                $ext = pathinfo($_FILES['upfile']['tmp_name'], PATHINFO_EXTENSION);
                // You should name it uniquely.
                // DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
                // On this example, obtain safe unique name from its binary data.
                $uploadedname = sprintf('../../sch/%s.%s',
                sha1_file($_FILES['upfile']['tmp_name']).bin2hex(mcrypt_create_iv(6, MCRYPT_DEV_URANDOM)),
                $ext
                );
                if (!move_uploaded_file(
                    $_FILES['upfile']['tmp_name'],
                $uploadedname
                )) {
                    throw new RuntimeException('Failed to move uploaded file.');
                }
                
                $noExecMode = 0644;
                chmod($uploadedname, $noExecMode);
                
                $arr = array('name' => $_FILES['upfile']['name'],
                'size' => $_FILES['upfile']['size'],
                'uploadedname' => $uploadedname);
                //                header('Access-Control-Allow-Origin: http://localhost:3000', false);
                header('access-control-allow-origin: http://localhost:3000', false);
                header('Content-Type: application/json; charset=utf-8');
                header('HTTP/1.1 201 Created');
                echo json_encode($arr);
                
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