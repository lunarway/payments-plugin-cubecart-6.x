<?php
// The line below prevents direct access to this file which may lead to a path disclosure vulnerability
if(!defined('CC_DS')) die('Access Denied');

# Save latest transaction ID
if(isset($_POST['lunar_token'])) {
   $_SESSION['lunar_token'] = $_POST['lunar_token'];
}

#Display Lunar Option on Checkout Page
if(isset($_GET['_a'])&&in_array($_GET['_a'],array('checkout','basket','confirm'))) {
  $settings	= $GLOBALS['config']->get('Lunar_Payments');

  // Lunar enabled
  if ($settings['status']) {
    $selmod = $GLOBALS['db']->select('CubeCart_modules','*',array('folder'=>'Lunar_Payments'));
    $lunar = $selmod[0];
    $lunar['plugin'] = true;
    $lunar['base_folder'] = 'Lunar_Payments';
    $lunar['desc'] = $settings['desc'];

    //If Lunar is default, reset other gateways default to 0
    $newgws = $gateways;
    if($settings['default']) {
      foreach ($newgws as $gwk=>$gw) {
        $newgws[$gwk]['default'] = 0;
      }
    }

    $newgws[] = $lunar;
    usort($newgws, function($a, $b) {
      if(!isset($a['position'])) { $a['position']=100; } // prevent PHP notice errors
      if(!isset($b['position'])) { $b['position']=100; }
      if ($a['position'] == $b['position']) {
        return 0;
      }
      return ($a['position'] < $b['position']) ? -1 : 1;
    });
    $gateways=$newgws;
  }
}

#Proceed to Gateway Page
if(isset($_GET['_a'])&&$_GET['_a']=='gateway') {
  if($gateways[0]['folder']=='Lunar_Payments') {
    $gateways[0]['plugin'] = true;
    $gateways[0]['base_folder'] = 'Lunar_Payments';
  }
}
