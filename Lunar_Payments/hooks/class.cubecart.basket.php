<?php
if(!defined('CC_INI_SET')) die('Access Denied');


//include currency handling
require 'modules/plugins/Lunar_Payments/currencies.php';

// Build Lunar JS Params (cc_lunar_params)
$selmod = $GLOBALS['db']->select('CubeCart_modules','*',array('folder'=>'Lunar_Payments'));
$lunar = $selmod[0];
$modcfg = $GLOBALS['config']->get('Lunar_Payments');
$lunarjs['customer_IP'] = get_ip_address();
$lunarjs['key'] = $modcfg['livekey_public'];
if($modcfg['mode']=='test') { $lunarjs['key'] = $modcfg['testkey_public']; }
$lunarjs['order_id'] = isset($GLOBALS['cart']->basket['cart_order_id'])?$GLOBALS['cart']->basket['cart_order_id']:'';
$lunarjs['products'] = array();
$cart_contents = $GLOBALS['cart']->basket['contents'];
if(is_array($cart_contents)) {
  foreach ($cart_contents as $cp) {
    $lunarjs['products'][] = array('ID'=>$cp['id'],'name'=>$cp['name'],'quantity'=>$cp['quantity']);
  }
}
$lunarjs['platform_version'] = CC_VERSION;
$lunarjs['version'] = 'Unknown';

// load plugin config xml
try {
    $xml   = new SimpleXMLElement(file_get_contents('modules/plugins/Lunar_Payments/config.xml'));
} catch (Exception $e) {
    trigger_error($e, E_USER_WARNING);
}

// get version info from xml
if (is_object($xml)) {
  if(isset($xml->info->version)) {
    $lunarjs['version'] = (string)$xml->info->version;
  }
}

if ($GLOBALS['session']->has('currency', 'client')) {
    $clientCurrency = $GLOBALS['session']->get('currency', 'client');
} else {
    $clientCurrency = $storeCurrency;
}

$lunarjs['test_mode'] = $modcfg['mode'];
$lunarjs['title'] = $modcfg['paydescription'] ?? $GLOBALS['config']->get('config','store_name');
$lunarjs['currency'] = $clientCurrency;
$lunarjs['amount'] = (int)(get_lunar_amount($GLOBALS['cart']->getTotal(), $clientCurrency));
$lunarjs['exponent'] = get_lunar_currency($clientCurrency)['exponent'];
$lunarjs['locale'] = $GLOBALS['config']->get('config','default_language');

$lunarjs['address_defined'] = false;
$user = $GLOBALS['user']->get();
if($user) {
  $lunarjs['name'] = $user['first_name']." ".$user['last_name'];
  $lunarjs['email'] = $user['email'];
  $lunarjs['phone'] = $user['phone'];
  $uad = $GLOBALS['user']->getAddresses(false); // default billing address, true for all addresses
  $lunarjs['address'] = implode(' ', array($uad[0]['line1'], $uad[0]['line2'], $uad[0]['town'], $uad[0]['state'], $uad[0]['postcode'], $uad[0]['country']));
  $lunarjs['address_defined'] = true;
}

if(isset($GLOBALS['cart']->basket['billing_address']['user_defined'])) {
  if($GLOBALS['cart']->basket['billing_address']['user_defined']) {
    $lunarjs['address_defined'] = true;
  }
}

$content .= '<script type="text/javascript">var cc_lunar_params = '.json_encode($lunarjs).';</script>
<script src="modules/plugins/Lunar_Payments/skin/scripts/lunar_checkout.js"></script>
<script src="https://sdk.paylike.io/a.js"></script>';
