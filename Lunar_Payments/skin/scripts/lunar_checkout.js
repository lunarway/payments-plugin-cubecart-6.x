jQuery(function ($) {
    /**
     * Object to handle Lunar payment forms.
     */
    var cc_lunar_form = {

            /**
             * Initialize e handlers and UI state.
             */
            init: function (form) {
                this.form = form;
                this.lunar_submit = false;
                $(this.form).on('click', '#checkout_proceed', this.onSubmit);
            },
            isLunarChosen: function () {
                return $('input#Lunar_Payments').is(':checked');
            },
            isLunarModalNeeded: function () {
                var token = cc_lunar_form.form.find('input.lunar_token').length,
                    card = cc_lunar_form.form.find('input.lunar_card_id').length,
                    $required_inputs;

                // If this is a lunar submission (after modal) and token exists, allow submit.
                if (cc_lunar_form.lunar_submit && token) {
                  if (cc_lunar_form.form.find('input.lunar_token').val() !== '')
                    return false;
                }

                // If this is a lunar submission (after modal) and card exists, allow submit.
                if (cc_lunar_form.lunar_submit && card) {
                  if (cc_lunar_form.form.find('input.lunar_card_id').val() !== '')
                    return false;
                }

                // Don't affect submission if modal is not needed.
                if (!cc_lunar_form.isLunarChosen()) {
                    return false;
                }

                // if address isn't defined yet
                if(!cc_lunar_params.address_defined) {
                    return false;
                }

                // Don't open modal if required fields are not complete
                if ($('input#reg_terms').length === 1 && $('input#reg_terms:checked').length === 0) {
                    return false;
                }
                var $account_password = $('#reg_password');
                if ($('#show-reg').is(':checked') && $account_password.length && $account_password.val() === '') {
                    return false;
                }

                // check required inputs
                $required_inputs = $('input[required]');
                if ($required_inputs.length) {
                    var required_error = false;

                    $required_inputs.each(function () {
                        if ($(this).find('input, select').val() === '') {
                            required_error = true;
                        }
                    });

                    if (required_error) {
                        return false;
                    }
                }
                return true;
            },
            getName: function () {
                var $name = $("[name='user[first_name]']");
                var name = '';
                if ($name.length > 0) {
                    name = $name.val() + ' ' + $("[name='user[last_name]']").val();
                } else {
                    name = cc_lunar_params.name;
                }
                return cc_lunar_form.escapeQoutes(name);
            },
            getAddress: function () {
                var $address = $("[name='billing[line1]']");
                var address = '';
                if ($address.length > 0) {
                    address = $address.val() + ' ' + $("[name='billing[line2]']").val();
                } else {
                    address = cc_lunar_params.address;
                }
                return cc_lunar_form.escapeQoutes(address);
            },
            getPhoneNo: function () {
                var $phone = $("[name='user[phone]']");
                var phone = '';
                if ($phone.length > 0) {
                    phone = $phone.val()
                } else {
                    phone = cc_lunar_params.phone;
                }
                return cc_lunar_form.escapeQoutes(phone);
            },
            getEmail: function () {
                var $phone = $("[name='user[email]']");
                var phone = '';
                if ($phone.length > 0) {
                    phone = $phone.val()
                } else {
                    phone = cc_lunar_params.email;
                }
                return cc_lunar_form.escapeQoutes(phone);
            },
            onSubmit: function (e) {
                if (cc_lunar_form.isLunarModalNeeded()) {
                    e.preventDefault();

                    // Capture submit and open lunar modal
                    var $form = cc_lunar_form.form,
                        token = $form.find('input.lunar_token');

                    console.log($form);

                    token.val('');

                    var name = cc_lunar_form.getName();
                    var phoneNo = cc_lunar_form.getPhoneNo();
                    var address = cc_lunar_form.getAddress();
                    var eMail = cc_lunar_form.getEmail();

                    /** Initialize Lunar object. */
                    var lunar = Paylike({key: cc_lunar_params.key});

                    var args = {
                        test: ('test' == cc_lunar_params.test_mode) ? (true) : (false),
                        title: cc_lunar_params.title,
                        amount: {
                            currency: cc_lunar_params.currency,
                            exponent: cc_lunar_params.exponent,
                            value: cc_lunar_params.amount
                        },
                        locale: cc_lunar_params.locale,
                        custom: {
                            email: eMail,
                            // orderId: cc_lunar_params.order_id, //omit orderId
                            products: [cc_lunar_params.products],
                            customer: {
                                name: name,
                                email: eMail,
                                phoneNo: phoneNo,
                                address: address,
                                IP: cc_lunar_params.customer_IP
                            },
                            platform: {
                                name: 'Cubecart',
                                version: cc_lunar_params.platform_version
                            },
                            lunarPluginVersion: cc_lunar_params.version
                        }
                    };


                    // used for cases like trial,
                    // change payment method
                    // see @https://github.com/paylike/sdk#popup-to-save-tokenize-a-card-for-later-use
                    if (args.amount === 0) {
                        delete args.amount;
                        delete args.currency;
                    }

                    lunar.pay(args,
                        function (err, res) {
                          if(err=='closed') { return false; }
                          if (res.transaction) {
                              var trxid = res.transaction.id;
                              $form.find('input.lunar_token').remove();
                              $form.append('<input type="hidden" class="lunar_token" name="lunar_token" value="' + trxid + '"/>');
                          } else {
                              var cardid = res.card.id;
                              $form.find('input.lunar_card_id').remove();
                              $form.append('<input type="hidden" class="lunar_card_id" name="lunar_card_id" value="' + cardid + '"/>');
                          }
                          cc_lunar_form.lunar_submit = true;
                          $form.submit();
                        }
                    );

                    return false;
                }
                return true;
            },
            escapeQoutes:function(str) {
                return str.toString().replace(/"/g, '\\"');
            }
        }
    ;

    cc_lunar_form.init($("form#checkout_form"));
});
