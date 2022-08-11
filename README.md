# Cubecart plugin for Lunar

The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.

## Supported Cubecart versions

*The plugin has been tested with most versions of Cubecart at every iteration. We recommend using the latest version of Cubecart, but if that is not possible for some reason, test the plugin with your Cubecart version and it would probably function properly.*

## Installation

Once you have installed Cubecart, follow these simple steps:
1. Signup at [lunar.app](https://lunar.app) (it’s free)
1. Create an account
1. Create an app key for your Cubecart website
1. Upload the `Lunar_Payments` folder to the `modules\plugins` folder
1. Insert Lunar API keys, from https://lunar.app to the extension settings page you can find under the available extensions section in your admin.

## Updating settings

Under the Lunar payment method settings, you can:
   * Update the payment method description in the payment gateways list
   * Update the title that shows up in the payment popup
   * Add public & app keys
   * Change the capture type (Instant/Delayed)

**Make sure to clear the cache after any setting update**

## How to

1. Capture
   * In Instant mode, the orders are captured automatically
   * In delayed mode you can capture an order by changing its status to `Order Complete`
2. Refund
   * To refund an order move you can use the the `Refund` tab which is available for all captured orders
3. Void
   * All non captured orders will have a `Void` tab you can use for the void

## Available features

1. Capture
   * Cubecart admin panel: full capture
   * Lunar admin panel: full/partial capture
2. Refund
   * Cubecart admin panel: full refund
   * Lunar admin panel: full/partial refund
3. Void
   * Cubecart admin panel: full void
   * Lunar admin panel: full/partial void
