<?php

// check url
if ( preg_match('/\/(?:css|captcha|forum|img|js)\/./', $_SERVER['REQUEST_URI']) ) {
	// serve the requested resource as-is.
    return false;
}

// main application include
include '../library/app.core.php';

// additional modules
include PATH_LIBRARY . 'firephp.php';

// core modules
include PATH_LIBRARY . 'app.db.php';
include PATH_LIBRARY . 'app.init.php';
include PATH_LIBRARY . 'app.tools.php';
include PATH_LIBRARY . 'app.cache.php';

// all the magic
app::run();

?>